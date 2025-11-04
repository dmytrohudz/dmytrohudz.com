// GitHub OAuth callback handler for Decap CMS
// This receives the code from GitHub and exchanges it for an access token

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  
  if (!code) {
    return new Response('No authorization code provided', { status: 400 });
  }

  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response('GitHub OAuth not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.', { status: 500 });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      return new Response(`GitHub OAuth error: ${tokenData.error_description}`, { status: 400 });
    }

    // Return HTML that posts the token back to the CMS window
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Authorizing...</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #f5f5f5;
    }
    .message {
      text-align: center;
      padding: 2rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <div class="message">
    <h2>Authorization Successful</h2>
    <p>You can close this window and return to the CMS.</p>
  </div>
  <script>
    (function() {
      const token = ${JSON.stringify(tokenData.access_token)};
      const provider = "github";
      
      function receiveMessage(e) {
        console.log("receiveMessage from CMS", e);
        
        // Send success message with token
        const data = {
          token: token,
          provider: provider
        };
        
        window.opener.postMessage(
          "authorization:" + provider + ":success:" + JSON.stringify(data),
          e.origin
        );
        
        window.removeEventListener("message", receiveMessage, false);
      }
      
      window.addEventListener("message", receiveMessage, false);
      
      console.log("Posting ready message to CMS");
      // Let the CMS know we're ready
      window.opener.postMessage("authorizing:" + provider, "*");
    })();
  </script>
</body>
</html>
    `;

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('OAuth error:', error);
    return new Response(`Authentication error: ${error.message}`, { status: 500 });
  }
}


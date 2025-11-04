// GitHub OAuth handler for Decap CMS on Cloudflare Pages
// This initiates the OAuth flow by redirecting to GitHub

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const clientId = env.GITHUB_CLIENT_ID;
  
  if (!clientId) {
    return new Response('GitHub Client ID not configured. Please set GITHUB_CLIENT_ID environment variable in Cloudflare Pages settings.', { status: 500 });
  }

  // Redirect to GitHub OAuth authorization page
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.set('client_id', clientId);
  githubAuthUrl.searchParams.set('scope', 'repo,user');
  githubAuthUrl.searchParams.set('redirect_uri', `${url.origin}/api/callback`);

  return Response.redirect(githubAuthUrl.toString(), 302);
}


// Cloudflare Function to serve posts
export async function onRequest(context) {
    const { request, env } = context;
    const url = new URL(request.url);
    
    // Handle CORS for Decap CMS
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }
    
    // Serve posts as JSON
    if (url.pathname === '/api/posts') {
        try {
            // Try to read from posts.json file
            const postsData = await fetch(`${url.origin}/posts.json`);
            if (postsData.ok) {
                const posts = await postsData.json();
                return new Response(JSON.stringify(posts), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store, no-cache, must-revalidate',
                        'Pragma': 'no-cache',
                        ...corsHeaders
                    }
                });
            } else {
                // Fallback to empty array if posts.json doesn't exist
                return new Response(JSON.stringify([]), {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-store, no-cache, must-revalidate',
                        'Pragma': 'no-cache',
                        ...corsHeaders
                    }
                });
            }
        } catch (error) {
            return new Response(JSON.stringify({ error: 'Failed to load posts' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'Pragma': 'no-cache',
                    ...corsHeaders
                }
            });
        }
    }
    
    return new Response('Not Found', { status: 404 });
}

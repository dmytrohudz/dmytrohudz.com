// Cloudflare Function to handle ButtonDown newsletter subscriptions
export async function onRequest(context) {
    const { request, env } = context;
    
    // Handle CORS
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }
    
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }
    
    try {
        // Parse the request body
        const { email } = await request.json();
        
        // Validate email
        if (!email || !isValidEmail(email)) {
            return new Response(JSON.stringify({ error: 'Invalid email address' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }
        
        // Get ButtonDown API key from environment variables
        const BUTTONDOWN_API_KEY = env.BUTTONDOWN_API_KEY;
        
        if (!BUTTONDOWN_API_KEY) {
            console.error('BUTTONDOWN_API_KEY not configured');
            return new Response(JSON.stringify({ error: 'Server configuration error' }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    ...corsHeaders
                }
            });
        }
        
        // Subscribe to ButtonDown
        const buttondownResponse = await fetch('https://api.buttondown.email/v1/subscribers', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${BUTTONDOWN_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                tags: ['website']
            })
        });
        
        const responseData = await buttondownResponse.json();
        
        if (!buttondownResponse.ok) {
            // Handle specific ButtonDown errors
            if (buttondownResponse.status === 400) {
                // Email already subscribed or validation error
                const errorMessage = responseData.email?.[0] || responseData.detail || 'Invalid email address';
                return new Response(JSON.stringify({ error: errorMessage }), {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        ...corsHeaders
                    }
                });
            }
            
            throw new Error(`ButtonDown API error: ${buttondownResponse.status}`);
        }
        
        // Success
        return new Response(JSON.stringify({ 
            success: true, 
            message: 'Successfully subscribed!' 
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
        
    } catch (error) {
        console.error('Subscription error:', error);
        return new Response(JSON.stringify({ 
            error: 'Failed to subscribe. Please try again later.' 
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }
}

// Email validation helper
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}



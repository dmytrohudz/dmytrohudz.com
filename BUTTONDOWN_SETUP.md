# ButtonDown Newsletter Setup Guide

This guide explains how to configure the ButtonDown API integration for the subscribe functionality.

## Prerequisites

1. A [ButtonDown](https://buttondown.email/) account
2. A Cloudflare Pages deployment (or compatible serverless environment)

## Setup Instructions

### Step 1: Get Your ButtonDown API Key

1. Log in to your ButtonDown account at [https://buttondown.email/](https://buttondown.email/)
2. Navigate to **Settings** → **Programming** → **API Keys**
3. Copy your API key (it will look something like: `sk-...`)

### Step 2: Configure Environment Variable in Cloudflare

1. Go to your Cloudflare Dashboard
2. Navigate to **Pages** → Select your project
3. Go to **Settings** → **Environment Variables**
4. Add a new environment variable:
   - **Variable name**: `BUTTONDOWN_API_KEY`
   - **Value**: Your ButtonDown API key (from Step 1)
   - **Environment**: Choose "Production" and "Preview" (or as needed)
5. Click **Save**

### Step 3: Redeploy Your Site

After adding the environment variable, you'll need to redeploy your site for the changes to take effect:

1. Go to **Deployments** in your Cloudflare Pages project
2. Click on **Create deployment** or push a new commit to trigger a deployment

## Testing the Integration

1. Visit your subscribe page: `https://yourdomain.com/subscribe.html`
2. Enter a test email address
3. Click the "subscribe" button
4. You should receive a confirmation email from ButtonDown
5. Check your ButtonDown dashboard to see the new subscriber

## Troubleshooting

### "Server configuration error" message

- **Problem**: The `BUTTONDOWN_API_KEY` environment variable is not set or not accessible
- **Solution**: Double-check that you've added the environment variable in Cloudflare Pages settings and redeployed

### "Invalid email address" or "Email already subscribed" message

- **Problem**: The email format is invalid or the email is already in your subscriber list
- **Solution**: This is expected behavior. Try with a different, valid email address

### Network errors

- **Problem**: The serverless function can't reach ButtonDown's API
- **Solution**: 
  - Check your network connection
  - Verify that ButtonDown's API is accessible (check [ButtonDown status](https://status.buttondown.email/))
  - Review the Cloudflare Functions logs for detailed error messages

## API Endpoint

The subscription form sends POST requests to: `/api/subscribe`

The serverless function is located at: `functions/api/subscribe.js`

## Features

- ✅ Email validation (client-side and server-side)
- ✅ Real-time input validation
- ✅ Loading states
- ✅ Error handling with user-friendly messages
- ✅ Success confirmation
- ✅ Automatic tagging (subscribers are tagged with 'website')
- ✅ Responsive design

## Customization

### Change the subscriber tag

Edit `functions/api/subscribe.js` and modify the `tags` array:

```javascript
body: JSON.stringify({
    email: email,
    tags: ['your-custom-tag']  // Change 'website' to your preferred tag
})
```

### Add additional subscriber metadata

You can add more fields to the ButtonDown API request:

```javascript
body: JSON.stringify({
    email: email,
    tags: ['website'],
    metadata: {
        source: 'website',
        timestamp: new Date().toISOString()
    }
})
```

## Security

- The API key is stored securely as an environment variable and never exposed to the client
- Email validation is performed on both client and server side
- CORS headers are configured to allow only necessary methods

## Additional Resources

- [ButtonDown API Documentation](https://api.buttondown.email/v1/schema)
- [Cloudflare Pages Functions Documentation](https://developers.cloudflare.com/pages/platform/functions/)



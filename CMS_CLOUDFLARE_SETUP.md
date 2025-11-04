# Decap CMS Setup Guide for Cloudflare Pages

This guide will help you set up Decap CMS authentication with GitHub OAuth on Cloudflare Pages.

## Step 1: Create a GitHub OAuth App

1. Go to GitHub Settings: https://github.com/settings/developers
2. Click on **"OAuth Apps"** in the left sidebar
3. Click **"New OAuth App"** button
4. Fill in the application details:
   - **Application name**: `Dmytro Hudz CMS` (or any name you prefer)
   - **Homepage URL**: `https://dmytrohudz.com`
   - **Application description**: `Content management for dmytrohudz.com` (optional)
   - **Authorization callback URL**: `https://dmytrohudz.com/api/callback`
5. Click **"Register application"**
6. You'll see your **Client ID** - copy this
7. Click **"Generate a new client secret"** and copy the secret (you won't be able to see it again!)

## Step 2: Configure Cloudflare Pages Environment Variables

1. Go to your Cloudflare dashboard: https://dash.cloudflare.com
2. Select **Workers & Pages** from the left sidebar
3. Find and click on your **dmytrohudz.com** site
4. Go to **Settings** tab
5. Scroll down to **Environment variables** section
6. Add the following environment variables for **Production**:
   - Variable name: `GITHUB_CLIENT_ID`
     Value: [paste your GitHub OAuth Client ID]
   - Variable name: `GITHUB_CLIENT_SECRET`
     Value: [paste your GitHub OAuth Client Secret]

7. **Important**: Also add these same variables to **Preview** environment if you want CMS to work in preview deployments

## Step 3: Deploy Your Changes

1. Commit and push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Configure Decap CMS for Cloudflare Pages with GitHub OAuth"
   git push
   ```

2. Cloudflare Pages will automatically deploy your changes

## Step 4: Test the CMS

1. Go to: https://dmytrohudz.com/admin/
2. Click **"Login with GitHub"**
3. You should be redirected to GitHub for authorization
4. After authorizing, you'll be redirected back to the CMS and logged in

## Troubleshooting

### "GitHub Client ID not configured" error
- Make sure you've set the `GITHUB_CLIENT_ID` environment variable in Cloudflare Pages
- Environment variables require a new deployment to take effect - try triggering a new deployment

### "GitHub OAuth error" message
- Check that your `GITHUB_CLIENT_SECRET` is correct
- Make sure the authorization callback URL in your GitHub OAuth app matches: `https://dmytrohudz.com/api/callback`

### Authorization window closes but nothing happens
- Check your browser console for errors
- Make sure pop-ups are not blocked for your site
- Try clearing your browser cache and cookies

### "Not Found" when accessing /admin/
- Make sure the `admin` folder with `index.html` and `config.yml` is deployed
- Check Cloudflare Pages build logs to ensure files were deployed correctly

## Files Modified

The following files were created/modified for this setup:

- `admin/config.yml` - Updated to use custom OAuth endpoint
- `functions/api/auth.js` - Initiates GitHub OAuth flow
- `functions/api/callback.js` - Handles OAuth callback and returns token to CMS

## Security Notes

- Never commit your `GITHUB_CLIENT_SECRET` to your repository
- The OAuth app only works with the callback URL you specified (https://dmytrohudz.com/api/callback)
- The CMS will have access to your GitHub repository with the scopes: `repo` and `user`
- Anyone who can access the CMS and authorize with GitHub will be able to edit your content

## Additional Configuration

If you want to restrict who can access the CMS, you can:
1. Add Cloudflare Access in front of `/admin/*` path
2. Add additional authentication checks in your Functions
3. Use GitHub repository permissions to control who can push to your repo


# Decap CMS - Final Setup Steps

Your Decap CMS is now configured to use **GitHub OAuth** authentication. Follow these steps to complete the setup:

## Step 1: Create a GitHub OAuth Application

1. Go to [GitHub Settings > Developer settings > OAuth Apps](https://github.com/settings/developers)
2. Click **"New OAuth App"** (or **"Register a new application"**)
3. Fill in the details:
   - **Application name**: `Dmytro Hudz CMS` (or any name you prefer)
   - **Homepage URL**: `https://dmytrohudz.com` (your production URL)
   - **Application description**: `Content management for dmytrohudz.com` (optional)
   - **Authorization callback URL**: `https://api.netlify.com/auth/done` ⚠️ **Important: Use this exact URL**
4. Click **"Register application"**
5. You'll see your **Client ID** - copy this
6. Click **"Generate a new client secret"** - copy this too (you won't be able to see it again)

## Step 2: Set Up Netlify as OAuth Provider

Even though you're hosting on Cloudflare Pages, you need Netlify to handle OAuth:

1. Go to [Netlify](https://app.netlify.com/) and sign up/login (it's free)
2. You **don't need to deploy your site to Netlify** - just create an account
3. Go to [Netlify OAuth Provider Settings](https://app.netlify.com/user/applications)
4. Scroll down to **"OAuth"** section
5. Under **"Authentication Providers"**, click **"Install Provider"**
6. Select **"GitHub"**
7. Enter your GitHub OAuth **Client ID** and **Client Secret** from Step 1
8. Click **"Install"**

## Step 3: Update Your Site Configuration

Update the Decap CMS config to use Netlify's OAuth:

**Option A: Keep using GitHub authentication (current setup)**
- Your `admin/config.yml` is already set to `name: github`
- This will authenticate you via GitHub when you access `/admin/`
- Works automatically without additional configuration!

**Option B: Add Netlify OAuth Gateway (if Option A doesn't work)**

Add this to your `admin/config.yml`:

```yaml
backend:
  name: github
  repo: dmytrohudz/dmytrohudz.com
  branch: main
  base_url: https://api.netlify.com # Netlify OAuth
  auth_endpoint: auth # Netlify OAuth
```

## Step 4: Deploy and Test

1. Commit all changes:
   ```bash
   git add .
   git commit -m "Configure Decap CMS with GitHub OAuth"
   git push origin main
   ```

2. Wait for Cloudflare Pages to rebuild (usually 1-2 minutes)

3. Visit `https://dmytrohudz.com/admin/`

4. You should see the Decap CMS login screen

5. Click **"Login with GitHub"** or it may redirect automatically

6. Authorize the application when prompted

7. You're in! Start creating posts 🎉

## Alternative: GitHub Backend (Simpler, No OAuth Setup)

If you want the **absolute simplest** setup:

1. Update `admin/config.yml`:
```yaml
backend:
  name: github
  repo: dmytrohudz/dmytrohudz.com
  branch: main
```

2. When you visit `/admin/`, you'll be prompted to authenticate with GitHub directly

3. Click **"Login with GitHub"**

4. **Important**: The first time you do this on Cloudflare Pages, you may need to authorize the CMS in your GitHub account settings

## After First Login

Once you successfully log in:

1. **Create a test post**:
   - Click "New Posts" button
   - Fill in the title, date, excerpt, and content
   - Click "Publish"
   - The post will be committed to your GitHub repo in the `posts/` folder

2. **Rebuild posts**:
   - After creating/editing posts, run: `node build-posts.js`
   - This converts markdown posts to `posts.json`
   - Commit and push the changes
   - Your posts will appear on your blog!

## Troubleshooting

### "Failed to load entries"
- Check that your repo name in `config.yml` matches your actual GitHub repo
- Verify you have write access to the repository

### "Authentication error"
- Clear your browser cache and cookies
- Try in an incognito/private window
- Make sure you're logged into GitHub

### "Cannot read repository"
- Ensure the repository is public, or
- Grant the OAuth app access to private repos in GitHub settings

### Posts not appearing on site
- Run `node build-posts.js` after creating posts
- Commit and push the generated `posts.json`
- Wait for Cloudflare Pages to rebuild

## Workflow Summary

1. **Create/Edit Posts**: Visit `/admin/` → Edit content
2. **Build Posts**: Run `node build-posts.js` locally
3. **Deploy**: Commit and push to GitHub
4. **Automatic Publish**: Cloudflare Pages rebuilds and deploys

## Optional: Automate Build Process

To automatically build posts on every commit, you can:

1. Add a build command in Cloudflare Pages:
   - Go to Settings → Builds & deployments
   - Build command: `node build-posts.js`
   - Build output directory: `/` (root)

2. Or use GitHub Actions to auto-commit `posts.json` when markdown files change

## Need Help?

- [Decap CMS Docs](https://decapcms.org/docs/)
- [GitHub Backend Guide](https://decapcms.org/docs/github-backend/)
- [Authentication Docs](https://decapcms.org/docs/authentication-backends/)


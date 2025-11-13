# Automated Post Deletion

This document explains how post deletion works automatically when using Decap CMS.

## How It Works

When you delete a post through the Decap CMS admin interface (`/admin/`), the following happens automatically:

### 1. **Decap CMS Deletes the Markdown File** 🗑️
- Decap CMS uses the GitHub backend
- When you delete a post, it commits the deletion to your GitHub repository
- The `.md` file is removed from the `/posts` folder

### 2. **GitHub Action Detects the Change** 🔍
- The GitHub Action workflow (`.github/workflows/build-posts.yml`) is triggered automatically
- It detects changes to the `/posts` folder

### 3. **Build Script Runs** 🔨
- The workflow runs `npm run build` which executes `build-posts.js`
- The build script automatically:
  - ✅ Removes the deleted post from `posts.json`
  - ✅ Deletes the corresponding `/blog/{slug}/` directory
  - ✅ Updates the RSS feed (`feed.xml`)

### 4. **Changes Are Committed** 💾
- GitHub Actions commits the updated files:
  - `posts.json`
  - `feed.xml`
  - Removed blog directories
- Commits are made by `github-actions[bot]`

### 5. **Cloudflare Pages Deploys** 🚀
- Cloudflare Pages detects the new commit
- Automatically deploys the updated site
- The deleted post returns a 404

## The Complete Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. You delete a post in Decap CMS (/admin/)                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Decap CMS commits deletion to GitHub                        │
│     - Removes: /posts/YYYY-MM-DD-post-slug.md                   │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. GitHub Action triggers automatically                        │
│     - Workflow: .github/workflows/build-posts.yml               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. Build script executes (build-posts.js)                      │
│     - Scans /posts folder                                       │
│     - Generates posts.json (without deleted post)               │
│     - Removes /blog/post-slug/ directory                        │
│     - Rebuilds RSS feed (without deleted post)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. GitHub Action commits generated files                       │
│     - posts.json (updated)                                      │
│     - feed.xml (updated)                                        │
│     - blog/ (cleaned up)                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. Cloudflare Pages deploys the changes                        │
│     - Site updated without the deleted post                     │
│     - Old post URL returns 404                                  │
└─────────────────────────────────────────────────────────────────┘
```

## What Gets Deleted Automatically

When a post is deleted, these files/directories are automatically removed:

- ❌ `/posts/YYYY-MM-DD-post-slug.md` (deleted by Decap CMS)
- ❌ `/blog/post-slug/` directory (deleted by build script)
- ❌ `/blog/post-slug/index.html` (deleted by build script)
- ✏️ `posts.json` (updated to remove the post)
- ✏️ `feed.xml` (updated to remove the post)

## GitHub Action Configuration

The workflow is configured in `.github/workflows/build-posts.yml`:

```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'posts/**'        # Triggers on any changes to posts
      - 'build-posts.js'  # Triggers if build script changes
      - 'build-rss.js'    # Triggers if RSS script changes
```

### Manual Trigger

You can also manually trigger the build process:
1. Go to your GitHub repository
2. Click on "Actions" tab
3. Select "Build Posts and RSS Feed" workflow
4. Click "Run workflow" button

## Monitoring the Process

### View GitHub Actions
1. Go to: `https://github.com/dmytrohudz/dmytrohudz.com/actions`
2. Look for workflows triggered by `github-actions[bot]`
3. Click on a workflow to see detailed logs

### Check Commits
- Look for commits with message: `🤖 Auto-build: Update posts.json, RSS feed, and blog pages`
- These are automated commits from the build process

## Troubleshooting

### Post not deleted from live site?

**Check the GitHub Actions:**
1. Go to the Actions tab in your GitHub repository
2. Look for failed workflows (red X)
3. Click on the failed workflow to see error logs

**Common issues:**
- Build script errors: Check `build-posts.js` for syntax errors
- Dependency issues: Ensure `gray-matter` is installed
- Permission issues: GitHub Actions should have write permissions

### Manual cleanup if needed

If for some reason the automation fails, you can manually run:

```bash
# Run the build locally
npm run build

# Commit and push
git add .
git commit -m "Manual cleanup: rebuild posts and RSS"
git push
```

## Disabling Automation

If you want to disable automatic builds:

1. Go to `.github/workflows/build-posts.yml`
2. Comment out or delete the file
3. Commit and push the change

Then you'll need to manually run `npm run build` after deletions.

## Benefits of This Setup

✅ **Fully automatic** - No manual intervention needed  
✅ **Clean repository** - Orphaned files are automatically removed  
✅ **Consistent** - RSS feed and posts.json always in sync  
✅ **Fast** - Runs in ~30 seconds on GitHub Actions  
✅ **Safe** - Only runs when posts folder changes  

---

**Created**: 2025-01-13  
**Status**: ✅ Active and working


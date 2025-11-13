# Build Automation

## Automated Build Process

The blog build process is now fully automated. Whenever you build posts, the RSS feed is automatically regenerated to stay in sync.

### How It Works

When you run `node build-posts.js` or `npm run build`, the script will:

1. ✅ Parse all markdown files in the `/posts` directory
2. ✅ Generate `posts.json` with post metadata
3. ✅ Create individual HTML pages for each post in `/blog/{slug}/`
4. ✅ **Automatically clean up deleted posts** - removes blog directories for posts that no longer have markdown files
5. ✅ **Automatically rebuild RSS feed** - updates `feed.xml` to reflect current posts

### Available Commands

```bash
# Build everything (recommended)
npm run build

# Build posts (also rebuilds RSS automatically)
npm run build-posts

# Build RSS only (if needed manually)
npm run build-rss

# Run local dev server
npm run dev
```

### When You Delete a Post

Simply delete the markdown file from `/posts` and run:

```bash
npm run build
```

This will:
- Remove the post from `posts.json`
- Delete the `/blog/{slug}/` directory
- Update the RSS feed to remove the post
- Ensure all references are cleaned up

Then commit and deploy:

```bash
git add .
git commit -m "Remove deleted post"
git push
```

Your hosting platform will sync the changes and the deleted post will return a 404.

### Integration with Decap CMS

When you create, update, or delete posts through Decap CMS (`/admin/`):

1. **Decap CMS commits changes to GitHub** (adds/modifies/deletes `.md` files)
2. **GitHub Action automatically triggers** (`.github/workflows/build-posts.yml`)
3. **Build script runs** (`npm run build`)
4. **Generated files are committed** (`posts.json`, `feed.xml`, blog pages)
5. **Cloudflare Pages deploys** the updated site

This is **fully automated** - you don't need to run any manual commands!

### Automatic Post Deletion

When you delete a post through Decap CMS:
- ✅ The `.md` file is deleted from `/posts`
- ✅ The `/blog/{slug}/` directory is removed
- ✅ The post is removed from `posts.json`
- ✅ The post is removed from RSS feed
- ✅ All changes are committed and deployed automatically

See `AUTOMATED_POST_DELETION.md` for detailed documentation.

### Manual Build (Optional)

If you prefer to build locally before pushing:

```bash
npm run build
git add .
git commit -m "Update posts"
git push
```

---

**Note:** This automation was implemented to prevent issues where deleted posts could still be accessible or referenced in the RSS feed.


# RSS Feed Setup

Your blog now has an RSS feed automatically generated from your posts!

## 📍 Feed Location

The RSS feed is available at: `https://dmytrohudz.com/feed.xml`

## 🔄 How It Works

1. **Automatic Generation**: The RSS feed is automatically generated from your blog posts via GitHub Actions
2. **Post Detection**: The feed reads from `posts.json` which is created by `build-posts.js` from your markdown files in the `/posts/` directory
3. **Auto-Discovery**: The feed is linked in both `index.html` and `blog.html` with proper RSS auto-discovery tags, so RSS readers can automatically detect it
4. **GitHub Action**: When you create or update a post through Decap CMS, a GitHub Action automatically rebuilds `posts.json`, `feed.xml`, and blog HTML files

## 🚀 Usage

### When you create a new blog post:

**Automatic (Recommended):**
1. Create a new post using Decap CMS at `/admin/`
2. Publish your post
3. GitHub Actions will automatically:
   - Generate/update `posts.json`
   - Generate/update `feed.xml`
   - Create individual blog post HTML pages
4. Cloudflare Pages will deploy your changes automatically

**Manual (if needed):**
1. Add your markdown file to `/posts/` directory
2. Run the build command:
   ```bash
   npm run build
   ```
3. Commit and push changes to GitHub

### Manual RSS generation only:

```bash
npm run build-rss
```

## 📝 What's Included in the Feed

- Post title (English version)
- Post URL
- Publication date
- Post excerpt/description
- Tags/categories (if any)
- Only published posts (drafts are excluded)

## 🔧 Configuration

To customize the RSS feed, edit the `siteConfig` object in `build-rss.js`:

```javascript
const siteConfig = {
    title: 'Dmytro Hudz Blog',
    description: 'Reflections, stories, and half-formed ideas.',
    link: 'https://dmytrohudz.com/',
    blogLink: 'https://dmytrohudz.com/blog.html',
    language: 'en-us'
};
```

## ✅ RSS Feed Standards

The feed follows RSS 2.0 specification with:
- Proper XML encoding
- Valid RFC-822 date formatting
- Atom namespace for self-referencing link
- HTML-safe character escaping

## 🤖 GitHub Actions Automation

A GitHub Action (`.github/workflows/build-posts-and-rss.yml`) automatically:
- Triggers when files in `/posts/` are modified
- Runs `build-posts.js` to generate posts.json and blog HTML pages
- Runs `build-rss.js` to generate the RSS feed
- Commits and pushes the changes back to the repository

This means you can simply create or edit posts through Decap CMS, and everything else is handled automatically!

## 🧪 Testing Your Feed

You can validate your RSS feed at:
- https://validator.w3.org/feed/
- Or by subscribing to it in any RSS reader (Feedly, Inoreader, NetNewsWire, etc.)


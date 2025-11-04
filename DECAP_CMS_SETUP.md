# Decap CMS Setup for Cloudflare Pages

This repository is set up to use Decap CMS (formerly Netlify CMS) with Cloudflare Pages for content management.

## Setup Instructions

### 1. Enable Git Gateway in Cloudflare Pages

1. Go to your Cloudflare Pages dashboard
2. Navigate to your site settings
3. Go to "Functions" tab
4. Enable "Git Gateway" or configure GitHub integration

### 2. Configure Authentication

Since Cloudflare Pages doesn't have built-in identity like Netlify, you have a few options:

#### Option A: Use Netlify Identity (Recommended)
1. Create a free Netlify account
2. Create a new site (can be empty)
3. Enable Identity in Netlify dashboard
4. Add your domain to Netlify Identity settings
5. Use Netlify Identity widget (already included in admin/index.html)

#### Option B: Use GitHub OAuth
1. Create a GitHub OAuth app
2. Update the config.yml to use GitHub backend
3. Configure OAuth settings

### 3. Update Configuration

Edit `admin/config.yml` to match your setup:

```yaml
backend:
  name: git-gateway  # or github for GitHub OAuth
  branch: main

media_folder: "assets/images"
public_folder: "/assets/images"

collections:
  - name: "posts"
    label: "Posts"
    folder: "posts"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Excerpt", name: "excerpt", widget: "text"}
      - {label: "Content", name: "body", widget: "markdown"}
      - {label: "Featured Image", name: "image", widget: "image", required: false}
      - {label: "Tags", name: "tags", widget: "list", required: false}
      - {label: "Draft", name: "draft", widget: "boolean", default: false}
```

### 4. Access the CMS

1. Deploy your site to Cloudflare Pages
2. Visit `https://yourdomain.com/admin/`
3. Sign in with your chosen authentication method
4. Start creating posts!

### 5. Build Process Integration

The site includes a build process to convert markdown files to JSON:

1. **Build Script**: `build-posts.js` converts markdown files to `posts.json`
2. **Run Build**: `npm run build-posts` or `node build-posts.js`
3. **Automatic Loading**: The site loads posts from `posts.json` or API endpoint
4. **Cloudflare Functions**: API endpoint serves posts dynamically

#### Build Process:
```bash
# Install dependencies (if any)
npm install

# Build posts from markdown files
npm run build-posts

# Or run directly
node build-posts.js
```

### 6. File Structure

```
/
├── admin/
│   ├── index.html          # CMS interface
│   └── config.yml          # CMS configuration
├── posts/                  # Markdown posts directory
│   └── 2024-12-22-post.md
├── functions/              # Cloudflare Functions
│   └── api/
│       └── posts.js
├── js/
│   └── posts-loader.js     # Dynamic post loading
└── assets/
    └── images/             # Media files
```

### 7. Next Steps

1. Test the CMS interface
2. Create your first post
3. Verify posts appear on your blog
4. Customize the CMS fields as needed
5. Set up automated builds

## Troubleshooting

- **Authentication issues**: Check your identity provider configuration
- **Posts not loading**: Verify the posts-loader.js is working
- **Build errors**: Check Cloudflare Pages build logs
- **CMS not accessible**: Ensure admin/index.html is deployed correctly

## Resources

- [Decap CMS Documentation](https://decapcms.org/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/platform/functions/)
- [Netlify Identity](https://docs.netlify.com/visitor-access/identity/)

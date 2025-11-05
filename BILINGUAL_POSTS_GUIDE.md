# Bilingual Posts Guide

This guide explains how to create bilingual blog posts (English and Ukrainian) for your website.

## Overview

Each blog post now supports two languages:
- **English (EN)** - Default version
- **Ukrainian (UK)** - Original version

The system automatically displays the correct version based on the user's language preference (stored in `localStorage`).

## Creating Posts via Markdown Files

### Option 1: Using Frontmatter + Separator (Recommended for Manual Editing)

```markdown
---
title: "English Title"
title_uk: "Українська Назва"
date: 2025-12-22T00:00:00.000Z
excerpt: "English excerpt here"
excerpt_uk: "Український уривок тут"
draft: false
tags: ["tag1", "tag2"]
---

English content goes here.

## English Heading

More English content...

---uk---

Український контент тут.

## Українська Заголовок

Більше українського контенту...
```

### Option 2: Using Decap CMS

When creating posts through the Decap CMS admin panel (`/admin`), you'll see separate fields for:

- **Title (English)** - `title`
- **Title (Ukrainian)** - `title_uk`
- **Excerpt (English)** - `excerpt`
- **Excerpt (Ukrainian)** - `excerpt_uk`
- **Content (English)** - `body`
- **Content (Ukrainian)** - `body_uk` (optional)

Simply fill in both versions when creating or editing a post.

## Required Fields

### Frontmatter
- `title` - English title (required)
- `title_uk` - Ukrainian title (required)
- `date` - Publication date (required)
- `excerpt` - English excerpt (required)
- `excerpt_uk` - Ukrainian excerpt (required)
- `tags` - Array of tags (optional)
- `draft` - Boolean, set to `false` to publish (optional, default: false)

### Content
- English content before `---uk---` separator (or in `body` field)
- Ukrainian content after `---uk---` separator (or in `body_uk` field)

## File Naming Convention

Posts should be named: `YYYY-MM-DD-slug.md`

Example: `2024-12-22-my-first-post.md`

## Building Posts

After creating or editing posts, run the build script to generate `posts.json`:

```bash
node build-posts.js
```

This will parse all markdown files in the `posts/` directory and create a JSON file with both language versions.

## How It Works

1. **Storage**: Both language versions are stored in the markdown file
2. **Build**: `build-posts.js` parses both versions into `posts.json`
3. **Display**: Pages check `localStorage.getItem('preferred_language')` to show the correct version
4. **Default**: English is shown by default if no preference is set

## Future: Language Switch Button

The infrastructure is now ready for adding a language switch button. When implemented, it will:

1. Toggle between `en` and `uk` in localStorage
2. Reload the page or update content dynamically
3. Remember the user's preference across sessions

## Example Post Structure

See `/posts/2024-12-22-personal-experience.md` for a complete example of a bilingual post.

## Notes

- If Ukrainian content is missing, the system falls back to English content
- All posts should ideally have both versions for the best user experience
- The language preference persists across the entire site



#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to escape XML special characters
function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

// Function to strip HTML tags
function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
}

// Function to format date to RFC-822 format (required by RSS)
function formatRssDate(dateString) {
    const date = new Date(dateString);
    return date.toUTCString();
}

// Main function to build RSS feed
function buildRss() {
    const postsJsonPath = path.join(__dirname, 'posts.json');
    
    // Check if posts.json exists
    if (!fs.existsSync(postsJsonPath)) {
        console.log('posts.json not found. Run build-posts first.');
        return;
    }
    
    // Read posts data
    const posts = JSON.parse(fs.readFileSync(postsJsonPath, 'utf8'));
    
    // Filter out draft posts
    const publishedPosts = posts.filter(post => !post.draft);
    
    // Site configuration - update these with your actual values
    const siteConfig = {
        title: 'Dmytro Hudz Blog',
        description: 'Reflections, stories, and half-formed ideas.',
        link: 'https://dmytrohudz.com/',
        blogLink: 'https://dmytrohudz.com/blog.html',
        language: 'en-us',
        lastBuildDate: new Date().toUTCString()
    };
    
    // Start building RSS XML
    let rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <description>${escapeXml(siteConfig.description)}</description>
    <link>${escapeXml(siteConfig.blogLink)}</link>
    <atom:link href="${escapeXml(siteConfig.link)}feed.xml" rel="self" type="application/rss+xml" />
    <language>${siteConfig.language}</language>
    <lastBuildDate>${siteConfig.lastBuildDate}</lastBuildDate>
`;
    
    // Add each post as an item
    publishedPosts.forEach(post => {
        const postUrl = `${siteConfig.link}blog/${post.slug}/`;
        const pubDate = formatRssDate(post.date);
        
        // Use excerpt as description, or truncate content if no excerpt
        let description = post.excerpt || stripHtml(post.content).substring(0, 200);
        if (!post.excerpt && stripHtml(post.content).length > 200) {
            description += '...';
        }
        
        rss += `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(description)}</description>
`;
        
        // Add categories/tags if they exist
        if (post.tags && post.tags.length > 0) {
            post.tags.forEach(tag => {
                rss += `      <category>${escapeXml(tag)}</category>\n`;
            });
        }
        
        rss += `    </item>
`;
    });
    
    rss += `  </channel>
</rss>`;
    
    // Write RSS feed to feed.xml
    const outputPath = path.join(__dirname, 'feed.xml');
    fs.writeFileSync(outputPath, rss);
    console.log(`Generated RSS feed with ${publishedPosts.length} posts at ${outputPath}`);
}

// Run the build
buildRss();


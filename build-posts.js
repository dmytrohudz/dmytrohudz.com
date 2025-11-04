#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Simple markdown frontmatter parser
function parseMarkdown(markdownContent) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdownContent.match(frontmatterRegex);
    
    if (!match) {
        return null;
    }
    
    const frontmatter = match[1];
    const content = match[2];
    
    // Parse frontmatter (simple YAML-like parsing)
    const metadata = {};
    frontmatter.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            // Parse arrays
            if (value.startsWith('[') && value.endsWith(']')) {
                value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
            }
            
            // Parse boolean
            if (value === 'true') value = true;
            if (value === 'false') value = false;
            
            metadata[key] = value;
        }
    });
    
    return {
        ...metadata,
        content: content.trim()
    };
}

// Convert markdown to HTML (simple conversion)
function markdownToHtml(markdown) {
    return markdown
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*)\*/gim, '<em>$1</em>')
        .replace(/\n\n/gim, '</p><p>')
        .replace(/^(.*)$/gim, '<p>$1</p>')
        .replace(/<p><\/p>/gim, '')
        .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/gim, '$1');
}

// Main function
function buildPosts() {
    const postsDir = path.join(__dirname, 'posts');
    const outputFile = path.join(__dirname, 'posts.json');
    
    if (!fs.existsSync(postsDir)) {
        console.log('Posts directory does not exist');
        return;
    }
    
    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
    const posts = [];
    
    files.forEach(file => {
        const filePath = path.join(postsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const parsed = parseMarkdown(content);
        
        if (parsed && parsed.title && parsed.date) {
            // Generate slug from filename or title
            const slug = file.replace(/\.md$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
            
            posts.push({
                title: parsed.title,
                date: parsed.date,
                excerpt: parsed.excerpt || '',
                content: markdownToHtml(parsed.content),
                slug: slug,
                tags: parsed.tags || [],
                draft: parsed.draft || false
            });
        }
    });
    
    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Write to posts.json
    fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
    console.log(`Generated posts.json with ${posts.length} posts`);
}

// Run the build
buildPosts();


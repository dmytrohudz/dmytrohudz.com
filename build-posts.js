#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Parse markdown with proper YAML frontmatter parsing
function parseMarkdown(markdownContent) {
    try {
        const parsed = matter(markdownContent);
        const metadata = parsed.data;
        let content = parsed.content;
        
        // Split content by Ukrainian separator if it exists
        let contentEn = content.trim();
        let contentUk = '';
        
        // Check if there's a separator for Ukrainian content
        const ukSeparatorRegex = /\n---uk---\n/;
        if (ukSeparatorRegex.test(content)) {
            const parts = content.split(ukSeparatorRegex);
            contentEn = parts[0].trim();
            contentUk = parts[1] ? parts[1].trim() : '';
        }
        
        return {
            ...metadata,
            content: contentEn,
            // Check if body_uk exists in metadata (from Decap CMS), otherwise use the separator-based content
            content_uk: metadata.body_uk ? metadata.body_uk : contentUk
        };
    } catch (error) {
        console.error('Error parsing markdown:', error);
        return null;
    }
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

// Generate individual post HTML file
function generatePostHtml(post) {
    const template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="content-language" content="en">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${post.title} — Dmytro Hudz</title>
    <meta name="description" content="${post.excerpt}"/>
    <link rel="stylesheet" href="../../css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&display=swap" rel="stylesheet">
    <script src="../../js/script.js" defer></script>
    <link rel="apple-touch-icon" sizes="180x180" href="../../assets/meta/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../../assets/meta/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../../assets/meta/favicon-16x16.png">
    <link rel="manifest" href="../../assets/meta/site.webmanifest">
    <meta property="og:image" content="https://res.cloudinary.com/ddycivi0t/image/upload/fl_preserve_transparency/v1715016023/open-graph_s0lp27.jpg">
    <meta name="twitter:image" content="https://res.cloudinary.com/ddycivi0t/image/upload/fl_preserve_transparency/v1715016023/open-graph_s0lp27.jpg">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.4/lottie.min.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function () {
            // Handle back navigation
            var back = document.getElementById('back-link');
            if (back) {
                back.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (document.referrer && document.referrer.indexOf(location.host) !== -1) {
                        history.back();
                    } else {
                        window.location.href = '/blog.html';
                    }
                });
            }

            // Get current language preference (default to 'en')
            const currentLang = localStorage.getItem('preferred_language') || 'en';
            
            // Post data embedded in the page
            const postData = {
                title_en: ${JSON.stringify(post.title)},
                title_uk: ${JSON.stringify(post.title_uk || post.title)},
                content_en: ${JSON.stringify(post.content)},
                content_uk: ${JSON.stringify(post.content_uk || post.content)},
                date: ${JSON.stringify(post.date)}
            };
            
            const postTitleElement = document.getElementById('post-title');
            const contentBody = document.querySelector('.post-content-body');
            
            // Store both versions in data attributes for language switching
            if (postTitleElement) {
                postTitleElement.setAttribute('data-title-en', postData.title_en);
                postTitleElement.setAttribute('data-title-uk', postData.title_uk);
            }
            
            if (contentBody) {
                contentBody.setAttribute('data-content-en', postData.content_en);
                contentBody.setAttribute('data-content-uk', postData.content_uk);
            }
            
            // Display content based on current language
            const displayTitle = currentLang === 'uk' ? postData.title_uk : postData.title_en;
            const displayContent = currentLang === 'uk' ? postData.content_uk : postData.content_en;

            if (displayTitle && postTitleElement) {
                postTitleElement.textContent = displayTitle;
                document.title = \`\${displayTitle} — Dmytro Hudz\`;
            }

            if (displayContent && contentBody) {
                contentBody.innerHTML = displayContent;
            }

            // Format and display date
            const date = new Date(postData.date);
            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
            const month = months[date.getMonth()];
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            document.getElementById('post-date').textContent = \`\${month}-\${day}-\${year}\`;

            // Handle language toggle button
            const languageToggleButton = document.getElementById('language-toggle-button');
            const backButton = document.getElementById('back-link');
            
            if (languageToggleButton && backButton) {
                // Temporarily set to "read eng" to measure the wider text
                const originalText = languageToggleButton.textContent;
                languageToggleButton.textContent = 'read eng';
                const maxWidth = Math.max(backButton.offsetWidth, languageToggleButton.offsetWidth);
                languageToggleButton.textContent = originalText;
                
                // Set min-width to prevent button resize when toggling
                languageToggleButton.style.minWidth = maxWidth + 'px';
                
                languageToggleButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const postTitleElement = document.getElementById('post-title');
                    const contentBody = document.querySelector('.post-content-body');
                    
                    // Get current language (default to 'en')
                    const currentLang = localStorage.getItem('preferred_language') || 'en';
                    const newLang = currentLang === 'en' ? 'uk' : 'en';
                    
                    // Get titles and content for both languages
                    const titleEn = postTitleElement.getAttribute('data-title-en');
                    const titleUk = postTitleElement.getAttribute('data-title-uk');
                    const contentEn = contentBody.getAttribute('data-content-en');
                    const contentUk = contentBody.getAttribute('data-content-uk');
                    
                    // Switch to the new language
                    if (newLang === 'uk') {
                        postTitleElement.textContent = titleUk || titleEn;
                        contentBody.innerHTML = contentUk || contentEn;
                        document.title = \`\${titleUk || titleEn} — Dmytro Hudz\`;
                        languageToggleButton.textContent = 'read eng';
                    } else {
                        postTitleElement.textContent = titleEn;
                        contentBody.innerHTML = contentEn;
                        document.title = \`\${titleEn} — Dmytro Hudz\`;
                        languageToggleButton.textContent = 'read ukr';
                    }
                    
                    // Save preference
                    localStorage.setItem('preferred_language', newLang);
                });
                
                // Set initial button text based on current language
                const initialLang = localStorage.getItem('preferred_language') || 'en';
                languageToggleButton.textContent = initialLang === 'en' ? 'read ukr' : 'read eng';
            }
        });
    </script>
</head>
<body class="blog-page post-page">
    <div class="noise-overlay"></div>
    <div class="page-container">
    <main>
        <div class="blog-container">
            <div class="blog-header">
                <h1 class="blog-title" id="post-title">${post.title}</h1>
                <p class="blog-subtitle" id="post-date">Loading...</p>
            </div>
            <div class="blog-content">
                <article class="post-article">
                    <div class="post-content-body">
                        ${post.content}
                    </div>
                </article>
            </div>
        </div>
    </main>
    <footer>
        <div class="footer-buttons">
            <a href="/blog.html" class="button tertiary back-button" id="back-link">
                <span class="button-content"><svg class="svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.2045 3.70402C14.6438 3.26468 15.357 3.26468 15.7963 3.70402C16.2356 4.14336 16.2356 4.85647 15.7963 5.29581L9.0922 11.9999L15.7963 18.704C16.2356 19.1434 16.2356 19.8565 15.7963 20.2958C15.357 20.7352 14.6438 20.7352 14.2045 20.2958L6.7045 12.7958C6.26517 12.3565 6.26517 11.6434 6.7045 11.204L14.2045 3.70402Z" fill="white"/></svg>back</span>
            </a>
            <a href="#" class="button tertiary" id="language-toggle-button">read ukr</a>
        </div>
    </footer>
    </div>
</body>
</html>`;
    
    return template;
}

// Main function
function buildPosts() {
    const postsDir = path.join(__dirname, 'posts');
    const outputFile = path.join(__dirname, 'posts.json');
    const blogDir = path.join(__dirname, 'blog');
    
    if (!fs.existsSync(postsDir)) {
        console.log('Posts directory does not exist');
        return;
    }
    
    // Ensure blog directory exists
    if (!fs.existsSync(blogDir)) {
        fs.mkdirSync(blogDir);
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
            
            const post = {
                title: parsed.title,
                title_uk: parsed.title_uk || parsed.title,
                date: parsed.date,
                excerpt: parsed.excerpt || '',
                excerpt_uk: parsed.excerpt_uk || parsed.excerpt || '',
                content: markdownToHtml(parsed.content),
                content_uk: parsed.content_uk ? markdownToHtml(parsed.content_uk) : markdownToHtml(parsed.content),
                slug: slug,
                tags: parsed.tags || [],
                draft: parsed.draft || false
            };
            
            posts.push(post);
            
            // Generate individual post HTML file
            const postDir = path.join(blogDir, slug);
            if (!fs.existsSync(postDir)) {
                fs.mkdirSync(postDir, { recursive: true });
            }
            
            const postHtml = generatePostHtml(post);
            const postHtmlPath = path.join(postDir, 'index.html');
            fs.writeFileSync(postHtmlPath, postHtml);
            console.log(`Generated ${postHtmlPath}`);
        }
    });
    
    // Clean up deleted posts - remove blog directories that no longer have markdown files
    const currentSlugs = new Set(posts.map(post => post.slug));
    const blogDirs = fs.readdirSync(blogDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    
    blogDirs.forEach(dir => {
        if (!currentSlugs.has(dir)) {
            const dirPath = path.join(blogDir, dir);
            fs.rmSync(dirPath, { recursive: true, force: true });
            console.log(`Removed deleted post: ${dirPath}`);
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


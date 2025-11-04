// Posts data loader
class PostsLoader {
    constructor() {
        this.posts = [];
        this.postsPath = '/posts/';
    }

    async loadPosts() {
        try {
            // Try to fetch posts from the posts directory
            const response = await fetch(`/api/posts?ts=${Date.now()}` , { cache: 'no-store' });
            if (response.ok) {
                this.posts = await response.json();
            } else {
                // Fallback: try to load from individual markdown files
                this.posts = await this.loadPostsFromFiles();
            }
            
            // Sort posts by date (newest first)
            this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            return this.posts;
        } catch (error) {
            console.error('Error loading posts:', error);
            // Fallback to loading from files
            try {
                this.posts = await this.loadPostsFromFiles();
                this.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
                return this.posts;
            } catch (fallbackError) {
                console.error('Fallback loading failed:', fallbackError);
                return [];
            }
        }
    }

    async loadPostsFromFiles() {
        // This is a simplified approach - in a real implementation you'd need:
        // 1. A build process that converts markdown to JSON
        // 2. Cloudflare Functions to serve the posts
        // 3. Or a static posts.json file generated at build time
        
        // For now, we'll create a posts.json file that can be generated from markdown
        const posts = [];
        
        // Try to fetch posts.json if it exists
        try {
            const response = await fetch(`/posts.json?ts=${Date.now()}`, { cache: 'no-store' });
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('No posts.json found, using fallback');
        }
        
        // Fallback: return empty array (posts will be added via CMS)
        return [];
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        return `${day}<br>${month}`;
    }

    formatDateForPost(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
        const year = date.getFullYear();
        return `${month}-${day}-${year}`;
    }

    getPostBySlug(slug) {
        return this.posts.find(post => post.slug === slug);
    }
}

// Initialize posts loader
const postsLoader = new PostsLoader();

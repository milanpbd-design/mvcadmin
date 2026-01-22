/**
 * Publish Service
 * 
 * Unified service for publishing content to GitHub from any admin manager.
 * Provides reusable publish function with consistent error handling.
 */

import GitHubService from './GitHubService';

class PublishService {
    /**
     * Publish content to GitHub
     * @param {string} contentType - Type of content (articles, research, etc.)
     * @param {any} data - The data to publish
     * @param {function} toast - Toast notification function
     * @returns {Promise<{success: boolean, message: string}>}
     */
    static async publish(contentType, data, toast) {
        try {
            // Get GitHub credentials
            const token = localStorage.getItem('github_token');
            const owner = localStorage.getItem('github_owner');
            const repo = localStorage.getItem('github_repo');

            // Validate credentials
            if (!token || !owner) {
                const error = 'Please configure GitHub settings first';
                if (toast) toast.error(error);
                return { success: false, message: error };
            }

            // Create GitHub service
            const github = new GitHubService(token, owner, repo);

            // Map content types to GitHub service methods
            const methodMap = {
                'articles': () => github.updateArticles(data),
                'research': () => github.updateResearch(data),
                'experts': () => github.updateExperts(data),
                'categories': () => github.updateCategories(data),
                'media': () => github.updateMedia(data),
                'slides': () => github.updateSlides(data),
                'users': () => github.updateUsers(data),
                'site-config': () => github.updateSiteConfig(data),
            };

            const publishMethod = methodMap[contentType];

            if (!publishMethod) {
                throw new Error(`Unknown content type: ${contentType}`);
            }

            // Publish to GitHub
            await publishMethod();

            const successMessage = `✅ ${contentType.charAt(0).toUpperCase() + contentType.slice(1)} published to GitHub!`;
            if (toast) toast.success(successMessage);

            return {
                success: true,
                message: successMessage + ' Site will rebuild ' +
                    '',
            };

        } catch (error) {
            console.error(`Publish error (${contentType}):`, error);

            const errorMessage = `Failed to publish: ${error.message}`;
            if (toast) toast.error(errorMessage);

            return {
                success: false,
                message: errorMessage,
                error,
            };
        }
    }

    /**
     * Publish all content types at once
     */
    static async publishAll(siteData, toast) {
        const results = {
            articles: null,
            research: null,
            experts: null,
            categories: null,
            media: null,
            slides: null,
        };

        try {
            const token = localStorage.getItem('github_token');
            const owner = localStorage.getItem('github_owner');
            const repo = localStorage.getItem('github_repo');

            if (!token || !owner) {
                throw new Error('Please configure GitHub settings first');
            }

            const github = new GitHubService(token, owner, repo);

            // Publish all content types in parallel
            const [articles, research, experts, categories, media, slides] = await Promise.allSettled([
                github.updateArticles(siteData.articles || []),
                github.updateResearch(siteData.research || []),
                github.updateExperts(siteData.experts || []),
                github.updateCategories(siteData.categories || []),
                github.updateMedia(siteData.media || []),
                github.updateSlides(siteData.slides || []),
            ]);

            results.articles = articles.status === 'fulfilled';
            results.research = research.status === 'fulfilled';
            results.experts = experts.status === 'fulfilled';
            results.categories = categories.status === 'fulfilled';
            results.media = media.status === 'fulfilled';
            results.slides = slides.status === 'fulfilled';

            const successCount = Object.values(results).filter(Boolean).length;
            const totalCount = Object.keys(results).length;

            if (successCount === totalCount) {
                if (toast) toast.success(`✅ All content published! (${successCount}/${totalCount})`);
            } else {
                if (toast) toast.warning(`⚠️ Partial success: ${successCount}/${totalCount} published`);
            }

            return {
                success: successCount > 0,
                results,
                published: successCount,
                total: totalCount,
            };

        } catch (error) {
            console.error('Publish all error:', error);
            if (toast) toast.error('Failed to publish: ' + error.message);

            return {
                success: false,
                results,
                error,
            };
        }
    }

    /**
     * Check if GitHub is configured
     */
    static isConfigured() {
        const token = localStorage.getItem('github_token');
        const owner = localStorage.getItem('github_owner');
        return !!(token && owner);
    }
}

export default PublishService;

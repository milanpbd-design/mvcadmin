/**
 * GitHub Service
 * 
 * Handles all interactions with GitHub API for content management.
 * This service commits content changes to the repository, triggering
 * automatic rebuilds and deployments.
 */

import { Octokit } from '@octokit/rest';

class GitHubService {
    constructor(token, owner = null, repo = null) {
        if (!token) {
            throw new Error('GitHub token is required');
        }

        this.octokit = new Octokit({ auth: token });

        // Get from localStorage or use defaults
        this.owner = owner || localStorage.getItem('github_owner') || '';
        this.repo = repo || localStorage.getItem('github_repo') || 'myvetcorner';
        this.branch = 'main';
    }

    /**
     * Generic method to update any content file
     */
    async updateContent(filename, data, commitMessage = null) {
        const path = `public/content/${filename}`;
        const content = JSON.stringify(data, null, 2);
        const message = commitMessage || `Update ${filename} via admin panel`;

        try {
            // First, get the current file to retrieve its SHA
            let currentSha = null;
            try {
                const { data: currentFile } = await this.octokit.repos.getContent({
                    owner: this.owner,
                    repo: this.repo,
                    path,
                    ref: this.branch,
                });
                currentSha = currentFile.sha;
            } catch (error) {
                // File doesn't exist yet, that's okay
                if (error.status !== 404) {
                    throw error;
                }
            }

            // Create or update the file
            const payload = {
                owner: this.owner,
                repo: this.repo,
                path,
                message,
                content: Buffer.from(content).toString('base64'),
                branch: this.branch,
            };

            if (currentSha) {
                payload.sha = currentSha;
            }

            const result = await this.octokit.repos.createOrUpdateFileContents(payload);

            return {
                success: true,
                commit: result.data.commit,
                message: `Successfully committed ${filename}`,
            };
        } catch (error) {
            console.error('GitHub API Error:', error);

            let errorMessage = `Failed to update ${filename}`;

            if (error.status === 401) {
                errorMessage = 'Invalid GitHub token. Please check your token in Settings.';
            } else if (error.status === 404) {
                errorMessage = 'Repository not found. Please check owner/repo in Settings.';
            } else if (error.message) {
                errorMessage += `: ${error.message}`;
            }

            throw new Error(errorMessage);
        }
    }

    /**
     * Get current content from a file
     */
    async getContent(filename) {
        const path = `public/content/${filename}`;

        try {
            const { data } = await this.octokit.repos.getContent({
                owner: this.owner,
                repo: this.repo,
                path,
                ref: this.branch,
            });

            const content = Buffer.from(data.content, 'base64').toString('utf8');
            return JSON.parse(content);
        } catch (error) {
            console.error(`Error fetching ${filename}:`, error);
            throw new Error(`Failed to fetch ${filename} from GitHub`);
        }
    }

    /**
     * Convenience methods for specific content types
     */

    async updateArticles(articles) {
        return this.updateContent('articles.json', articles, 'Update articles');
    }

    async updateResearch(research) {
        return this.updateContent('research.json', research, 'Update research papers');
    }

    async updateExperts(experts) {
        return this.updateContent('experts.json', experts, 'Update medical board');
    }

    async updateCategories(categories) {
        return this.updateContent('categories.json', categories, 'Update categories');
    }

    async updateMedia(media) {
        return this.updateContent('media.json', media, 'Update media library');
    }

    async updateSlides(slides) {
        return this.updateContent('slides.json', slides, 'Update hero slides');
    }

    async updateSiteConfig(config) {
        return this.updateContent('site-config.json', config, 'Update site configuration');
    }

    async updateUsers(users) {
        return this.updateContent('users.json', users, 'Update users');
    }

    /**
     * Upload a file (image, PDF, etc.) to GitHub
     */
    async uploadFile(file, folder = 'uploads') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = async () => {
                try {
                    // Get base64 content (remove data URL prefix)
                    const base64Content = reader.result.split(',')[1];

                    // Create unique filename with timestamp
                    const timestamp = Date.now();
                    const filename = `${timestamp}-${file.name}`;
                    const path = `public/${folder}/${filename}`;

                    await this.octokit.repos.createOrUpdateFileContents({
                        owner: this.owner,
                        repo: this.repo,
                        path,
                        message: `Upload ${file.name}`,
                        content: base64Content,
                        branch: this.branch,
                    });

                    // Return the URL (adjust based on your deployment URL)
                    const url = `/${folder}/${filename}`;

                    resolve({
                        success: true,
                        url,
                        filename,
                        originalName: file.name,
                    });
                } catch (error) {
                    console.error('Upload error:', error);
                    reject(new Error(`Failed to upload ${file.name}: ${error.message}`));
                }
            };

            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * Test connection to GitHub
     */
    async testConnection() {
        try {
            const { data: repo } = await this.octokit.repos.get({
                owner: this.owner,
                repo: this.repo,
            });

            return {
                success: true,
                repoName: repo.full_name,
                private: repo.private,
            };
        } catch (error) {
            throw new Error(`Connection test failed: ${error.message}`);
        }
    }
}

export default GitHubService;

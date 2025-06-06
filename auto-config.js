// This file is loaded first on all pages

function configureGitHubToken(token) {
    localStorage.setItem('github_token', token);
    console.log('🔐 GitHub token configured manually by user.');
    // Re-initialize the global manager with the new token
    window.githubDataManager = new GitHubDataManager('WellyXY', 'side_by_side', 'experiments-data.json');
    window.dispatchEvent(new Event('github_token_configured'));
}

class GitHubDataManager {
    constructor(owner, repo, dataFile) {
        this.owner = owner;
        this.repo = repo;
        this.dataFile = dataFile;
        this.github_token = localStorage.getItem('github_token');
        
        if (!this.github_token) {
            console.warn("GitHub token not found. Data operations will fail.");
        }
    }

    async loadData() {
        if (!this.github_token) {
            console.error('No GitHub token, cannot load data.');
            return null;
        }
        try {
            const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.dataFile}`;
            const response = await fetch(url, {
                headers: { 'Authorization': `token ${this.github_token}` },
                cache: 'no-store' // IMPORTANT: bypass cache
            });
            if (response.ok) {
                const data = await response.json();
                return {
                    content: JSON.parse(atob(data.content)),
                    sha: data.sha
                };
            }
            if (response.status === 404) {
                console.log('Data file not found on GitHub. A new one will be created on first save.');
                return { content: { experiments: [] }, sha: null };
            }
            throw new Error(`Failed to load data: ${response.status}`);
        } catch (error) {
            console.error('Error in loadData:', error);
            return null;
        }
    }

    async saveData(data, commitMessage) {
        if (!this.github_token) {
            console.error('No GitHub token, cannot save data.');
            return false;
        }
        try {
            // First, get the latest SHA
            const latestData = await this.loadData();
            const sha = latestData ? latestData.sha : null;

            const contentToSave = btoa(JSON.stringify(data, null, 2));
            const body = {
                message: commitMessage || `Data update ${new Date().toISOString()}`,
                content: contentToSave,
                sha: sha
            };
            
            const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.dataFile}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.github_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                console.log('✅ Data saved to GitHub successfully.');
                return true;
            }
            const errorData = await response.json();
            console.error('❌ Failed to save data to GitHub:', response.status, errorData.message);
            return false;
        } catch (error) {
            console.error('Error in saveData:', error);
            return false;
        }
    }
}

// Initialize the global manager
// It will initially be created without a token, relying on the user to configure it.
window.githubDataManager = new GitHubDataManager('WellyXY', 'side_by_side', 'experiments-data.json');

// --- REMOVE all auto-config logic --- 
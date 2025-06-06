// This file is loaded first on all pages

function configureGitHubToken(encodedToken) {
    const token = atob(encodedToken);
    localStorage.setItem('github_token', token);
    console.log('🔐 GitHub token configured automatically.');
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
window.githubDataManager = new GitHubDataManager('WellyXY', 'side_by_side', 'experiments-data.json');


// --- Existing auto-config logic ---
const encodedToken = 'Z2hwX3hGbDVnWjd2YU5JeFB6MGRSNTBRR2VLNVRPcEtpNTFxVFFaRg=='; // New token from user
const storedToken = localStorage.getItem('github_token');

if (!storedToken || storedToken !== atob(encodedToken)) {
    configureGitHubToken(encodedToken);
} else {
    console.log('🔐 GitHub token already exists and is up to date.');
}

// 自动配置脚本
(function() {
    'use strict';
    
    // 检查是否需要自动配置GitHub token
    function checkAndSetupGitHub() {
        const currentToken = localStorage.getItem('github_token');
        
        if (!currentToken) {
            // 使用base64编码的token
            const encodedToken = 'Z2hwX0tQUVlsZ3A5eWs3cWtIOHZ3OEI4OGh1MEU1dXIxNDBhd3kzcAo=';
            
            try {
                const decodedToken = atob(encodedToken);
                localStorage.setItem('github_token', decodedToken);
                console.log('🔐 GitHub自动配置完成，token已设置');
                
                // 通知所有管理器实例更新token
                updateManagerTokens(decodedToken);
                
            } catch (error) {
                console.warn('自动配置失败:', error);
            }
        } else {
            console.log('🔐 GitHub token已存在，无需配置');
            // 确保管理器实例有正确的token
            updateManagerTokens(currentToken);
        }
    }
    
    // 更新管理器实例的token
    function updateManagerTokens(token) {
        // 立即更新，然后定期重试确保更新成功
        function tryUpdate() {
            try {
                let updated = false;
                
                // 更新 ExperimentManager 实例
                if (window.experimentManager && window.experimentManager.githubConfig) {
                    window.experimentManager.githubConfig.token = token;
                    console.log('✅ ExperimentManager token 已更新');
                    
                    // 重新加载数据以确保同步
                    if (window.experimentManager.loadExperiments) {
                        window.experimentManager.loadExperiments().then(() => {
                            console.log('🔄 ExperimentManager 数据已重新加载');
                        }).catch(err => {
                            console.warn('重新加载数据失败:', err);
                        });
                    }
                    updated = true;
                }
                
                // 更新 CreateExperimentManager 实例
                if (window.createManager && window.createManager.githubConfig) {
                    window.createManager.githubConfig.token = token;
                    console.log('✅ CreateExperimentManager token 已更新');
                    
                    // 确保配置token
                    if (window.createManager.ensureTokenConfiguration) {
                        window.createManager.ensureTokenConfiguration();
                    }
                    updated = true;
                }
                
                return updated;
            } catch (error) {
                console.warn('更新管理器token失败:', error);
                return false;
            }
        }
        
        // 立即尝试更新
        if (!tryUpdate()) {
            // 延迟重试确保管理器实例已创建
            setTimeout(() => {
                if (!tryUpdate()) {
                    setTimeout(() => {
                        if (!tryUpdate()) {
                            setTimeout(tryUpdate, 1000);
                        }
                    }, 500);
                }
            }, 100);
        }
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndSetupGitHub);
    } else {
        checkAndSetupGitHub();
    }
    
    // 暴露更新函数供其他脚本使用
    window.updateManagerTokens = updateManagerTokens;
})(); 
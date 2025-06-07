/**
 * 云端同步管理器
 * 负责将用户评价数据同步到GitHub，实现公共可见的评价结果
 */
class CloudSyncManager {
    constructor() {
        this.config = {
            useCloudSync: false, // 默认关闭云端同步
            syncToGitHub: false,
            owner: 'WellyXY',
            repo: 'side_by_side',
            branch: 'main',
            resultsFile: 'public-results.json',
            apiBase: 'https://api.github.com',
            localStorageKey: 'sbs_experiments'
        };
        
        this.init();
    }

    init() {
        console.log('🌐 CloudSyncManager initialized');
        console.log('📊 Cloud sync status:', this.config.useCloudSync ? 'ENABLED' : 'DISABLED');
        
        // 检查是否有GitHub token
        this.checkGitHubToken();
        
        // 定期同步（如果启用）
        if (this.config.useCloudSync) {
            this.startPeriodicSync();
        }
    }

    checkGitHubToken() {
        const token = this.getGitHubToken();
        if (token) {
            console.log('✅ GitHub token found, cloud sync available');
            this.config.syncToGitHub = true;
        } else {
            console.log('❌ No GitHub token found, using local storage only');
            this.config.syncToGitHub = false;
        }
    }

    getGitHubToken() {
        // 从多个地方尝试获取token
        return localStorage.getItem('github_token') || 
               sessionStorage.getItem('github_token') || 
               window.GITHUB_TOKEN;
    }

    async enableCloudSync(token) {
        if (token) {
            localStorage.setItem('github_token', token);
            this.config.useCloudSync = true;
            this.config.syncToGitHub = true;
            console.log('✅ Cloud sync enabled with GitHub token');
            
            // 立即执行一次同步
            await this.syncToCloud();
            
            // 开始定期同步
            this.startPeriodicSync();
            
            return true;
        }
        return false;
    }

    disableCloudSync() {
        this.config.useCloudSync = false;
        this.config.syncToGitHub = false;
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
        console.log('❌ Cloud sync disabled');
    }

    startPeriodicSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
        
        // 每5分钟同步一次
        this.syncInterval = setInterval(() => {
            this.syncToCloud();
        }, 5 * 60 * 1000);
        
        console.log('⏰ Periodic sync started (every 5 minutes)');
    }

    async syncToCloud() {
        if (!this.config.useCloudSync) {
            console.log('⏸️ Cloud sync disabled, skipping');
            return;
        }

        console.log('🔄 Starting cloud sync...');
        
        try {
            // 从本地存储获取数据
            const localData = await this.getLocalData();
            if (!localData || localData.length === 0) {
                console.log('📭 No local data to sync');
                return;
            }

            // 处理数据，只同步有评价结果的实验
            const publicResults = this.preparePublicResults(localData);
            
            if (publicResults.experiments.length === 0) {
                console.log('📭 No experiments with results to sync');
                return;
            }

            // 同步到GitHub（如果配置了）
            if (this.config.syncToGitHub) {
                await this.syncToGitHub(publicResults);
            }

            console.log('✅ Cloud sync completed successfully');

        } catch (error) {
            console.error('❌ Cloud sync failed:', error);
        }
    }

    async getLocalData() {
        try {
            const data = localStorage.getItem(this.config.localStorageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error reading local data:', error);
            return [];
        }
    }

    preparePublicResults(experiments) {
        const publicExperiments = [];

        experiments.forEach(exp => {
            // 只处理有评价结果的实验
            const hasResults = this.hasValidResults(exp);
            if (!hasResults) return;

            // 统计数据
            const stats = this.calculateStats(exp);
            
            // 创建公共版本（移除敏感信息）
            const publicExp = {
                id: exp.id,
                name: exp.name,
                description: exp.description,
                folderA: exp.folderA,
                folderB: exp.folderB,
                createdAt: exp.createdAt,
                lastModified: exp.lastModified,
                stats: stats,
                summary: {
                    totalUsers: stats.users.length,
                    totalRounds: stats.totalRounds,
                    totalRatings: stats.totalRatings,
                    leftWins: stats.leftWins,
                    rightWins: stats.rightWins,
                    ties: stats.ties,
                    avgRating: stats.avgRating
                }
            };

            publicExperiments.push(publicExp);
        });

        return {
            lastUpdated: new Date().toISOString(),
            totalExperiments: publicExperiments.length,
            totalRatings: publicExperiments.reduce((sum, exp) => sum + exp.stats.totalRatings, 0),
            totalUsers: new Set(publicExperiments.flatMap(exp => exp.stats.users)).size,
            experiments: publicExperiments
        };
    }

    hasValidResults(experiment) {
        // 检查 userSessions
        if (experiment.userSessions) {
            for (const userId in experiment.userSessions) {
                const userSession = experiment.userSessions[userId];
                if (userSession.rounds && userSession.rounds.length > 0) {
                    for (const round of userSession.rounds) {
                        if (round.results && round.results.length > 0) {
                            return true;
                        }
                    }
                }
            }
        }

        // 检查 results 数组
        return experiment.results && experiment.results.length > 0;
    }

    calculateStats(experiment) {
        const users = new Set();
        const allRatings = [];
        let totalRounds = 0;

        // 从 userSessions 统计
        if (experiment.userSessions) {
            Object.keys(experiment.userSessions).forEach(userId => {
                users.add(userId);
                const userSession = experiment.userSessions[userId];
                if (userSession.rounds) {
                    totalRounds += userSession.rounds.length;
                    userSession.rounds.forEach(round => {
                        if (round.results) {
                            round.results.forEach(result => {
                                if (result.rating !== null && result.rating !== undefined) {
                                    allRatings.push(result.rating);
                                }
                            });
                        }
                    });
                }
            });
        }

        // 从 results 数组统计（备用）
        if (experiment.results) {
            experiment.results.forEach(result => {
                if (result.userId) users.add(result.userId);
                if (result.rating !== null && result.rating !== undefined) {
                    allRatings.push(result.rating);
                }
            });
        }

        const leftWins = allRatings.filter(r => r < 0).length;
        const rightWins = allRatings.filter(r => r > 0).length;
        const ties = allRatings.filter(r => r === 0).length;

        return {
            users: Array.from(users),
            totalRounds,
            totalRatings: allRatings.length,
            leftWins,
            rightWins,
            ties,
            avgRating: allRatings.length > 0 ? 
                (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2) : 0
        };
    }

    async syncToGitHub(publicResults) {
        const token = this.getGitHubToken();
        if (!token) {
            throw new Error('No GitHub token available');
        }

        console.log('🔄 Syncing to GitHub...');

        try {
            // 获取当前文件的SHA（如果存在）
            let fileSha = null;
            try {
                const response = await fetch(`${this.config.apiBase}/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.resultsFile}`, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                
                if (response.ok) {
                    const fileData = await response.json();
                    fileSha = fileData.sha;
                }
            } catch (error) {
                console.log('File does not exist yet, creating new file');
            }

            // 准备文件内容
            const content = btoa(unescape(encodeURIComponent(JSON.stringify(publicResults, null, 2))));
            
            // 创建或更新文件
            const updateResponse = await fetch(`${this.config.apiBase}/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.resultsFile}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `Update public results - ${publicResults.totalExperiments} experiments, ${publicResults.totalRatings} ratings`,
                    content: content,
                    sha: fileSha,
                    branch: this.config.branch
                })
            });

            if (!updateResponse.ok) {
                const errorText = await updateResponse.text();
                throw new Error(`GitHub API error: ${updateResponse.status} - ${errorText}`);
            }

            console.log('✅ Successfully synced to GitHub');
            
            // 更新同步状态
            this.updateSyncStatus('success', `Last sync: ${new Date().toLocaleString()}`);

        } catch (error) {
            console.error('❌ GitHub sync failed:', error);
            this.updateSyncStatus('error', `Sync failed: ${error.message}`);
            throw error;
        }
    }

    updateSyncStatus(status, message) {
        const syncStatusElement = document.getElementById('syncStatus');
        if (syncStatusElement) {
            const icon = status === 'success' ? '✅' : 
                        status === 'error' ? '❌' : '🔄';
            const bgColor = status === 'success' ? '#e8f5e8' : 
                           status === 'error' ? '#ffe8e8' : '#e8f0ff';
            
            syncStatusElement.innerHTML = `${icon} ${message}`;
            syncStatusElement.style.backgroundColor = bgColor;
        }

        // 广播同步状态事件
        window.dispatchEvent(new CustomEvent('cloudSyncStatus', {
            detail: { status, message }
        }));
    }

    // 公共API方法
    async loadPublicResults() {
        console.log('📊 Loading public results...');
        
        // 优先从GitHub加载（如果可用）
        if (this.config.syncToGitHub) {
            try {
                const results = await this.loadFromGitHub();
                if (results) {
                    console.log('✅ Loaded results from GitHub');
                    return results;
                }
            } catch (error) {
                console.warn('Failed to load from GitHub, falling back to local:', error);
            }
        }

        // 备用：从本地存储生成
        const localData = await this.getLocalData();
        const publicResults = this.preparePublicResults(localData);
        console.log('📱 Generated results from local storage');
        return publicResults;
    }

    async loadFromGitHub() {
        const token = this.getGitHubToken();
        if (!token) return null;

        try {
            const response = await fetch(`${this.config.apiBase}/repos/${this.config.owner}/${this.config.repo}/contents/${this.config.resultsFile}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                    console.log('Public results file not found on GitHub');
                    return null;
                }
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const fileData = await response.json();
            const content = atob(fileData.content);
            return JSON.parse(content);

        } catch (error) {
            console.error('Error loading from GitHub:', error);
            return null;
        }
    }

    // 手动触发同步
    async manualSync() {
        this.updateSyncStatus('syncing', 'Manual sync in progress...');
        await this.syncToCloud();
    }

    // 获取同步配置
    getConfig() {
        return { ...this.config };
    }

    // 更新配置
    updateConfig(newConfig) {
        Object.assign(this.config, newConfig);
        if (this.config.useCloudSync) {
            this.startPeriodicSync();
        } else {
            this.disableCloudSync();
        }
    }
}

// 创建全局实例
window.cloudSyncManager = new CloudSyncManager();

// 导出为模块（如果支持）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CloudSyncManager;
} 
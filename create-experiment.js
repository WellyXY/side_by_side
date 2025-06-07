class CreateExperimentManager {
    constructor() {
        this.currentPairs = [];
        this.folderFiles = {};
        
        // 配置：优先使用本地存储
        this.useLocalStorage = true;
        this.localStorageKey = 'sbs_experiments';
        
        // GitHub API 配置（作为备用）
        this.githubConfig = {
            owner: 'WellyXY',
            repo: 'side_by_side',
            dataFile: 'experiments-data.json',
            token: localStorage.getItem('github_token')
        };
        
        // 调试信息
        console.log('🔧 CreateExperimentManager 配置:');
        console.log('- 本地存储模式:', this.useLocalStorage ? '✅ 启用' : '❌ 禁用');
        
        const token = localStorage.getItem('github_token');
        if (token) {
            console.log('- GitHub token:', token.substring(0, 10) + '...');
        } else {
            console.log('- GitHub token: ❌ 未配置 (将使用本地存储)');
        }
    }

    init() {
        // 确保token配置正确
        this.ensureTokenConfiguration();
        this.loadFolderFiles();
        this.bindEvents();
        this.validateForm();
    }

    ensureTokenConfiguration() {
        // 重新获取token，以防auto-config.js刚刚设置了它
        const token = localStorage.getItem('github_token');
        if (token && token !== this.githubConfig.token) {
            this.githubConfig.token = token;
            console.log('🔄 Updated GitHub token from localStorage');
        }
        
        // 如果仍然没有token，等待一下再试
        if (!this.githubConfig.token) {
            console.log('⏳ Waiting for GitHub token configuration...');
            setTimeout(() => {
                const delayedToken = localStorage.getItem('github_token');
                if (delayedToken) {
                    this.githubConfig.token = delayedToken;
                    console.log('✅ GitHub token configured after delay');
                }
            }, 500);
        }
    }

    async loadFolderFiles() {
        const folders = ['Pika2.2', 'Pika2.5', 'Pika 2.2 DMD'];
        
        for (const folder of folders) {
            try {
                const files = await this.getVideoFiles(folder);
                this.folderFiles[folder] = files;
                console.log(`Loaded ${files.length} files from ${folder}`);
            } catch (error) {
                console.error(`Error loading files from ${folder}:`, error);
                this.folderFiles[folder] = [];
            }
        }
    }

    async getVideoFiles(folder) {
        try {
            // 先尝试从 GitHub API 获取文件列表
            const response = await fetch(
                `https://api.github.com/repos/WellyXY/side_by_side/contents/${encodeURIComponent(folder)}`,
                {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (response.ok) {
                const files = await response.json();
                // 过滤出 mp4 文件
                const videoFiles = files
                    .filter(file => file.type === 'file' && file.name.toLowerCase().endsWith('.mp4'))
                    .map(file => file.name);
                
                console.log(`从 GitHub 加载了 ${videoFiles.length} 个视频文件从 ${folder}`);
                return videoFiles;
            } else {
                console.warn(`GitHub API 失败 (${response.status}), 尝试本地模式`);
                return await this.getLocalVideoFiles(folder);
            }
        } catch (error) {
            console.error(`从 ${folder} 加载文件时出错:`, error);
            return await this.getLocalVideoFiles(folder);
        }
    }

    async getLocalVideoFiles(folder) {
        try {
            const response = await fetch(`${folder}/`);
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = doc.querySelectorAll('a[href$=".mp4"]');
            
            return Array.from(links).map(link => decodeURIComponent(link.getAttribute('href')));
        } catch (error) {
            console.error(`本地加载文件从 ${folder} 失败:`, error);
            return [];
        }
    }

    bindEvents() {
        // Folder selection events
        document.getElementById('folderA').addEventListener('change', () => this.updateFolderInfo());
        document.getElementById('folderB').addEventListener('change', () => this.updateFolderInfo());

        // Create experiment button
        document.getElementById('createExperiment').addEventListener('click', () => this.createExperiment());

        // Form validation
        document.getElementById('experimentName').addEventListener('input', () => this.validateForm());
        document.getElementById('experimentDescription').addEventListener('input', () => this.validateForm());

        // View experiments button
        document.getElementById('viewExperiments').addEventListener('click', () => {
            window.location.href = 'experiment-manager.html';
        });
    }

    updateFolderInfo() {
        const folderA = document.getElementById('folderA').value;
        const folderB = document.getElementById('folderB').value;

        // Update folder info display
        this.updateFolderDisplay('folderAInfo', folderA);
        this.updateFolderDisplay('folderBInfo', folderB);

        // If both folders are selected, calculate matching
        if (folderA && folderB && folderA !== folderB) {
            this.calculateMatching(folderA, folderB);
        } else {
            document.getElementById('matchingPreview').style.display = 'none';
        }

        this.validateForm();
    }

    updateFolderDisplay(elementId, folder) {
        const element = document.getElementById(elementId);
        if (folder) {
            const fileCount = this.folderFiles[folder]?.length || 0;
            element.textContent = `${fileCount} video files`;
            element.style.color = '#28a745';
        } else {
            element.textContent = '';
        }
    }

    calculateMatching(folderA, folderB) {
        const filesA = this.folderFiles[folderA] || [];
        const filesB = this.folderFiles[folderB] || [];
        
        const pairs = [];
        const getBaseName = (filename) => {
            let decoded = decodeURIComponent(filename);
            let baseName = decoded
                .replace(/_seed\d+.*$/, '')
                .replace(/\s*\(\d+\).*$/, '')
                .replace(/_share.*$/, '')
                .replace(/\.mp4$/, '')
                .trim();
            return baseName;
        };

        filesA.forEach(fileA => {
            const baseNameA = getBaseName(fileA);
            const matchingFileB = filesB.find(fileB => {
                const baseNameB = getBaseName(fileB);
                return baseNameA === baseNameB;
            });

            if (matchingFileB) {
                pairs.push({
                    baseName: baseNameA || 'Untitled',
                    fileA: fileA,
                    fileB: matchingFileB
                });
            }
        });

        this.currentPairs = pairs;
        this.displayMatchingPreview(pairs);
    }

    displayMatchingPreview(pairs) {
        const preview = document.getElementById('matchingPreview');
        const matchCount = document.getElementById('matchCount');
        const matchedPairs = document.getElementById('matchedPairs');

        matchCount.textContent = pairs.length;
        
        matchedPairs.innerHTML = '';
        pairs.slice(0, 5).forEach(pair => {
            const pairElement = document.createElement('div');
            pairElement.className = 'pair-item';
            pairElement.textContent = pair.baseName || 'Untitled Prompt';
            matchedPairs.appendChild(pairElement);
        });

        if (pairs.length > 5) {
            const moreElement = document.createElement('div');
            moreElement.className = 'pair-item';
            moreElement.style.fontStyle = 'italic';
            moreElement.textContent = `... and ${pairs.length - 5} more pairs`;
            matchedPairs.appendChild(moreElement);
        }

        preview.style.display = 'block';
    }

    validateForm() {
        const name = document.getElementById('experimentName').value.trim();
        const folderA = document.getElementById('folderA').value;
        const folderB = document.getElementById('folderB').value;
        
        const isValid = name && folderA && folderB && folderA !== folderB && this.currentPairs.length > 0;
        
        const button = document.getElementById('createExperiment');
        button.disabled = !isValid;
        
        // Update button text to show what's missing
        if (!isValid) {
            let missing = [];
            if (!name) missing.push('experiment name');
            if (!folderA) missing.push('folder A');
            if (!folderB) missing.push('folder B');
            if (folderA && folderB && folderA === folderB) missing.push('different folders');
            if (this.currentPairs.length === 0) missing.push('video pairs');
            
            button.textContent = `Missing: ${missing.join(', ')}`;
            button.style.opacity = '0.6';
        } else {
            button.textContent = 'Create Experiment';
            button.style.opacity = '1';
        }
    }

    async createExperiment() {
        const name = document.getElementById('experimentName').value.trim();
        const description = document.getElementById('experimentDescription').value.trim();
        const folderA = document.getElementById('folderA').value;
        const folderB = document.getElementById('folderB').value;

        const experiment = {
            id: Date.now().toString(),
            name: name,
            description: description,
            folderA: folderA,
            folderB: folderB,
            pairs: this.currentPairs,
            results: [],
            userSessions: {},
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            status: 'not-started'
        };

        try {
            console.log('🎬 Starting experiment creation:', experiment.name);
            
            let experiments = [];
            
            if (this.useLocalStorage) {
                console.log('💾 使用本地存储模式');
                
                // 从本地存储加载现有实验
                const existingData = localStorage.getItem(this.localStorageKey);
                if (existingData) {
                    try {
                        experiments = JSON.parse(existingData);
                        console.log('✅ 从本地存储加载了', experiments.length, '个现有实验');
                    } catch (error) {
                        console.warn('解析本地存储数据失败:', error);
                        experiments = [];
                    }
                } else {
                    console.log('📝 本地存储为空，创建新的实验列表');
                    experiments = [];
                }
                
                // 添加新实验
                experiments.push(experiment);
                console.log('📝 添加新实验，总数:', experiments.length);
                
                // 保存到本地存储
                localStorage.setItem(this.localStorageKey, JSON.stringify(experiments));
                console.log('✅ 实验已保存到本地存储');
                
                this.showMessage('实验创建成功！数据已保存到本地存储 ✅', 'success');
                this.showSuccessMessage();
                
            } else {
                console.log('🌐 使用 GitHub API 模式');
                
                // 确保我们有最新的token
                const currentToken = localStorage.getItem('github_token');
                if (currentToken) {
                    this.githubConfig.token = currentToken;
                    console.log('🔄 Refreshed GitHub token before saving');
                }
                
                // Load existing experiments from GitHub only
                if (this.githubConfig.token) {
                    console.log('📥 Loading existing experiments from GitHub...');
                    const githubExperiments = await this.loadExperimentsFromGitHub();
                    if (githubExperiments) {
                        experiments = githubExperiments;
                        console.log('✅ Successfully loaded existing experiments:', experiments.length, 'experiments');
                    } else {
                        console.log('⚠️ GitHub loading failed, using empty list');
                        experiments = [];
                    }
                } else {
                    console.error('❌ No GitHub token available');
                    throw new Error('GitHub token not configured. Cannot save experiment.');
                }

                // Add new experiment
                experiments.push(experiment);
                console.log('📝 Added new experiment, total count:', experiments.length);
                
                // Save to GitHub only
                console.log('💾 Saving to GitHub...');
                const saveResult = await this.saveExperimentsToGitHub(experiments);
                
                if (saveResult.success) {
                    console.log('✅ Experiment created successfully!');
                    this.showMessage('Experiment created successfully! Data saved to GitHub ✅', 'success');
                    
                    // Update local cache
                    localStorage.setItem(this.localStorageKey, JSON.stringify(experiments));
                    
                    this.showSuccessMessage();
                } else {
                    throw new Error(`Failed to save to GitHub: ${saveResult.error || 'Unknown error'}`);
                }
            }

        } catch (error) {
            console.error('❌ Failed to create experiment:', error);
            this.showMessage(`Failed to create experiment: ${error.message}`, 'error');
        }
    }

    showSuccessMessage() {
        document.querySelector('.form-container').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
        // Reset form
        document.getElementById('experimentName').value = '';
        document.getElementById('experimentDescription').value = '';
        document.getElementById('folderA').value = '';
        document.getElementById('folderB').value = '';
        document.getElementById('folderAInfo').textContent = '';
        document.getElementById('folderBInfo').textContent = '';
        document.getElementById('matchingPreview').style.display = 'none';
        this.currentPairs = [];
    }

    async loadExperimentsFromGitHub() {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/contents/${this.githubConfig.dataFile}`, {
                headers: {
                    'Authorization': `token ${this.githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const content = JSON.parse(atob(data.content));
                this.githubConfig.sha = data.sha;
                return content.experiments || [];
            }
        } catch (error) {
            console.error('Failed to load from GitHub:', error);
        }
        return null;
    }

    async saveExperimentsToGitHub(experiments) {
        try {
            console.log('💾 Starting GitHub save, experiment count:', experiments.length);
            
            // Validate token
            if (!this.githubConfig.token) {
                return { success: false, error: 'GitHub token not configured' };
            }

            const content = {
                experiments: experiments,
                lastUpdated: new Date().toISOString(),
                totalExperiments: experiments.length
            };

            const encodedContent = btoa(JSON.stringify(content, null, 2));

            const requestBody = {
                message: `Add new experiment: ${experiments[experiments.length - 1].name}`,
                content: encodedContent
            };

            // Get latest SHA to avoid conflicts
            if (!this.githubConfig.sha) {
                console.log('🔍 Getting latest file SHA...');
                const latestSha = await this.getLatestFileSha();
                if (latestSha) {
                    this.githubConfig.sha = latestSha;
                    console.log('📝 Retrieved latest SHA:', this.githubConfig.sha);
                }
            }

            if (this.githubConfig.sha) {
                requestBody.sha = this.githubConfig.sha;
                console.log('📝 Updating existing file with SHA:', this.githubConfig.sha);
            } else {
                console.log('📝 Creating new file');
            }

            console.log('🌐 Sending GitHub API request...');
            const response = await fetch(`https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/contents/${this.githubConfig.dataFile}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('📡 GitHub API response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                this.githubConfig.sha = result.content.sha;
                console.log('✅ Successfully saved to GitHub, new SHA:', this.githubConfig.sha);
                return { success: true };
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                const errorMessage = `HTTP ${response.status}: ${errorData.message || 'GitHub API error'}`;
                console.error('❌ GitHub API error:', errorMessage);
                console.error('Response:', errorData);
                return { success: false, error: errorMessage };
            }
        } catch (error) {
            console.error('❌ Failed to save to GitHub:', error);
            return { success: false, error: error.message || 'Network or unexpected error' };
        }
    }

    async getLatestFileSha() {
        try {
            const response = await fetch(`https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/contents/${this.githubConfig.dataFile}`, {
                headers: {
                    'Authorization': `token ${this.githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.sha;
            } else if (response.status === 404) {
                return null; // File doesn't exist yet
            } else {
                console.warn('Failed to get latest SHA:', response.status);
                return null;
            }
        } catch (error) {
            console.warn('Error getting latest SHA:', error);
            return null;
        }
    }

    showMessage(text, type = 'info') {
        // Simple message display
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            font-weight: 600;
        `;
        message.textContent = text;
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// Initialize the create experiment manager
document.addEventListener('DOMContentLoaded', () => {
    const manager = new CreateExperimentManager();
    // 暴露到window对象供auto-config.js访问
    window.createManager = manager;
    manager.init();
}); 
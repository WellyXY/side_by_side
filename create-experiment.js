class CreateExperimentManager {
    constructor() {
        this.currentPairs = [];
        this.folderFiles = {};
        
        // GitHub API 配置
        this.githubConfig = {
            owner: 'WellyXY',
            repo: 'side_by_side',
            dataFile: 'experiments-data.json',
            token: localStorage.getItem('github_token')
        };
        
        // 调试信息
        const token = localStorage.getItem('github_token');
        if (token) {
            console.log('GitHub token loaded from localStorage:', token.substring(0, 10) + '...');
        } else {
            console.warn('No GitHub token found in localStorage');
        }
    }

    init() {
        this.loadFolderFiles();
        this.bindEvents();
        this.validateForm();
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
            console.log('🎬 开始创建实验:', experiment.name);
            
            // 仅从GitHub加载现有实验数据
            let experiments = [];
            if (this.githubConfig.token) {
                console.log('📥 从GitHub加载现有实验...');
                const githubExperiments = await this.loadExperimentsFromGitHub();
                if (githubExperiments) {
                    experiments = githubExperiments;
                    console.log('✅ 成功加载现有实验:', experiments.length, '个');
                } else {
                    console.log('⚠️ GitHub加载失败，使用空列表');
                    experiments = [];
                }
            } else {
                console.error('❌ 没有GitHub token，无法保存实验');
                throw new Error('GitHub token未配置，无法保存实验');
            }

            // 添加新实验
            experiments.push(experiment);
            console.log('📝 添加新实验，总数:', experiments.length);
            
            // 仅保存到GitHub
            console.log('💾 保存到GitHub...');
            const saveSuccess = await this.saveExperimentsToGitHub(experiments);
            
            if (saveSuccess) {
                console.log('✅ 实验创建成功！');
                this.showMessage('实验创建成功！数据已保存到GitHub ✅', 'success');
                
                // 更新本地缓存
                localStorage.setItem('sbs_experiments', JSON.stringify(experiments));
                
                this.showSuccessMessage();
            } else {
                throw new Error('保存到GitHub失败');
            }

        } catch (error) {
            console.error('❌ 创建实验失败:', error);
            this.showMessage(`创建实验失败: ${error.message}`, 'error');
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
            console.log('💾 开始保存到GitHub，实验数量:', experiments.length);
            
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

            if (this.githubConfig.sha) {
                requestBody.sha = this.githubConfig.sha;
                console.log('📝 更新现有文件，SHA:', this.githubConfig.sha);
            } else {
                console.log('📝 创建新文件');
            }

            console.log('🌐 发送GitHub API请求...');
            const response = await fetch(`https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/contents/${this.githubConfig.dataFile}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('📡 GitHub API响应状态:', response.status);

            if (response.ok) {
                const result = await response.json();
                this.githubConfig.sha = result.content.sha;
                console.log('✅ 成功保存到GitHub，新SHA:', this.githubConfig.sha);
                return true;
            } else {
                const errorText = await response.text();
                console.error('❌ GitHub API错误:', response.status, errorText);
                throw new Error(`GitHub API错误: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            console.error('❌ 保存到GitHub失败:', error);
            return false;
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
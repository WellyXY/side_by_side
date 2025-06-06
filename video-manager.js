class VideoManager {
    constructor() {
        this.folders = [];
        this.currentUploadFolder = null;
        
        // GitHub 配置
        this.githubConfig = {
            owner: 'WellyXY',
            repo: 'side_by_side',
            branch: 'main'
        };
    }

    init() {
        this.loadFoldersFromGitHub();
        this.bindEvents();
    }

    async loadFoldersFromGitHub() {
        try {
            console.log('Loading video folders from GitHub...');
            
            // 获取仓库文件夹结构
            const response = await fetch(`https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/git/trees/${this.githubConfig.branch}?recursive=1`);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const data = await response.json();
            const videoFolders = new Map();
            
            // 解析文件树，找到视频文件
            data.tree.forEach(item => {
                if (item.type === 'blob' && item.path.endsWith('.mp4')) {
                    const pathParts = item.path.split('/');
                    if (pathParts.length >= 2) {
                        const folderName = pathParts[0];
                        const fileName = pathParts[pathParts.length - 1];
                        
                        if (!videoFolders.has(folderName)) {
                            videoFolders.set(folderName, {
                                name: folderName,
                                files: [],
                                isGitHub: true
                            });
                        }
                        
                        videoFolders.get(folderName).files.push({
                            name: fileName,
                            size: 'Loading...', // 大小需要额外 API 调用
                            path: item.path,
                            url: `https://github.com/${this.githubConfig.owner}/${this.githubConfig.repo}/raw/${this.githubConfig.branch}/${item.path}`
                        });
                    }
                }
            });
            
            this.folders = Array.from(videoFolders.values());
            
            // 加载用户创建的自定义文件夹
            const customFolders = JSON.parse(localStorage.getItem('custom_folders') || '[]');
            this.folders.push(...customFolders);
            
            console.log(`Found ${this.folders.length} video folders with videos`);
            this.renderFolders();
            
        } catch (error) {
            console.error('Error loading folders from GitHub:', error);
            this.showMessage('Failed to load video folders from GitHub. Using local data.', 'warning');
            this.loadFallbackData();
        }
    }

    loadFallbackData() {
        // 备用数据，以防 GitHub 加载失败
        this.folders = [
            {
                name: 'Pika2.2',
                files: [
                    { name: 'Loading from GitHub...', size: '-' }
                ],
                isGitHub: true
            },
            {
                name: 'Pika2.5', 
                files: [
                    { name: 'Loading from GitHub...', size: '-' }
                ],
                isGitHub: true
            },
            {
                name: 'Pika 2.2 DMD',
                files: [
                    { name: 'Loading from GitHub...', size: '-' }
                ],
                isGitHub: true
            }
        ];
        
        const customFolders = JSON.parse(localStorage.getItem('custom_folders') || '[]');
        this.folders.push(...customFolders);
        
        this.renderFolders();
    }

    bindEvents() {
        // 添加文件夹按钮
        document.getElementById('addFolderBtn').addEventListener('click', () => this.addNewFolder());
        
        // 回车键创建文件夹
        document.getElementById('newFolderName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addNewFolder();
            }
        });

        // 文件输入变化
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelect(e));
    }

    addNewFolder() {
        const input = document.getElementById('newFolderName');
        const folderName = input.value.trim();

        if (!folderName) {
            this.showMessage('Please enter a folder name', 'error');
            return;
        }

        // 检查是否已存在同名文件夹
        if (this.folders.some(folder => folder.name === folderName)) {
            this.showMessage('A folder with this name already exists', 'error');
            return;
        }

        // 创建新文件夹
        const newFolder = {
            name: folderName,
            files: [],
            isCustom: true
        };

        this.folders.push(newFolder);
        
        // 保存到 localStorage
        const customFolders = this.folders.filter(f => f.isCustom);
        localStorage.setItem('custom_folders', JSON.stringify(customFolders));

        // 重新渲染
        this.renderFolders();
        
        // 清空输入框
        input.value = '';
        
        this.showMessage(`Folder "${folderName}" created successfully!`, 'success');
    }

    renderFolders() {
        const container = document.getElementById('videoFolders');
        container.innerHTML = '';

        this.folders.forEach(folder => {
            const folderCard = this.createFolderCard(folder);
            container.appendChild(folderCard);
        });
    }

    createFolderCard(folder) {
        const card = document.createElement('div');
        card.className = 'folder-card';
        
        const folderTypeIndicator = folder.isGitHub ? '🌐' : folder.isCustom ? '📁' : '💾';
        const folderStatus = folder.isGitHub ? 'GitHub Repository' : folder.isCustom ? 'Custom Folder' : 'Local Folder';
        
        card.innerHTML = `
            <div class="folder-header">
                <div class="folder-name">${folderTypeIndicator} ${folder.name}</div>
                <div class="file-count">${folder.files.length} files</div>
            </div>
            
            <div style="text-align: center; color: #6b7280; font-size: 0.8rem; margin-bottom: 15px;">
                ${folderStatus}
            </div>
            
            ${!folder.isGitHub ? `
                <div class="upload-area" data-folder="${folder.name}">
                    <div class="upload-icon">📁</div>
                    <div><strong>Click to upload videos</strong></div>
                    <div style="margin-top: 5px; color: #6b7280; font-size: 0.9rem;">
                        Or drag and drop video files here
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                </div>
            ` : `
                <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; margin-bottom: 20px;">
                    <div style="color: #28a745; font-weight: 600;">📂 GitHub Repository Folder</div>
                    <div style="color: #6c757d; font-size: 0.9rem; margin-top: 5px;">
                        Videos are stored in GitHub LFS
                    </div>
                </div>
            `}
            
            <div class="file-list">
                ${folder.files.map(file => `
                    <div class="file-item">
                        <div class="file-name" title="${file.name}">${file.name}</div>
                        <div class="file-size">${file.size}</div>
                        <div style="display: flex; gap: 5px;">
                            ${file.url ? `
                                <a href="${file.url}" target="_blank" style="color: #007bff; text-decoration: none; padding: 5px;">
                                    🔗
                                </a>
                            ` : ''}
                            ${!folder.isGitHub ? `
                                <div class="delete-file" onclick="videoManager.deleteFile('${folder.name}', '${file.name}')">
                                    🗑️
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
                
                ${folder.files.length === 0 ? `
                    <div style="text-align: center; color: #6b7280; padding: 20px; font-style: italic;">
                        No videos in this folder
                    </div>
                ` : ''}
            </div>
            
            ${folder.isCustom ? `
                <div style="margin-top: 15px; text-align: center;">
                    <button onclick="videoManager.deleteFolder('${folder.name}')" 
                            style="background: #ef4444; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
                        Delete Folder
                    </button>
                </div>
            ` : ''}
        `;

        // 只为非 GitHub 文件夹绑定上传事件
        if (!folder.isGitHub) {
            const uploadArea = card.querySelector('.upload-area');
            if (uploadArea) {
                this.bindUploadEvents(uploadArea, folder.name);
            }
        }

        return card;
    }

    bindUploadEvents(uploadArea, folderName) {
        // 点击上传
        uploadArea.addEventListener('click', () => {
            this.currentUploadFolder = folderName;
            document.getElementById('fileInput').click();
        });

        // 拖拽上传
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.currentUploadFolder = folderName;
            this.handleFileUpload(e.dataTransfer.files);
        });
    }

    handleFileSelect(event) {
        if (this.currentUploadFolder) {
            this.handleFileUpload(event.target.files);
        }
    }

    handleFileUpload(files) {
        if (!this.currentUploadFolder) return;

        const videoFiles = Array.from(files).filter(file => 
            file.type.startsWith('video/') || file.name.toLowerCase().endsWith('.mp4')
        );

        if (videoFiles.length === 0) {
            this.showMessage('Please select valid video files (.mp4)', 'error');
            return;
        }

        // 模拟文件上传
        this.simulateUpload(videoFiles, this.currentUploadFolder);
    }

    simulateUpload(files, folderName) {
        const folder = this.folders.find(f => f.name === folderName);
        if (!folder) return;

        this.showMessage(`Starting upload of ${files.length} file(s) to ${folderName}...`, 'info');

        // 模拟上传进度
        files.forEach((file, index) => {
            setTimeout(() => {
                // 添加文件到文件夹
                const newFile = {
                    name: file.name,
                    size: this.formatFileSize(file.size)
                };

                folder.files.push(newFile);

                // 如果是自定义文件夹，保存到 localStorage
                if (folder.isCustom) {
                    const customFolders = this.folders.filter(f => f.isCustom);
                    localStorage.setItem('custom_folders', JSON.stringify(customFolders));
                }

                // 重新渲染文件夹
                this.renderFolders();

                if (index === files.length - 1) {
                    this.showMessage(`Successfully uploaded ${files.length} file(s) to ${folderName}!`, 'success');
                }
            }, (index + 1) * 1000); // 模拟上传延迟
        });
    }

    deleteFile(folderName, fileName) {
        if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
            return;
        }

        const folder = this.folders.find(f => f.name === folderName);
        if (folder) {
            folder.files = folder.files.filter(file => file.name !== fileName);
            
            // 如果是自定义文件夹，更新 localStorage
            if (folder.isCustom) {
                const customFolders = this.folders.filter(f => f.isCustom);
                localStorage.setItem('custom_folders', JSON.stringify(customFolders));
            }
            
            this.renderFolders();
            this.showMessage(`File "${fileName}" deleted successfully`, 'success');
        }
    }

    deleteFolder(folderName) {
        if (!confirm(`Are you sure you want to delete the entire folder "${folderName}" and all its files?`)) {
            return;
        }

        this.folders = this.folders.filter(f => f.name !== folderName);
        
        // 更新 localStorage
        const customFolders = this.folders.filter(f => f.isCustom);
        localStorage.setItem('custom_folders', JSON.stringify(customFolders));
        
        this.renderFolders();
        this.showMessage(`Folder "${folderName}" deleted successfully`, 'success');
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : type === 'warning' ? '#fff3cd' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : type === 'warning' ? '#856404' : '#0c5460'};
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            z-index: 1001;
            font-weight: 600;
            max-width: 400px;
        `;
        message.textContent = text;
        document.body.appendChild(message);

        setTimeout(() => {
            message.remove();
        }, 4000);
    }
}

// 全局变量以便在 HTML onclick 中使用
let videoManager;

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    videoManager = new VideoManager();
    videoManager.init();
}); 
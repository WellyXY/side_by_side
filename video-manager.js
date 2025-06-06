class VideoManager {
    constructor() {
        this.folders = [];
        this.currentUploadFolder = null;
        
        // 模拟的文件夹和文件数据（实际应该从服务器获取）
        this.mockFolders = [
            {
                name: 'Pika2.2',
                files: [
                    { name: 'video1.mp4', size: '15.2 MB' },
                    { name: 'video2.mp4', size: '18.7 MB' },
                    { name: 'video3.mp4', size: '12.1 MB' }
                ]
            },
            {
                name: 'Pika2.5', 
                files: [
                    { name: 'sample1.mp4', size: '20.3 MB' },
                    { name: 'sample2.mp4', size: '16.8 MB' }
                ]
            },
            {
                name: 'Pika 2.2 DMD',
                files: [
                    { name: 'dmd_test1.mp4', size: '22.1 MB' },
                    { name: 'dmd_test2.mp4', size: '19.5 MB' },
                    { name: 'dmd_test3.mp4', size: '25.0 MB' }
                ]
            }
        ];
    }

    init() {
        this.loadFolders();
        this.bindEvents();
        this.renderFolders();
    }

    loadFolders() {
        // 加载现有文件夹数据（这里使用模拟数据）
        this.folders = [...this.mockFolders];
        
        // 也可以从 localStorage 加载用户创建的文件夹
        const customFolders = JSON.parse(localStorage.getItem('custom_folders') || '[]');
        this.folders.push(...customFolders);
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
        
        card.innerHTML = `
            <div class="folder-header">
                <div class="folder-name">${folder.name}</div>
                <div class="file-count">${folder.files.length} files</div>
            </div>
            
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
            
            <div class="file-list">
                ${folder.files.map(file => `
                    <div class="file-item">
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${file.size}</div>
                        <div class="delete-file" onclick="videoManager.deleteFile('${folder.name}', '${file.name}')">
                            🗑️
                        </div>
                    </div>
                `).join('')}
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

        // 绑定上传区域事件
        const uploadArea = card.querySelector('.upload-area');
        this.bindUploadEvents(uploadArea, folder.name);

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
            background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
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
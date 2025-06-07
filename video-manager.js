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

// 配置
const CONFIG = {
    // 优先使用本地文件
    USE_LOCAL_FILES: true,
    GITHUB_REPO: 'WellyXY/side_by_side',
    // 本地文件路径
    LOCAL_PATHS: {
        'Pika2.2': './Pika2.2/',
        'Pika2.5': './Pika2.5/', 
        'Pika 2.2 DMD': './Pika 2.2 DMD/'
    }
};

// 文件大小格式化
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 获取本地文件列表
async function getLocalFiles(folderName) {
    const localPath = CONFIG.LOCAL_PATHS[folderName];
    if (!localPath) return [];
    
    try {
        // 首先尝试通过 JSON API 获取文件列表
        const response = await fetch(localPath, {
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const files = await response.json();
            return files.map(file => ({
                name: file.name,
                path: file.url,
                url: `http://localhost:8080${file.url}`,
                size: formatFileSize(file.size),
                folder: folderName
            }));
        }
    } catch (error) {
        console.warn(`无法通过 API 读取目录 ${localPath}:`, error);
    }
    
    try {
        // 尝试获取目录内容 (HTML 格式)
        const response = await fetch(localPath);
        if (response.ok) {
            const text = await response.text();
            const files = parseDirectoryListing(text, folderName);
            return files;
        }
    } catch (error) {
        console.warn(`无法读取本地目录 ${localPath}:`, error);
    }
    
    // 如果无法动态读取，返回一个预定义的文件列表
    return getStaticFileList(folderName);
}

// 解析目录列表 (用于简单的文件服务器)
function parseDirectoryListing(html, folderName) {
    const files = [];
    const regex = /<a href="([^"]+\.mp4)"/gi;
    let match;
    
    while ((match = regex.exec(html)) !== null) {
        const fileName = match[1];
        files.push({
            name: fileName,
            path: `${CONFIG.LOCAL_PATHS[folderName]}${fileName}`,
            url: `${CONFIG.LOCAL_PATHS[folderName]}${fileName}`,
            size: '未知',
            folder: folderName
        });
    }
    
    return files;
}

// 静态文件列表 (当无法动态读取时使用)
function getStaticFileList(folderName) {
    const staticFiles = {
        'Pika2.2': [
            'a_beautiful_landscape.mp4',
            'a_bustling_city_street.mp4',
            'a_calm_ocean_view.mp4',
            'a_colorful_garden.mp4',
            'a_cozy_fireplace.mp4',
            'a_flowing_river.mp4',
            'a_majestic_mountain.mp4',
            'a_peaceful_forest.mp4',
            'a_serene_lake.mp4',
            'a_stunning_sunset.mp4',
            'a_vibrant_market.mp4',
            'an_enchanted_castle.mp4',
            'an_old_library.mp4',
            'birds_flying_high.mp4',
            'clouds_moving_fast.mp4',
            'flowers_blooming.mp4',
            'leaves_falling_down.mp4',
            'rain_on_window.mp4',
            'snow_falling_softly.mp4',
            'waves_crashing_shore.mp4'
        ],
        'Pika2.5': [
            'abstract_art_motion.mp4',
            'autumn_leaves_dancing.mp4',
            'butterfly_on_flower.mp4',
            'cat_playing_yarn.mp4',
            'children_laughing.mp4',
            'coffee_steam_rising.mp4',
            'dog_running_field.mp4',
            'fire_crackling_night.mp4',
            'fish_swimming_aquarium.mp4',
            'fountain_water_dancing.mp4',
            'guitar_strings_vibrating.mp4',
            'hands_typing_keyboard.mp4',
            'lightning_storm_clouds.mp4',
            'music_notes_floating.mp4',
            'paint_brush_strokes.mp4',
            'paper_airplane_flying.mp4',
            'pencil_drawing_lines.mp4',
            'spider_web_dewdrops.mp4',
            'steam_locomotive_moving.mp4',
            'windmill_blades_turning.mp4'
        ],
        'Pika 2.2 DMD': [
            'alien_spaceship_landing.mp4',
            'ancient_ruins_mystery.mp4',
            'crystal_cave_glowing.mp4',
            'cyberpunk_city_neon.mp4',
            'desert_mirage_shimmering.mp4',
            'dragon_breathing_fire.mp4',
            'fairy_forest_magical.mp4',
            'future_car_hovering.mp4',
            'galaxy_stars_spinning.mp4',
            'ghost_town_eerie.mp4',
            'ice_palace_frozen.mp4',
            'jungle_vines_swinging.mp4',
            'lava_flow_volcanic.mp4',
            'mermaid_underwater_swimming.mp4',
            'phoenix_rising_flames.mp4',
            'pirate_ship_sailing.mp4',
            'robot_dancing_disco.mp4',
            'time_portal_swirling.mp4',
            'underwater_coral_reef.mp4',
            'wizard_casting_spell.mp4'
        ]
    };
    
    const fileList = staticFiles[folderName] || [];
    return fileList.map(fileName => ({
        name: fileName,
        path: `${CONFIG.LOCAL_PATHS[folderName]}${fileName}`,
        url: `${CONFIG.LOCAL_PATHS[folderName]}${fileName}`,
        size: '未知',
        folder: folderName
    }));
}

// 修改主要的加载函数
async function loadVideos() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error');
    const videoListEl = document.getElementById('videoList');
    
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    videoListEl.innerHTML = '';
    
    try {
        let allVideos = [];
        
        if (CONFIG.USE_LOCAL_FILES) {
            console.log('使用本地文件模式');
            // 使用本地文件
            for (const folderName of Object.keys(CONFIG.LOCAL_PATHS)) {
                const videos = await getLocalFiles(folderName);
                allVideos = allVideos.concat(videos);
            }
        } else {
            console.log('使用 GitHub API 模式');
            // 使用 GitHub API (原有逻辑)
            for (const folderName of ['Pika2.2', 'Pika2.5', 'Pika 2.2 DMD']) {
                const videos = await getVideosFromFolder(folderName);
                allVideos = allVideos.concat(videos);
            }
        }
        
        if (allVideos.length === 0) {
            throw new Error('未找到任何视频文件');
        }
        
        displayVideos(allVideos);
        updateStats(allVideos);
        
    } catch (error) {
        console.error('加载失败:', error);
        errorEl.textContent = `加载失败: ${error.message}`;
        errorEl.style.display = 'block';
        
        // 如果 GitHub API 失败，尝试切换到本地模式
        if (!CONFIG.USE_LOCAL_FILES) {
            console.log('GitHub API 失败，尝试切换到本地模式');
            CONFIG.USE_LOCAL_FILES = true;
            setTimeout(() => loadVideos(), 1000);
        }
    } finally {
        loadingEl.style.display = 'none';
    }
} 
class ExperimentManager {
    constructor() {
        this.experiments = [];
        this.folderFiles = {
            'Pika2.2': [
                'in_the_middle_of_the_room_a_huge_scary_black_monster,_shows_how_scary_he_is,_threatens_with_claws._S_seed597871983_share.mp4',
                'Camera_zoom_out_show_background_keep_background_still_seed2962639488_share.mp4',
                'For_the_first_5_seconds,_she_stands_still_with_a_confident_expression,_holding_her_phone_up_for_a_se_seed2248812118_share.mp4',
                'sudden_transformation,_the_cute_bear_turns_evil,_eyes_glowing_red,_dark_fog_emerges,_the_forest_beco_seed3442000665_share.mp4',
                'blockhead_walks_down_the_road,_cinematic_motion_-_he_s_happy_and_on_his_way_to_his_first_job_intervi_seed1220424182_share.mp4',
                'ansicht_enfernt_sich_nach_oben_bis_hin_in_die_galaxie_seed315215982_share (1).mp4',
                '_______________________seed2828720051_share.mp4',
                'The_subject_flexes,_and_their_physique_quickly_grows_in_size,_with_muscles_bulging_and_their_body_ap_seed123415889_share.mp4',
                'the_cyborg_walking_into_the_camera,_hyper_realistic_seed4241554145_share.mp4',
                'A_stop-motion_animation_of_a_young_girl_riding_a_bike_on_a_colorful_cobblestone_street._The_animatio_seed967990582_share.mp4',
                'turn_his_hair_into_rainboy_flowing_hair_seed959718997_share.mp4',
                'light_changing_from_day_to_night_hyperlapse,__from_color_to_black_and_white,_camera_slow_motion_seed3063414036_share.mp4',
                'slow_motion_pan_around_the_room_as_the_sunlight_slowly_moves_seed2950340679_share.mp4',
                '_seed2237706291_share.mp4',
                'light_changing_from_day_to_night_hyperlapse,__from_color_to_black_and_white,_camera_slow_motion_seed1965249495_share.mp4',
                'a_person_playing_with_fire,_camera_slow_motion_seed2376148755_share.mp4',
                'realistic_film_noir,_tv_glitch_effect,_channel_searching,_high-contrast_black_and_white,_grainy_text_seed3223925332_share.mp4',
                'A_fluffy_white_rabbit_is_riding_a_tiny_red_bicycle_on_a_smooth,_open_road,_surrounded_by_lush_greene_seed356767507_share.mp4',
                'light_changing_from_night_to_day,_from_black_and_white_to_color,_camera_slow_motion_seed2569080236_share.mp4',
                'embrace,_camera_pull_out_slow_motion_seed2128269750_share.mp4',
                'Hollywood_cinematic_style,_anamorphic_lens_flares,_moody_lighting,_shallow_depth_of_field,_ultra-det_seed2100749902_share.mp4'
            ],
            'Pika2.5': [
                '_______________________seed2418722488_share.mp4',
                'The_subject_flexes,_and_their_physique_quickly_grows_in_size,_with_muscles_bulging_and_their_body_ap_seed2008997275_share.mp4',
                'the_cyborg_walking_into_the_camera,_hyper_realistic_seed117802853_share.mp4',
                'A_stop-motion_animation_of_a_young_girl_riding_a_bike_on_a_colorful_cobblestone_street._The_animatio_seed2594153343_share.mp4',
                'turn_his_hair_into_rainboy_flowing_hair_seed2642205765_share.mp4',
                'light_changing_from_day_to_night_hyperlapse,__from_color_to_black_and_white,_camera_slow_motion_seed55476491_share.mp4',
                'slow_motion_pan_around_the_room_as_the_sunlight_slowly_moves_seed899480959_share.mp4',
                '_seed2253215074_share.mp4',
                'light_changing_from_day_to_night_hyperlapse,__from_color_to_black_and_white,_camera_slow_motion_seed626847776_share.mp4',
                'a_person_playing_with_fire,_camera_slow_motion_seed728223321_share.mp4',
                'realistic_film_noir,_tv_glitch_effect,_channel_searching,_high-contrast_black_and_white,_grainy_text_seed3511628850_share.mp4',
                'A_fluffy_white_rabbit_is_riding_a_tiny_red_bicycle_on_a_smooth,_open_road,_surrounded_by_lush_greene_seed1778241704_share.mp4',
                'light_changing_from_night_to_day,_from_black_and_white_to_color,_camera_slow_motion_seed1640294225_share.mp4',
                'embrace,_camera_pull_out_slow_motion_seed376487858_share.mp4',
                'Hollywood_cinematic_style,_anamorphic_lens_flares,_moody_lighting,_shallow_depth_of_field,_ultra-det_seed319275370_share.mp4',
                'ansicht_enfernt_sich_nach_oben_bis_hin_in_die_galaxie_seed1488507931_share.mp4',
                'blockhead_walks_down_the_road,_cinematic_motion_-_he_s_happy_and_on_his_way_to_his_first_job_intervi_seed3676193018_share.mp4',
                'sudden_transformation,_the_cute_bear_turns_evil,_eyes_glowing_red,_dark_fog_emerges,_the_forest_beco_seed2014258508_share.mp4',
                'Camera_zoom_out_show_background_keep_background_still_seed247825574_share.mp4',
                'For_the_first_5_seconds,_she_stands_still_with_a_confident_expression,_holding_her_phone_up_for_a_se_seed1457154502_share.mp4',
                'in_the_middle_of_the_room_a_huge_scary_black_monster,_shows_how_scary_he_is,_threatens_with_claws._S_seed352803981_share.mp4'
            ],
            'Pika 2.2 DMD': [
                'Beautiful_woman_performing_a_slow_and_hot_dance,_seductive._seed1781837817_share (1).mp4',
                '_______________________seed362932130_share.mp4',
                'The_subject_flexes,_and_their_physique_quickly_grows_in_size,_with_muscles_bulging_and_their_body_ap_seed1271947112_share (1).mp4',
                'The_subject_flexes,_and_their_physique_quickly_grows_in_size,_with_muscles_bulging_and_their_body_ap_seed2770633158_share.mp4',
                'the_cyborg_walking_into_the_camera,_hyper_realistic_seed3001336279_share.mp4',
                'A_stop-motion_animation_of_a_young_girl_riding_a_bike_on_a_colorful_cobblestone_street._The_animatio_seed2048251825_share.mp4',
                'turn_his_hair_into_rainboy_flowing_hair_seed3821044205_share.mp4',
                'light_changing_from_day_to_night_hyperlapse,__from_color_to_black_and_white,_camera_slow_motion_seed3434017790_share.mp4',
                'slow_motion_pan_around_the_room_as_the_sunlight_slowly_moves_seed1846296648_share.mp4',
                '_seed3841946111_share.mp4',
                'light_changing_from_day_to_night_hyperlapse,__from_color_to_black_and_white,_camera_slow_motion_seed3156313390_share.mp4',
                'a_person_playing_with_fire,_camera_slow_motion_seed1749231268_share.mp4',
                'realistic_film_noir,_tv_glitch_effect,_channel_searching,_high-contrast_black_and_white,_grainy_text_seed1874987402_share.mp4',
                'A_fluffy_white_rabbit_is_riding_a_tiny_red_bicycle_on_a_smooth,_open_road,_surrounded_by_lush_greene_seed3749730526_share.mp4',
                'light_changing_from_night_to_day,_from_black_and_white_to_color,_camera_slow_motion_seed2815469630_share.mp4',
                'embrace,_camera_pull_out_slow_motion_seed118623555_share.mp4',
                'Hollywood_cinematic_style,_anamorphic_lens_flares,_moody_lighting,_shallow_depth_of_field,_ultra-det_seed504140935_share.mp4'
            ]
        };
        this.currentPairs = [];
        this.deleteTargetId = null;
        
        // GitHub API 配置
        this.githubConfig = {
            owner: 'WellyXY',  // 你的 GitHub 用户名
            repo: 'side_by_side',  // 你的仓库名
            dataFile: 'experiments-data.json',  // 数据文件名
            // 注意: 在生产环境中，应该使用环境变量或更安全的方式存储 token
            token: null  // 需要设置 GitHub Personal Access Token
        };
    }

    init() {
        this.initGithubSettings();
        this.bindEvents();
        this.setupPageVisibilitySync();
        
        // 延迟加载数据，确保auto-config.js有时间设置token
        setTimeout(() => {
            this.loadExperiments();
        }, 200);
    }

    // 设置页面可见性同步 - 确保不同浏览器数据一致
    setupPageVisibilitySync() {
        // 当页面变为可见时，重新同步数据
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.githubConfig.token) {
                console.log('页面变为可见，重新同步数据...');
                setTimeout(() => {
                    this.loadExperiments();
                }, 500);
            }
        });
        
        // 当窗口获得焦点时，也重新同步
        window.addEventListener('focus', () => {
            if (this.githubConfig.token) {
                console.log('窗口获得焦点，重新同步数据...');
                setTimeout(() => {
                    this.loadExperiments();
                }, 300);
            }
        });
    }

    bindEvents() {
        // 只绑定在当前页面存在的元素，避免错误
        
        // Clear all data button (在 experiment-manager.html 中存在)
        const clearAllBtn = document.getElementById('clearAllData');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllData());
        }

        // GitHub settings events (在 experiment-manager.html 中存在)
        const githubSettingsBtn = document.getElementById('githubSettings');
        if (githubSettingsBtn) {
            githubSettingsBtn.addEventListener('click', () => this.showGithubSettings());
        }
        
        const testConnectionBtn = document.getElementById('testConnection');
        if (testConnectionBtn) {
            testConnectionBtn.addEventListener('click', () => this.testGithubConnection());
        }
        
        const forceSyncBtn = document.getElementById('forceSyncNow');
        if (forceSyncBtn) {
            forceSyncBtn.addEventListener('click', () => this.forceSyncNow());
        }
        
        const saveGithubBtn = document.getElementById('saveGithubSettings');
        if (saveGithubBtn) {
            saveGithubBtn.addEventListener('click', () => this.saveGithubSettings());
        }
        
        const cancelGithubBtn = document.getElementById('cancelGithubSettings');
        if (cancelGithubBtn) {
            cancelGithubBtn.addEventListener('click', () => this.hideGithubSettings());
        }

        // Delete Modal events (在 experiment-manager.html 中存在)
        const confirmDeleteBtn = document.getElementById('confirmDelete');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => this.confirmDelete());
        }
        
        const cancelDeleteBtn = document.getElementById('cancelDelete');
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', () => this.hideDeleteModal());
        }

        // 创建实验相关的元素只在 create-experiment.html 中存在，这里不应该绑定
        // 这些元素由 create-experiment.js 处理
        const folderA = document.getElementById('folderA');
        const folderB = document.getElementById('folderB');
        const createExperimentBtn = document.getElementById('createExperiment');
        const experimentName = document.getElementById('experimentName');
        const experimentDescription = document.getElementById('experimentDescription');
        
        if (folderA && folderB && createExperimentBtn && experimentName && experimentDescription) {
            // 只有在创建实验页面才绑定这些事件
            folderA.addEventListener('change', () => this.updateFolderInfo());
            folderB.addEventListener('change', () => this.updateFolderInfo());
            createExperimentBtn.addEventListener('click', () => this.createExperiment());
            experimentName.addEventListener('input', () => this.validateForm());
            experimentDescription.addEventListener('input', () => this.validateForm());
        }
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
        
        // Debug information
        console.log('=== Form Validation Debug ===');
        console.log('Experiment Name:', name ? `"${name}"` : 'EMPTY');
        console.log('Folder A:', folderA || 'NOT SELECTED');
        console.log('Folder B:', folderB || 'NOT SELECTED');
        console.log('Folders different:', folderA && folderB && folderA !== folderB);
        console.log('Current pairs:', this.currentPairs.length);
        
        const isValid = name && folderA && folderB && folderA !== folderB && this.currentPairs.length > 0;
        console.log('Form is valid:', isValid);
        console.log('Button disabled:', !isValid);
        console.log('===============================');
        
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

    createExperiment() {
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
            results: [], // Will store: { userId, roundId, pairIndex, rating, timestamp }
            userSessions: {}, // Track user sessions: { userId: { rounds: [{roundId, completed, results}] } }
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            status: 'not-started'
        };

        this.experiments.push(experiment);
        this.saveExperiments();
        this.renderExperiments();
        this.updateStatistics();
        this.resetForm();

        this.showMessage('Experiment created successfully!', 'success');
    }

    resetForm() {
        document.getElementById('experimentName').value = '';
        document.getElementById('experimentDescription').value = '';
        document.getElementById('folderA').value = '';
        document.getElementById('folderB').value = '';
        document.getElementById('folderAInfo').textContent = '';
        document.getElementById('folderBInfo').textContent = '';
        document.getElementById('matchingPreview').style.display = 'none';
        this.currentPairs = [];
        this.validateForm();
    }

    renderExperiments() {
        const container = document.getElementById('experimentsContainer');
        
        if (this.experiments.length === 0) {
            container.innerHTML = '<p class="no-experiments">No experiments yet, please create one first</p>';
            return;
        }

        container.innerHTML = this.experiments.map(exp => this.generateExperimentCard(exp)).join('');
    }

    generateExperimentCard(experiment) {
        // Calculate multi-user statistics
        const stats = this.calculateExperimentStats(experiment);
        const statusText = {
            'active': 'Active',
            'pending': 'Pending Users',
            'not-started': 'Not Started'
        };

        const status = stats.uniqueUsers > 0 ? 'active' : 'not-started';
        const statusClass = `status-${status}`;

        return `
            <div class="experiment-card">
                <div class="experiment-header">
                    <div class="experiment-name">${experiment.name}</div>
                    <div class="experiment-status ${statusClass}">${statusText[status]}</div>
                </div>
                
                <div class="experiment-details">
                    <strong>Comparison:</strong> ${experiment.folderA} vs ${experiment.folderB}<br>
                    <strong>Description:</strong> ${experiment.description || 'No description'}<br>
                    <strong>Created:</strong> ${new Date(experiment.createdAt).toLocaleString()}
                </div>

                <div class="experiment-stats">
                    <div class="stat-item">
                        <span class="stat-value">${experiment.pairs.length}</span>
                        <span class="stat-label">Video Pairs</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.uniqueUsers}</span>
                        <span class="stat-label">Users</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.totalRounds}</span>
                        <span class="stat-label">Total Rounds</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${stats.totalRatings}</span>
                        <span class="stat-label">Total Ratings</span>
                    </div>
                </div>

                <div class="experiment-actions">
                    ${this.generateActionButtons(experiment, status, stats)}
                    <button class="action-btn delete-btn" onclick="experimentManager.showDeleteModal('${experiment.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    calculateExperimentStats(experiment) {
        const userSessions = experiment.userSessions || {};
        const uniqueUsers = Object.keys(userSessions).length;
        
        let totalRounds = 0;
        let totalRatings = 0;
        let completedRounds = 0;
        
        // Count ratings from user sessions
        Object.values(userSessions).forEach(userSession => {
            totalRounds += userSession.rounds.length;
            userSession.rounds.forEach(round => {
                totalRatings += round.results.length;
                if (round.completed) {
                    completedRounds++;
                }
            });
        });
        
        // Also count direct results array if it exists
        if (experiment.results && Array.isArray(experiment.results)) {
            totalRatings += experiment.results.length;
            console.log('Added', experiment.results.length, 'results from experiment.results array');
        }
        
        console.log('Experiment stats calculation:', {
            experimentId: experiment.id,
            uniqueUsers,
            totalRounds,
            totalRatings,
            completedRounds,
            hasDirectResults: !!(experiment.results && experiment.results.length > 0),
            hasUserSessions: Object.keys(userSessions).length > 0
        });
        
        return {
            uniqueUsers,
            totalRounds,
            totalRatings,
            completedRounds,
            avgRatingsPerUser: uniqueUsers > 0 ? Math.round(totalRatings / uniqueUsers) : 0
        };
    }

    generateActionButtons(experiment, status, stats) {
        const buttons = [];
        
        // Always show "Join Test" button for new users or new rounds
        buttons.push(`<button class="action-btn start-btn" onclick="experimentManager.startExperiment('${experiment.id}')">Join Test</button>`);
        
        // Show results if there are any ratings OR if experiment has user sessions (temporary fix)
        console.log('Button check for', experiment.name, '- totalRatings:', stats.totalRatings, 'uniqueUsers:', stats.uniqueUsers);
        if (stats.totalRatings > 0 || stats.uniqueUsers > 0) {
            console.log('Adding View Results button for', experiment.name);
            buttons.push(`<button class="action-btn view-btn" onclick="experimentManager.viewResults('${experiment.id}')">View Results</button>`);
        } else {
            console.log('Not adding View Results button for', experiment.name);
        }
        
        return buttons.join('');
    }

    startExperiment(id) {
        this.showUserSelectionModal(id);
    }

    showUserSelectionModal(experimentId) {
        console.log('=== showUserSelectionModal START ===');
        console.log('experimentId:', experimentId);
        
        const experiment = this.experiments.find(exp => exp.id === experimentId);
        if (!experiment) {
            console.error('Experiment not found:', experimentId);
            return;
        }
        
        // Remove any existing modal first
        const existingModal = document.getElementById('userSelectionModal');
        if (existingModal) {
            existingModal.remove();
            console.log('Removed existing modal');
        }
        
        // Find the next available user ID
        const usedUserIds = Object.keys(experiment.userSessions || {});
        let suggestedUserId = '';
        for (let i = 1; i <= 10; i++) {
            const userId = `user${i}`;
            if (!usedUserIds.includes(userId)) {
                suggestedUserId = userId;
                break;
            }
        }
        console.log('Suggested user ID:', suggestedUserId);
        
        // Create modal with inline event handlers for maximum compatibility
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'userSelectionModal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Join Experiment: ${experiment.name}</h3>
                <div class="user-selection">
                    <label for="modalUserId">User ID (1-10):</label>
                    <select id="modalUserId" required onchange="window.updateUserStatsHandler('${experimentId}', this.value)">
                        <option value="">Select User ID</option>
                        ${Array.from({length: 10}, (_, i) => {
                            const userId = `user${i+1}`;
                            const isUsed = usedUserIds.includes(userId);
                            const selected = userId === suggestedUserId ? 'selected' : '';
                            return `<option value="${userId}" ${selected}>${userId}${isUsed ? ' (Used)' : ''}</option>`;
                        }).join('')}
                    </select>
                </div>
                <div class="user-stats" id="modalUserStats" style="display: none;">
                    <h4>Your Previous Sessions:</h4>
                    <div id="modalUserPreviousSessions"></div>
                </div>
                <div class="modal-actions">
                    <button onclick="window.startUserRoundHandler('${experimentId}')" class="action-btn start-btn">Start New Round</button>
                    <button onclick="window.cancelModalHandler()" class="action-btn">Cancel</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        console.log('Modal added to DOM');
        
        // Set up global event handlers
        window.startUserRoundHandler = (expId) => {
            console.log('=== Start button clicked ===');
            const userId = document.getElementById('modalUserId').value;
            console.log('Selected user ID:', userId);
            
            if (!userId) {
                alert('Please select a user ID');
                return;
            }
            
            try {
                console.log('Calling startUserRound...');
                this.startUserRound(expId, userId);
                const modal = document.getElementById('userSelectionModal');
                if (modal) {
                    modal.remove();
                    console.log('Modal removed');
                }
            } catch (error) {
                console.error('Error in startUserRound:', error);
                alert('Error starting round: ' + error.message);
            }
        };
        
        window.cancelModalHandler = () => {
            console.log('=== Cancel button clicked ===');
            const modal = document.getElementById('userSelectionModal');
            if (modal) {
                modal.remove();
                console.log('Modal cancelled and removed');
            }
        };
        
        window.updateUserStatsHandler = (expId, userId) => {
            console.log('=== User selection changed ===', userId);
            this.updateModalUserStats(expId, userId);
        };
        
        // Auto-select suggested user and show stats
        if (suggestedUserId) {
            console.log('Auto-selecting user:', suggestedUserId);
            this.updateModalUserStats(experimentId, suggestedUserId);
        }
        
        // Add click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                console.log('Clicked outside modal, closing');
                modal.remove();
            }
        });
        
        console.log('=== Modal setup complete ===');
    }

    updateModalUserStats(experimentId, userId) {
        const experiment = this.experiments.find(exp => exp.id === experimentId);
        const userStats = document.getElementById('modalUserStats');
        const userPreviousSessions = document.getElementById('modalUserPreviousSessions');
        
        if (!userId || !userStats || !userPreviousSessions) {
            if (userStats) userStats.style.display = 'none';
            return;
        }
        
        const userSession = experiment.userSessions[userId];
        if (userSession && userSession.rounds.length > 0) {
            userStats.style.display = 'block';
            userPreviousSessions.innerHTML = userSession.rounds.map((round, index) => `
                <div class="session-summary">
                    <strong>Round ${index + 1}:</strong> 
                    ${round.results.length}/${experiment.pairs.length} ratings 
                    (${round.completed ? 'Completed' : 'In Progress'})
                    <small> - ${new Date(round.startTime).toLocaleString()}</small>
                </div>
            `).join('');
        } else {
            userStats.style.display = 'block';
            userPreviousSessions.innerHTML = '<p>No previous sessions for this user.</p>';
        }
    }

    startUserRound(experimentId, userId) {
        console.log('=== startUserRound ===', experimentId, userId);
        
        // Basic validation
        if (!experimentId || !userId) {
            throw new Error('Missing experiment ID or user ID');
        }
        
        const experiment = this.experiments.find(exp => exp.id === experimentId);
        if (!experiment) {
            throw new Error('Experiment not found');
        }
        
        if (!experiment.pairs || experiment.pairs.length === 0) {
            throw new Error('No video pairs found');
        }
        
        console.log('Validation passed, creating round...');
        
        // Initialize user session
        if (!experiment.userSessions) experiment.userSessions = {};
        if (!experiment.userSessions[userId]) experiment.userSessions[userId] = { rounds: [] };
        
        // Create new round
        const roundId = `round_${Date.now()}`;
        const newRound = {
            roundId: roundId,
            startTime: new Date().toISOString(),
            completed: false,
            results: []
        };
        
        experiment.userSessions[userId].rounds.push(newRound);
        experiment.lastModified = new Date().toISOString();
        
        console.log('Round created:', roundId);
        
        // Save and redirect
        this.saveExperiments();
        localStorage.setItem('currentExperimentId', experimentId);
        localStorage.setItem('currentUserId', userId);
        localStorage.setItem('currentRoundId', roundId);
        
        console.log('Redirecting to evaluation...');
        window.location.href = 'index.html';
    }

    restartExperiment(id) {
        const experiment = this.experiments.find(exp => exp.id === id);
        if (experiment) {
            experiment.results = [];
            experiment.status = 'not-started';
            experiment.lastModified = new Date().toISOString();
            this.saveExperiments();
            this.renderExperiments();
            this.updateStatistics();
            this.showMessage('Experiment has been reset', 'info');
        }
    }

    viewResults(id) {
        this.setCurrentExperiment(id);
        window.location.href = 'index.html?showResults=true';
    }

    setCurrentExperiment(id) {
        localStorage.setItem('currentExperimentId', id);
    }

    showDeleteModal(id) {
        console.log('=== 显示删除模态框 ===');
        console.log('要删除的实验ID:', id);
        
        this.deleteTargetId = id;
        const modal = document.getElementById('deleteModal');
        
        if (modal) {
            modal.style.display = 'flex';
            console.log('删除模态框已显示');
        } else {
            console.error('错误：找不到删除模态框元素');
        }
    }

    hideDeleteModal() {
        this.deleteTargetId = null;
        document.getElementById('deleteModal').style.display = 'none';
    }

    async confirmDelete() {
        console.log('=== 开始删除实验 ===');
        console.log('deleteTargetId:', this.deleteTargetId);
        console.log('当前实验数量:', this.experiments.length);
        
        if (this.deleteTargetId) {
            const experimentToDelete = this.experiments.find(exp => exp.id === this.deleteTargetId);
            const experimentName = experimentToDelete ? experimentToDelete.name : '未知实验';
            
            console.log('要删除的实验:', experimentToDelete);
            console.log('实验名称:', experimentName);
            
            // 显示删除进度
            this.showMessage(`正在删除实验: ${experimentName}...`, 'info');
            
            try {
                // 保存删除前的数量
                const beforeCount = this.experiments.length;
                console.log('删除前实验数量:', beforeCount);
                
                // 从数组中移除实验
                this.experiments = this.experiments.filter(exp => exp.id !== this.deleteTargetId);
                
                console.log('删除后实验数量:', this.experiments.length);
                console.log('实验删除成功，开始保存...');
                
                // 保存到 GitHub 和本地存储
                await this.saveExperiments();
                
                console.log('保存完成，更新界面...');
                
                // 更新界面
                this.renderExperiments();
                this.updateStatistics();
                this.hideDeleteModal();
                
                // 显示成功消息
                this.showMessage(`实验 "${experimentName}" 已成功删除 ✅`, 'success');
                console.log('删除操作完成');
                
            } catch (error) {
                console.error('删除实验时出错:', error);
                
                // 恢复实验（回滚操作）
                if (experimentToDelete) {
                    console.log('正在回滚删除操作...');
                    this.experiments.push(experimentToDelete);
                    this.renderExperiments();
                    this.updateStatistics();
                }
                
                this.showMessage(`删除实验失败: ${error.message}`, 'error');
            }
        } else {
            console.log('错误：没有指定要删除的实验ID');
            this.showMessage('删除失败：没有选择要删除的实验', 'error');
        }
        
        console.log('=== 删除实验结束 ===');
    }

    clearAllData() {
        if (confirm('⚠️ Warning!\n\nThis will delete all experiment data and user session records. This action cannot be undone.\n\nAre you sure you want to clear all data?')) {
            // Clear all localStorage keys related to the application
            localStorage.removeItem('sbs_experiments');
            localStorage.removeItem('currentUserId');
            localStorage.removeItem('currentRoundId');
            localStorage.removeItem('currentExperimentId');
            localStorage.removeItem('experimentMode');
            localStorage.removeItem('ratings');
            localStorage.removeItem('videoPairs');
            localStorage.removeItem('currentPairIndex');
            
            // Clear sessionStorage as well
            sessionStorage.clear();
            
            // Reset class data
            this.experiments = [];
            this.currentPairs = [];
            
            // Update UI
            this.renderExperiments();
            this.updateStatistics();
            this.resetForm();
            
            // Show success message
            this.showMessage('All data cleared! Page will refresh...', 'success');
            
            // Refresh page after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    }

    updateStatistics() {
        const total = this.experiments.length;
        
        let totalUsers = 0;
        let totalRounds = 0;
        let totalRatings = 0;
        let activeExperiments = 0;
        
        this.experiments.forEach(exp => {
            const stats = this.calculateExperimentStats(exp);
            totalUsers += stats.uniqueUsers;
            totalRounds += stats.totalRounds;
            totalRatings += stats.totalRatings;
            if (stats.uniqueUsers > 0) {
                activeExperiments++;
            }
        });

        document.getElementById('totalExperiments').textContent = total;
        document.getElementById('completedExperiments').textContent = activeExperiments;
        document.getElementById('totalRatings').textContent = totalRatings;
        document.getElementById('avgCompletion').textContent = `${totalUsers} Users`;
    }

    async loadExperiments() {
        // 仅从 GitHub 加载数据，不使用本地存储
        console.log('🌐 仅从GitHub加载数据，忽略本地存储...');
        await this.loadExperimentsFromGitHub();
        this.renderExperiments();
        this.updateStatistics();
    }

    async saveExperiments() {
        // 仅保存到 GitHub，本地存储作为缓存
        console.log('💾 仅保存到GitHub...');
        const success = await this.saveExperimentsToGitHub();
        if (success) {
            // 成功保存到GitHub后，更新本地缓存
            this.saveExperimentsToLocal();
        }
        return success;
    }

    // GitHub API 相关方法
    async loadExperimentsFromGitHub() {
        try {
            console.log('Loading experiments from GitHub...');
            
            // 首先尝试从 GitHub 加载数据
            const response = await fetch(`https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/contents/${this.githubConfig.dataFile}`, {
                headers: this.githubConfig.token ? {
                    'Authorization': `token ${this.githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                } : {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const content = JSON.parse(atob(data.content));
                
                // 仅使用GitHub数据
                this.experiments = content.experiments || [];
                this.githubConfig.sha = data.sha;  // 保存 SHA 用于更新
                
                console.log('✅ 成功从GitHub加载数据:', this.experiments.length, '个实验');
                console.log('📅 GitHub数据最后更新:', content.lastUpdated);
                
                // 更新本地存储为GitHub数据的副本
                this.saveExperimentsToLocal();
                
                return true;
            } else if (response.status === 404) {
                console.log('Experiments file not found on GitHub, will create new one');
                this.experiments = [];
                return true;
            } else {
                throw new Error(`GitHub API error: ${response.status}`);
            }
        } catch (error) {
            console.error('Failed to load from GitHub:', error);
            // 不使用本地数据，保持空数组
            this.experiments = [];
            console.log('❌ GitHub加载失败，使用空数据列表');
            return false;
        }
    }

    async saveExperimentsToGitHub() {
        if (!this.githubConfig.token) {
            console.warn('No GitHub token provided, falling back to local storage');
            this.saveExperimentsToLocal();
            return false;
        }

        try {
            console.log('Saving experiments to GitHub...');
            console.log('Number of experiments to save:', this.experiments.length);
            
            const content = {
                experiments: this.experiments,
                lastUpdated: new Date().toISOString(),
                totalExperiments: this.experiments.length
            };

            const encodedContent = btoa(JSON.stringify(content, null, 2));

            const requestBody = {
                message: `Update experiments data - ${new Date().toISOString()}`,
                content: encodedContent
            };

            // 如果文件已存在，需要提供 SHA
            if (this.githubConfig.sha) {
                requestBody.sha = this.githubConfig.sha;
                console.log('Updating existing file with SHA:', this.githubConfig.sha);
            } else {
                console.log('Creating new file');
            }

            const response = await fetch(`https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/contents/${this.githubConfig.dataFile}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            console.log('GitHub API response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                this.githubConfig.sha = result.content.sha;
                console.log('Successfully saved experiments to GitHub');
                console.log('New SHA:', this.githubConfig.sha);
                this.showMessage('Experiments saved to GitHub successfully! 🎉', 'success');
                return true;
            } else {
                const errorText = await response.text();
                console.error('GitHub API error response:', errorText);
                throw new Error(`GitHub API error: ${response.status} - ${errorText}`);
            }
        } catch (error) {
            console.error('Failed to save to GitHub:', error);
            this.showMessage(`Failed to save to GitHub: ${error.message}`, 'error');
            this.saveExperimentsToLocal();
            return false;
        }
    }

    // 本地存储方法（作为备份）
    loadExperimentsFromLocal() {
        try {
            const saved = localStorage.getItem('sbs_experiments');
            this.experiments = saved ? JSON.parse(saved) : [];
            console.log('Loaded experiments from local storage:', this.experiments.length);
        } catch (error) {
            console.error('Error loading from local storage:', error);
            this.experiments = [];
        }
    }

    saveExperimentsToLocal() {
        try {
            localStorage.setItem('sbs_experiments', JSON.stringify(this.experiments));
            console.log('Saved experiments to local storage');
        } catch (error) {
            console.error('Error saving to local storage:', error);
        }
    }

    showMessage(text, type = 'info') {
        const messageContainer = document.getElementById('messageContainer') || this.createMessageContainer();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        
        messageContainer.appendChild(messageDiv);
        messageContainer.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
                if (messageContainer.children.length === 0) {
                    messageContainer.style.display = 'none';
                }
            }, 300);
        }, 3000);
    }

    createMessageContainer() {
        const container = document.createElement('div');
        container.id = 'messageContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
        `;
        document.body.appendChild(container);
        return container;
    }

    // GitHub Settings Methods
    showGithubSettings() {
        const modal = document.getElementById('githubModal');
        const tokenInput = document.getElementById('githubToken');
        
        // Load saved token if exists
        const savedToken = localStorage.getItem('github_token');
        if (savedToken) {
            tokenInput.value = savedToken;
            this.githubConfig.token = savedToken;
        }
        
        this.updateSyncStatus();
        modal.style.display = 'flex';
    }

    hideGithubSettings() {
        document.getElementById('githubModal').style.display = 'none';
    }

    updateSyncStatus() {
        const statusElement = document.getElementById('syncStatus');
        const dot = statusElement.querySelector('.status-dot');
        const text = statusElement.querySelector('span:last-child');
        
        if (this.githubConfig.token) {
            dot.className = 'status-dot online';
            text.textContent = 'Connected to GitHub (data will sync automatically)';
        } else {
            dot.className = 'status-dot offline';
            text.textContent = 'Not connected to GitHub (using local storage only)';
        }
    }

    async testGithubConnection() {
        const tokenInput = document.getElementById('githubToken');
        const token = tokenInput.value.trim();
        
        if (!token) {
            this.showMessage('Please enter a GitHub token first', 'error');
            return;
        }

        const statusElement = document.getElementById('syncStatus');
        const dot = statusElement.querySelector('.status-dot');
        const text = statusElement.querySelector('span:last-child');
        
        // Show testing status
        dot.className = 'status-dot testing';
        text.textContent = 'Testing connection...';

        try {
            const response = await fetch(`https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.ok) {
                dot.className = 'status-dot online';
                text.textContent = 'Connection successful! ✅';
                this.showMessage('GitHub connection test passed!', 'success');
                return true;
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('GitHub connection test failed:', error);
            dot.className = 'status-dot offline';
            text.textContent = `Connection failed: ${error.message}`;
            this.showMessage('GitHub connection test failed. Check your token.', 'error');
            return false;
        }
    }

    async saveGithubSettings() {
        const tokenInput = document.getElementById('githubToken');
        const token = tokenInput.value.trim();
        
        if (!token) {
            this.showMessage('Please enter a GitHub token', 'error');
            return;
        }

        // Test connection first
        const connectionSuccess = await this.testGithubConnection();
        if (!connectionSuccess) {
            return;
        }

        // Save token
        this.githubConfig.token = token;
        localStorage.setItem('github_token', token);
        
        // Try to load existing data from GitHub
        await this.loadExperimentsFromGitHub();
        this.renderExperiments();
        this.updateStatistics();
        
        this.hideGithubSettings();
        this.showMessage('GitHub sync enabled! Data will now be shared across all users.', 'success');
    }

    async forceSyncNow() {
        const tokenInput = document.getElementById('githubToken');
        const token = tokenInput.value.trim();
        
        if (!token) {
            this.showMessage('Please enter a GitHub token first', 'error');
            return;
        }

        // Update token
        this.githubConfig.token = token;
        localStorage.setItem('github_token', token);

        try {
            this.showMessage('🔄 Starting force sync...', 'info');
            
            console.log('=== FORCE SYNC DEBUG INFO ===');
            console.log('Current experiments count:', this.experiments.length);
            console.log('GitHub config:', {
                owner: this.githubConfig.owner,
                repo: this.githubConfig.repo,
                dataFile: this.githubConfig.dataFile,
                hasToken: !!this.githubConfig.token
            });

            // First try to load from GitHub to get the latest SHA
            console.log('Step 1: Loading existing data from GitHub...');
            await this.loadExperimentsFromGitHub();
            
            // Then save current data
            console.log('Step 2: Saving current data to GitHub...');
            const saveSuccess = await this.saveExperimentsToGitHub();
            
            if (saveSuccess) {
                this.showMessage('✅ Force sync completed successfully!', 'success');
                this.renderExperiments();
                this.updateStatistics();
            } else {
                this.showMessage('❌ Force sync failed. Check console for details.', 'error');
            }

            console.log('=== FORCE SYNC COMPLETED ===');
            
        } catch (error) {
            console.error('Force sync error:', error);
            this.showMessage(`❌ Force sync failed: ${error.message}`, 'error');
        }
    }

    // Initialize GitHub settings on load
    initGithubSettings() {
        const savedToken = localStorage.getItem('github_token');
        if (savedToken) {
            this.githubConfig.token = savedToken;
            console.log('GitHub token loaded from localStorage:', savedToken.substring(0, 10) + '...');
        } else {
            console.warn('No GitHub token found in localStorage');
        }
    }
}

// Initialize experiment manager
const experimentManager = new ExperimentManager();
// 暴露到window对象供auto-config.js访问
window.experimentManager = experimentManager;

document.addEventListener('DOMContentLoaded', () => {
    experimentManager.init();
}); 
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
    }

    init() {
        this.loadExperiments();
        this.bindEvents();
        this.updateStatistics();
        this.renderExperiments();
    }

    bindEvents() {
        // Folder selection events
        document.getElementById('folderA').addEventListener('change', () => this.updateFolderInfo());
        document.getElementById('folderB').addEventListener('change', () => this.updateFolderInfo());

        // Create experiment button
        document.getElementById('createExperiment').addEventListener('click', () => this.createExperiment());

        // Modal events
        document.getElementById('confirmDelete').addEventListener('click', () => this.confirmDelete());
        document.getElementById('cancelDelete').addEventListener('click', () => this.hideDeleteModal());

        // Form validation
        document.getElementById('experimentName').addEventListener('input', () => this.validateForm());
        document.getElementById('experimentDescription').addEventListener('input', () => this.validateForm());
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
        document.getElementById('createExperiment').disabled = !isValid;
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
            results: [],
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
        const completionRate = experiment.pairs.length > 0 ? 
            Math.round((experiment.results.length / experiment.pairs.length) * 100) : 0;
        
        const status = completionRate === 100 ? 'completed' : 
                      completionRate > 0 ? 'in-progress' : 'not-started';
        
        const statusText = {
            'completed': 'Completed',
            'in-progress': 'In Progress',
            'not-started': 'Not Started'
        };

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
                        <span class="stat-label">Total Pairs</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${experiment.results.length}</span>
                        <span class="stat-label">Rated</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${completionRate}%</span>
                        <span class="stat-label">Progress</span>
                    </div>
                </div>

                <div class="experiment-actions">
                    ${this.generateActionButtons(experiment, status)}
                    <button class="action-btn delete-btn" onclick="experimentManager.showDeleteModal('${experiment.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    generateActionButtons(experiment, status) {
        switch (status) {
            case 'not-started':
                return `<button class="action-btn start-btn" onclick="experimentManager.startExperiment('${experiment.id}')">Start Test</button>`;
            case 'in-progress':
                return `<button class="action-btn continue-btn" onclick="experimentManager.continueExperiment('${experiment.id}')">Continue Test</button>`;
            case 'completed':
                return `
                    <button class="action-btn view-btn" onclick="experimentManager.viewResults('${experiment.id}')">View Results</button>
                    <button class="action-btn start-btn" onclick="experimentManager.restartExperiment('${experiment.id}')">Restart Test</button>
                `;
            default:
                return '';
        }
    }

    startExperiment(id) {
        this.setCurrentExperiment(id);
        window.location.href = 'index.html';
    }

    continueExperiment(id) {
        this.setCurrentExperiment(id);
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
        this.deleteTargetId = id;
        document.getElementById('deleteModal').style.display = 'flex';
    }

    hideDeleteModal() {
        this.deleteTargetId = null;
        document.getElementById('deleteModal').style.display = 'none';
    }

    confirmDelete() {
        if (this.deleteTargetId) {
            this.experiments = this.experiments.filter(exp => exp.id !== this.deleteTargetId);
            this.saveExperiments();
            this.renderExperiments();
            this.updateStatistics();
            this.hideDeleteModal();
            this.showMessage('Experiment deleted', 'info');
        }
    }

    updateStatistics() {
        const total = this.experiments.length;
        const completed = this.experiments.filter(exp => {
            const completionRate = exp.pairs.length > 0 ? 
                Math.round((exp.results.length / exp.pairs.length) * 100) : 0;
            return completionRate === 100;
        }).length;
        
        const totalRatings = this.experiments.reduce((sum, exp) => sum + exp.results.length, 0);
        const avgCompletion = total > 0 ? 
            Math.round(this.experiments.reduce((sum, exp) => {
                const rate = exp.pairs.length > 0 ? (exp.results.length / exp.pairs.length) * 100 : 0;
                return sum + rate;
            }, 0) / total) : 0;

        document.getElementById('totalExperiments').textContent = total;
        document.getElementById('completedExperiments').textContent = completed;
        document.getElementById('totalRatings').textContent = totalRatings;
        document.getElementById('avgCompletion').textContent = `${avgCompletion}%`;
    }

    loadExperiments() {
        const saved = localStorage.getItem('pikaExperiments');
        if (saved) {
            try {
                this.experiments = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading experiments:', e);
                this.experiments = [];
            }
        }
    }

    saveExperiments() {
        localStorage.setItem('pikaExperiments', JSON.stringify(this.experiments));
    }

    showMessage(text, type = 'info') {
        // Simple message notification
        const existingMessage = document.querySelector('.temp-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const message = document.createElement('div');
        message.className = `temp-message ${type}`;
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

// Initialize experiment manager
const experimentManager = new ExperimentManager();
document.addEventListener('DOMContentLoaded', () => {
    experimentManager.init();
}); 
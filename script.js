class VideoComparison {
    constructor() {
        this.videoPairs = [];
        this.currentPairIndex = 0;
        this.ratings = [];
        this.currentRating = null;
        this.currentExperiment = null;
        this.experimentMode = false;
        this.currentUserId = null;
        this.currentRoundId = null;
        this.currentRound = null;
        this.init();
    }

    async init() {
        this.showLoading(true);
        
        try {
            // Wait for auto-config to complete
            await this.waitForTokenConfiguration();
            
            // Check if there's a current experiment
            await this.checkExperimentMode();
            
            // Check if should directly show results
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('showResults') === 'true' && this.currentExperiment) {
                // Load video pairs first to ensure we have the data structure
                await this.loadVideoPairs();
                this.showResults();
                this.showLoading(false);
                return;
            }
            
            await this.loadVideoPairs();
            this.showLoading(false);
            
            if (this.videoPairs.length > 0) {
                this.loadCurrentPair();
                this.updateUI();
                this.bindEvents();
            } else {
                this.showMessage('No matching video pairs found', 'error');
            }
        } catch (error) {
            console.error('Initialization error:', error);
            this.showMessage('An error occurred while loading. Please refresh the page.', 'error');
            this.showLoading(false);
        }
    }

    async waitForTokenConfiguration() {
        // Wait for auto-config.js to complete
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max
        
        while (attempts < maxAttempts) {
            if (localStorage.getItem('github_token')) {
                console.log('GitHub token configured successfully');
                return;
            }
            
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        console.warn('GitHub token configuration timed out');
    }

    async loadVideoPairs() {
        try {
            if (this.experimentMode && this.currentExperiment) {
                // Experiment mode: use experiment configured pairs
                this.videoPairs = this.currentExperiment.pairs.map(pair => {
                    // Randomly decide left/right positions
                    const randomize = Math.random() < 0.5;
                    return {
                        baseName: pair.baseName,
                        leftVideo: {
                            path: randomize ? `${this.currentExperiment.folderA}/${pair.fileA}` : `${this.currentExperiment.folderB}/${pair.fileB}`,
                            version: randomize ? this.currentExperiment.folderA : this.currentExperiment.folderB,
                            originalFileName: randomize ? pair.fileA : pair.fileB
                        },
                        rightVideo: {
                            path: randomize ? `${this.currentExperiment.folderB}/${pair.fileB}` : `${this.currentExperiment.folderA}/${pair.fileA}`,
                            version: randomize ? this.currentExperiment.folderB : this.currentExperiment.folderA,
                            originalFileName: randomize ? pair.fileB : pair.fileA
                        }
                    };
                });
                
                // Load existing rating results for current round
                this.ratings = new Array(this.videoPairs.length).fill(null);
                if (this.currentRound && this.currentRound.results) {
                    this.currentRound.results.forEach(result => {
                        if (result.pairIndex < this.ratings.length) {
                            this.ratings[result.pairIndex] = result.rating;
                        }
                    });
                }
                
                // Find first unrated position
                const nextIndex = this.ratings.findIndex(rating => rating === null);
                this.currentPairIndex = nextIndex >= 0 ? nextIndex : 0;
                
                console.log(`Experiment mode loaded: ${this.videoPairs.length} pairs`);
            } else {
                // Default mode: Pika 2.2 vs Pika 2.5
                const pika25Files = await this.getVideoFiles('Pika2.5/');
                const pika22Files = await this.getVideoFiles('Pika2.2/');
                this.matchVideoPairs(pika25Files, pika22Files);
            }
            
        } catch (error) {
            console.error('Error loading video files:', error);
            this.showMessage('Error loading video files', 'error');
        }
    }

    async getVideoFiles(folder) {
        // Due to browser security restrictions, we cannot directly read the file system
        // Here we need to manually define the file list or use a backend API
        const files = {
            'Pika2.5/': [
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
            'Pika2.2/': [
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
            'Pika 2.2 DMD/': [
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
        
        return files[folder] || [];
    }

    matchVideoPairs(pika25Files, pika22Files) {
        const pairs = [];
        
        // Extract main part of filename (remove seed and extension)
        const getBaseName = (filename) => {
            // First decode URL-encoded characters (like %20)
            let decoded = decodeURIComponent(filename);
            
            // Remove various possible suffixes: seed part, parentheses numbers, share etc.
            let baseName = decoded
                .replace(/_seed\d+.*$/, '')  // Remove everything from seed onwards
                .replace(/\s*\(\d+\).*$/, '')  // Remove parentheses and numbers
                .replace(/_share.*$/, '')  // Remove share part
                .replace(/\.mp4$/, '')  // Remove file extension
                .trim();
            
            return baseName;
        };

        pika25Files.forEach(file25 => {
            const baseName25 = getBaseName(file25);
            
            // Find corresponding file in Pika 2.2
            const matchingFile22 = pika22Files.find(file22 => {
                const baseName22 = getBaseName(file22);
                return baseName25 === baseName22;
            });

            if (matchingFile22) {
                const baseName22 = getBaseName(matchingFile22);
                
                // Debug info: ensure pairing is correct
                console.log(`Pairing successful:`);
                console.log(`  Pika 2.5: ${file25} → baseName: "${baseName25}"`);
                console.log(`  Pika 2.2: ${matchingFile22} → baseName: "${baseName22}"`);
                console.log(`  Pairing correct: ${baseName25 === baseName22}`);
                
                // Randomly decide left/right positions
                const randomize = Math.random() < 0.5;
                
                pairs.push({
                    baseName: baseName25 || 'Untitled',
                    leftVideo: {
                        path: randomize ? `Pika2.5/${file25}` : `Pika2.2/${matchingFile22}`,
                        version: randomize ? 'Pika 2.5' : 'Pika 2.2',
                        originalFileName: randomize ? file25 : matchingFile22
                    },
                    rightVideo: {
                        path: randomize ? `Pika2.2/${matchingFile22}` : `Pika2.5/${file25}`,
                        version: randomize ? 'Pika 2.2' : 'Pika 2.5',
                        originalFileName: randomize ? matchingFile22 : file25
                    }
                });
            } else {
                console.log(`No pairing found - Pika 2.5: ${file25} → baseName: "${baseName25}"`);
            }
        });

        this.videoPairs = pairs;
        this.ratings = new Array(pairs.length).fill(null);
        
        console.log(`Found ${pairs.length} matched video pairs`);
    }

    loadCurrentPair() {
        if (this.currentPairIndex >= this.videoPairs.length) return;
        
        const pair = this.videoPairs[this.currentPairIndex];
        const leftVideo = document.getElementById('leftVideo');
        const rightVideo = document.getElementById('rightVideo');
        const leftLabel = document.getElementById('leftLabel');
        const rightLabel = document.getElementById('rightLabel');
        const promptText = document.getElementById('promptText');

        // 构建视频源URL - 支持本地和在线环境
        const getVideoSrc = (path) => {
            // 检查是否为在线环境 (Vercel)
            if (window.location.hostname.includes('vercel.app') || window.location.hostname.includes('github.io')) {
                // 在线环境：使用GitHub raw文件URL
                return `https://github.com/WellyXY/side_by_side/raw/main/${encodeURIComponent(path)}`;
            } else {
                // 本地环境：直接使用相对路径
                return path;
            }
        };
        
        leftVideo.src = getVideoSrc(pair.leftVideo.path);
        rightVideo.src = getVideoSrc(pair.rightVideo.path);
        
        // Display prompt information (convert filename to readable prompt)
        promptText.textContent = this.formatPrompt(pair.baseName);
        
        // Debug info: display current pairing in console
        console.log(`Current pairing #${this.currentPairIndex + 1}:`);
        console.log(`  Left: ${pair.leftVideo.version} - ${pair.leftVideo.originalFileName}`);
        console.log(`  Right: ${pair.rightVideo.version} - ${pair.rightVideo.originalFileName}`);
        console.log(`  Base name: "${pair.baseName}"`);
        console.log('---');
        
        // Hide version info before evaluation is complete
        leftLabel.textContent = 'Version A';
        rightLabel.textContent = 'Version B';
        
        // Reset current rating
        this.currentRating = this.ratings[this.currentPairIndex];
        this.updateRatingButtons();
        
        // Ensure videos auto-play
        setTimeout(() => {
            leftVideo.play().catch(e => console.log('Auto-play prevented:', e));
            rightVideo.play().catch(e => console.log('Auto-play prevented:', e));
        }, 100);
    }

    updateRatingButtons() {
        const buttons = document.querySelectorAll('.rating-btn');
        buttons.forEach(btn => {
            btn.classList.remove('selected');
            if (this.currentRating !== null && 
                parseInt(btn.dataset.score) === this.currentRating) {
                btn.classList.add('selected');
            }
        });
    }

    updateUI() {
        // Update progress bar
        const progress = document.getElementById('progress');
        const progressText = document.getElementById('progressText');
        const ratedCount = this.ratings.filter(r => r !== null).length;
        const totalCount = this.videoPairs.length;
        
        const percentage = totalCount > 0 ? (ratedCount / totalCount) * 100 : 0;
        progress.style.width = `${percentage}%`;
        progressText.textContent = `${ratedCount} / ${totalCount}`;
        
        // Update statistics
        document.getElementById('ratedCount').textContent = ratedCount;
        document.getElementById('totalCount').textContent = totalCount;
        
        // Update navigation buttons
        document.getElementById('prevBtn').disabled = this.currentPairIndex === 0;
        document.getElementById('nextBtn').disabled = this.currentPairIndex >= this.videoPairs.length - 1;
    }

    bindEvents() {
        // Rating button events
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const score = parseInt(e.target.dataset.score);
                this.setRating(score);
            });
        });

        // Navigation button events
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousPair();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextPair();
        });

        // Export button events
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportResults();
        });
        
        // Restart button events
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case '1': this.setRating(2); break;  // >> Right significantly better
                case '2': this.setRating(1); break;  // > Right slightly better
                case '3': this.setRating(0); break;  // = Same quality
                case '4': this.setRating(-1); break; // < Left slightly better
                case '5': this.setRating(-2); break; // << Left significantly better
                case 'ArrowLeft': this.previousPair(); break;
                case 'ArrowRight': this.nextPair(); break;
            }
        });
    }

    async setRating(score) {
        console.log('=== setRating ===', 'pair:', this.currentPairIndex + 1, 'score:', score);
        
        this.currentRating = score;
        this.ratings[this.currentPairIndex] = score;
        this.updateRatingButtons();
        this.updateUI();
        
        // If in experiment mode, save result to experiment
        if (this.experimentMode && this.currentExperiment) {
            try {
                await this.saveExperimentResult(score);
            } catch (error) {
                console.error('Error saving experiment result:', error);
                this.showMessage('Error saving results, but rating recorded', 'warning');
            }
        }
        
        // Show version information
        const pair = this.videoPairs[this.currentPairIndex];
        document.getElementById('leftLabel').textContent = pair.leftVideo.version;
        document.getElementById('rightLabel').textContent = pair.rightVideo.version;
        
        // Check if all evaluations are complete
        const allRated = this.ratings.every(r => r !== null);
        console.log('Rating status:', `${this.ratings.filter(r => r !== null).length}/${this.ratings.length}`, 'All rated:', allRated);
        
        // Auto jump to next pair (delay 0.8 seconds)
        setTimeout(() => {
            try {
                if (this.currentPairIndex < this.videoPairs.length - 1) {
                    console.log('Moving to next pair...');
                    this.nextPair();
                } else if (allRated) {
                    console.log('All pairs rated, showing results...');
                    this.showResults();
                } else {
                    console.log('Evaluation complete but not all pairs rated');
                    this.showMessage('All video evaluations completed!', 'success');
                }
            } catch (error) {
                console.error('Error in auto navigation:', error);
                this.showMessage('Error navigating to next question, please click next manually', 'error');
            }
        }, 800);
    }

    previousPair() {
        if (this.currentPairIndex > 0) {
            this.currentPairIndex--;
            this.loadCurrentPair();
            this.updateUI();
        }
    }

    nextPair() {
        console.log('=== nextPair ===', 'current:', this.currentPairIndex + 1, 'total:', this.videoPairs.length);
        
        if (this.currentPairIndex < this.videoPairs.length - 1) {
            this.currentPairIndex++;
            console.log('Moving to pair:', this.currentPairIndex + 1);
            
            try {
                this.loadCurrentPair();
                this.updateUI();
                console.log('Successfully loaded pair:', this.currentPairIndex + 1);
            } catch (error) {
                console.error('Error loading next pair:', error);
                this.showMessage('Error loading next question', 'error');
                // Revert to previous pair if loading fails
                this.currentPairIndex--;
            }
        } else {
            console.log('Already at last pair, cannot move forward');
        }
    }

    exportResults() {
        const results = {
            timestamp: new Date().toISOString(),
            totalPairs: this.videoPairs.length,
            ratedPairs: this.ratings.filter(r => r !== null).length,
            results: this.videoPairs.map((pair, index) => ({
                pairIndex: index + 1,
                baseName: pair.baseName,
                leftVideo: pair.leftVideo,
                rightVideo: pair.rightVideo,
                rating: this.ratings[index],
                ratingDescription: this.getRatingDescription(this.ratings[index])
            }))
        };

        // Calculate statistics
        const validRatings = this.ratings.filter(r => r !== null);
        if (validRatings.length > 0) {
            results.statistics = {
                averageRating: validRatings.reduce((a, b) => a + b, 0) / validRatings.length,
                pika25WinCount: validRatings.filter(r => r < 0).length,
                pika22WinCount: validRatings.filter(r => r > 0).length,
                tieCount: validRatings.filter(r => r === 0).length
            };
        }

        // Download JSON file
        const dataStr = JSON.stringify(results, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `pika_comparison_results_${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        this.showMessage('Evaluation results exported!', 'success');
    }

    formatPrompt(baseName) {
        if (!baseName || baseName === 'Untitled' || baseName.trim() === '') {
            return 'Untitled video generation';
        }
        
        // Handle special case: if baseName is just underscores
        if (baseName.startsWith('_') && baseName.replace(/_/g, '').trim() === '') {
            return 'General video generation';
        }
        
        // Replace underscores with spaces and handle special characters
        let formatted = baseName
            .replace(/_/g, ' ')
            .replace(/,_/g, ', ')
            .replace(/\._/g, '. ')
            .replace(/\s+/g, ' ')
            .trim();
            
        // If processed result is empty, return default value
        if (!formatted) {
            return 'General video generation';
        }
        
        return formatted;
    }

    getRatingDescription(rating) {
        switch(rating) {
            case -2: return 'Left much better';
            case -1: return 'Left slightly better';
            case 0: return 'Equal quality';
            case 1: return 'Right slightly better';
            case 2: return 'Right much better';
            default: return 'Not rated';
        }
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const videoComparison = document.getElementById('videoComparison');
        
        if (show) {
            loading.classList.add('show');
            videoComparison.style.display = 'none';
        } else {
            loading.classList.remove('show');
            videoComparison.style.display = 'flex';
        }
    }

    showMessage(text, type = 'info') {
        const message = document.getElementById('message');
        message.textContent = text;
        message.className = `message show ${type}`;
        
        setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    }

    showResults() {
        // Hide evaluation interface
        document.getElementById('videoComparison').style.display = 'none';
        document.querySelector('.rating-controls').style.display = 'none';
        document.querySelector('.controls').style.display = 'none';
        document.querySelector('.progress-bar').style.display = 'none';
        document.querySelector('.prompt-section').style.display = 'none';
        
        // Show results interface
        const resultsSummary = document.getElementById('resultsSummary');
        resultsSummary.style.display = 'block';
        
        // Calculate statistics from ALL user results or current ratings
        let validRatings = [];
        let userStats = {};
        
        console.log('=== RESULTS DEBUG ===');
        console.log('Current experiment:', this.currentExperiment);
        console.log('Current ratings:', this.ratings);
        
        if (this.currentExperiment) {
            console.log('Experiment results:', this.currentExperiment.results);
            console.log('Experiment user sessions:', this.currentExperiment.userSessions);
            
            // Try to get results from multiple sources
            let allResults = [];
            
            // 1. Direct results array
            if (this.currentExperiment.results && this.currentExperiment.results.length > 0) {
                allResults = [...this.currentExperiment.results];
                console.log('Found results in experiment.results:', allResults.length);
            }
            
            // 2. User sessions results
            if (this.currentExperiment.userSessions) {
                Object.values(this.currentExperiment.userSessions).forEach(userSession => {
                    if (userSession.rounds) {
                        userSession.rounds.forEach(round => {
                            if (round.results) {
                                allResults = allResults.concat(round.results);
                            }
                        });
                    }
                });
                console.log('Total results after checking user sessions:', allResults.length);
            }
            
            // 3. Current session ratings as fallback
            if (allResults.length === 0 && this.ratings) {
                console.log('No experiment results found, using current ratings');
                this.ratings.forEach((rating, index) => {
                    if (rating !== null) {
                        allResults.push({
                            userId: this.currentUserId || 'current',
                            roundId: this.currentRoundId || 'current',
                            pairIndex: index,
                            rating: rating,
                            timestamp: new Date().toISOString()
                        });
                    }
                });
            }
            
            // Filter valid ratings
            validRatings = allResults.map(r => r.rating).filter(r => r !== null && r !== undefined);
            console.log('Valid ratings found:', validRatings.length, validRatings);
            
            // Calculate per-user statistics
            allResults.forEach(result => {
                if (result.rating !== null && result.rating !== undefined) {
                    const userId = result.userId || 'unknown';
                    if (!userStats[userId]) {
                        userStats[userId] = { ratings: [], rounds: new Set() };
                    }
                    userStats[userId].ratings.push(result.rating);
                    userStats[userId].rounds.add(result.roundId || 'unknown');
                }
            });
        } else {
            // Use current ratings
            validRatings = this.ratings.filter(r => r !== null);
            console.log('No experiment mode, using current ratings:', validRatings.length);
        }
        
        console.log('Final valid ratings:', validRatings.length);
        console.log('User stats:', userStats);
        
        // Calculate wins based on the specific comparison
        let leftWins, rightWins, ties;
        
        if (this.currentExperiment) {
            // For experiments, calculate based on actual folder comparison
            leftWins = validRatings.filter(r => r < 0).length;  // Negative ratings mean left side wins
            rightWins = validRatings.filter(r => r > 0).length; // Positive ratings mean right side wins
            ties = validRatings.filter(r => r === 0).length;
            
            // Update labels based on experiment folders
            document.querySelector('#resultsSummary .stat-card:nth-child(2) h3').textContent = `${this.currentExperiment.folderA} Wins`;
            document.querySelector('#resultsSummary .stat-card:nth-child(3) h3').textContent = `${this.currentExperiment.folderB} Wins`;
        } else {
            // Default Pika 2.5 vs Pika 2.2 comparison
            leftWins = validRatings.filter(r => r < 0).length;
            rightWins = validRatings.filter(r => r > 0).length;
            ties = validRatings.filter(r => r === 0).length;
            
            // Keep default labels
            document.querySelector('#resultsSummary .stat-card:nth-child(2) h3').textContent = 'Pika 2.5 Wins';
            document.querySelector('#resultsSummary .stat-card:nth-child(3) h3').textContent = 'Pika 2.2 Wins';
        }
        
        // Show multi-user statistics if available
        if (Object.keys(userStats).length > 0) {
            this.displayMultiUserStats(userStats);
        }
        
        // Update statistics cards
        document.getElementById('totalEvaluations').textContent = validRatings.length;
        document.getElementById('pika25Wins').textContent = leftWins;
        document.getElementById('pika22Wins').textContent = rightWins;
        document.getElementById('ties').textContent = ties;
        
        // Draw pie chart
        this.drawPieChart(leftWins, rightWins, ties);
    }
    
    drawPieChart(pika25Wins, pika22Wins, ties) {
        const canvas = document.getElementById('resultsChart');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const total = pika25Wins + pika22Wins + ties;
        if (total === 0) return;
        
        // Determine labels based on current experiment
        let leftLabel, rightLabel;
        if (this.currentExperiment) {
            leftLabel = `${this.currentExperiment.folderA} Wins`;
            rightLabel = `${this.currentExperiment.folderB} Wins`;
        } else {
            leftLabel = 'Pika 2.5 Wins';
            rightLabel = 'Pika 2.2 Wins';
        }
        
        const data = [
            { label: leftLabel, value: pika25Wins, color: '#28a745' },
            { label: rightLabel, value: pika22Wins, color: '#007bff' },
            { label: 'Ties', value: ties, color: '#6c757d' }
        ];
        
        let currentAngle = -Math.PI / 2; // Start from top
        
        // Draw pie chart segments
        data.forEach(segment => {
            if (segment.value > 0) {
                const sliceAngle = (segment.value / total) * 2 * Math.PI;
                
                // Draw segment
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                ctx.closePath();
                ctx.fillStyle = segment.color;
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 3;
                ctx.stroke();
                
                // Draw labels
                const labelAngle = currentAngle + sliceAngle / 2;
                const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
                const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
                
                ctx.fillStyle = '#495057';
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(segment.label, labelX, labelY);
                ctx.fillText(`${segment.value} (${((segment.value / total) * 100).toFixed(1)}%)`, labelX, labelY + 20);
                
                currentAngle += sliceAngle;
            }
        });
        
        // Draw title
        ctx.fillStyle = '#495057';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Evaluation Results', centerX, 30);
    }

    displayMultiUserStats(userStats) {
        const multiUserOverview = document.getElementById('multiUserOverview');
        const userStatsGrid = document.getElementById('userStatsGrid');
        
        // Show the multi-user overview section
        multiUserOverview.style.display = 'block';
        
        // Clear existing content
        userStatsGrid.innerHTML = '';
        
        // Create statistics for each user
        Object.entries(userStats).forEach(([userId, stats]) => {
            const leftWins = stats.ratings.filter(r => r < 0).length;
            const rightWins = stats.ratings.filter(r => r > 0).length;
            const ties = stats.ratings.filter(r => r === 0).length;
            const totalRatings = stats.ratings.length;
            const roundsCount = stats.rounds.size;
            
            const userCard = document.createElement('div');
            userCard.className = 'user-stat-card';
            userCard.innerHTML = `
                <h4>${userId}</h4>
                <div class="user-stat-item">
                    <span class="user-stat-label">Rounds:</span>
                    <span class="user-stat-value">${roundsCount}</span>
                </div>
                <div class="user-stat-item">
                    <span class="user-stat-label">Total Ratings:</span>
                    <span class="user-stat-value">${totalRatings}</span>
                </div>
                <div class="user-stat-item">
                    <span class="user-stat-label">Left Wins:</span>
                    <span class="user-stat-value">${leftWins}</span>
                </div>
                <div class="user-stat-item">
                    <span class="user-stat-label">Right Wins:</span>
                    <span class="user-stat-value">${rightWins}</span>
                </div>
                <div class="user-stat-item">
                    <span class="user-stat-label">Ties:</span>
                    <span class="user-stat-value">${ties}</span>
                </div>
            `;
            
            userStatsGrid.appendChild(userCard);
        });
        
        // Add summary card
        const totalUsers = Object.keys(userStats).length;
        const totalRounds = Object.values(userStats).reduce((sum, stats) => sum + stats.rounds.size, 0);
        const avgRatingsPerUser = Math.round(Object.values(userStats).reduce((sum, stats) => sum + stats.ratings.length, 0) / totalUsers);
        
        const summaryCard = document.createElement('div');
        summaryCard.className = 'user-stat-card';
        summaryCard.style.borderLeft = '4px solid #28a745';
        summaryCard.innerHTML = `
            <h4>Overall Summary</h4>
            <div class="user-stat-item">
                <span class="user-stat-label">Total Users:</span>
                <span class="user-stat-value">${totalUsers}</span>
            </div>
            <div class="user-stat-item">
                <span class="user-stat-label">Total Rounds:</span>
                <span class="user-stat-value">${totalRounds}</span>
            </div>
            <div class="user-stat-item">
                <span class="user-stat-label">Avg Ratings/User:</span>
                <span class="user-stat-value">${avgRatingsPerUser}</span>
            </div>
        `;
        
        userStatsGrid.appendChild(summaryCard);
    }
    
    restart() {
        // Reset all data
        this.currentPairIndex = 0;
        this.ratings = new Array(this.videoPairs.length).fill(null);
        this.currentRating = null;
        
        // If in experiment mode, reset experiment results
        if (this.experimentMode && this.currentExperiment) {
            this.currentExperiment.results = [];
            this.saveCurrentExperiment();
        }
        
        // Hide results interface
        document.getElementById('resultsSummary').style.display = 'none';
        
        // Show evaluation interface
        document.getElementById('videoComparison').style.display = 'flex';
        document.querySelector('.rating-controls').style.display = 'flex';
        document.querySelector('.controls').style.display = 'flex';
        document.querySelector('.progress-bar').style.display = 'flex';
        document.querySelector('.prompt-section').style.display = 'block';
        
        // Reload first pair
        this.loadCurrentPair();
        this.updateUI();
    }

    async checkExperimentMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const experimentIdFromStorage = localStorage.getItem('currentExperimentId');

        if (urlParams.get('showResults') === 'true' && experimentIdFromStorage) {
            // ... (existing showResults logic)
        } else if (experimentIdFromStorage) {
            await this.waitForTokenConfiguration();
            const data = await this.loadExperimentsFromGitHub();
            console.log('Loaded fresh experiment data from GitHub');
            this.currentExperiment = data.experiments.find(exp => exp.id === experimentIdFromStorage);
            
            if (this.currentExperiment) {
                this.experimentMode = true;
                this.currentUserId = localStorage.getItem('currentUserId');
                this.currentRoundId = localStorage.getItem('currentRoundId');
                
                console.log('=== checkExperimentMode DEBUG ===');
                console.log('Stored userId:', this.currentUserId);
                console.log('Stored roundId:', this.currentRoundId);
                
                if (!this.currentExperiment.userSessions) {
                    this.currentExperiment.userSessions = {};
                }
                console.log('Available user sessions:', Object.keys(this.currentExperiment.userSessions));

                if (this.currentUserId && this.currentRoundId) {
                    let userSession = this.currentExperiment.userSessions[this.currentUserId];
                    
                    // If user session doesn't exist, create it (robustness fix)
                    if (!userSession) {
                        console.log(`User session for '${this.currentUserId}' not found. Creating it now.`);
                        userSession = { rounds: [] };
                        this.currentExperiment.userSessions[this.currentUserId] = userSession;
                    }
                    console.log('Found user session:', !!userSession);

                    this.currentRound = userSession.rounds.find(round => round.roundId === this.currentRoundId);
                    console.log('Found round:', !!this.currentRound);
                    
                    // If round not found, create it (data sync fix)
                    if (!this.currentRound) {
                        console.log(`Round '${this.currentRoundId}' not found. Creating it now.`);
                        this.currentRound = {
                            roundId: this.currentRoundId,
                            startTime: new Date().toISOString(),
                            completed: false,
                            results: []
                        };
                        userSession.rounds.push(this.currentRound);
                        // Save to GitHub immediately since we've altered the structure
                        this.saveCurrentExperiment().catch(error => {
                            console.error('Error saving newly created user/round structure:', error);
                        });
                    }
                } else {
                    console.log('Missing userId or roundId in localStorage. Cannot determine current round.');
                    this.currentRound = null;
                }
                
                this.updateExperimentUI();
                console.log('Experiment mode activated:', this.currentExperiment.name, 'User:', this.currentUserId, 'Round:', this.currentRoundId);
                console.log('Current round object:', this.currentRound);
            }
        }
    }

    updateExperimentUI() {
        if (this.currentExperiment) {
            const experimentNameElement = document.getElementById('currentExperimentName');
            if (experimentNameElement) {
                const userInfo = this.currentUserId ? ` | User: ${this.currentUserId}` : '';
                const roundInfo = this.currentRound ? ` | Round: ${this.currentRound.rounds?.length || 1}` : '';
                experimentNameElement.textContent = `Current Experiment: ${this.currentExperiment.name}${userInfo}${roundInfo}`;
            }
        }
    }

    async saveExperimentResult(score) {
        console.log('=== saveExperimentResult START ===');
        console.log('Current experiment:', this.currentExperiment?.name);
        console.log('Current round:', this.currentRound?.roundId);
        console.log('Current user:', this.currentUserId);
        
        if (!this.currentExperiment || !this.currentRound) {
            console.error('saveExperimentResult: Missing experiment or round data');
            console.error('currentExperiment:', this.currentExperiment);
            console.error('currentRound:', this.currentRound);
            return;
        }
        
        console.log('Saving result for pair:', this.currentPairIndex, 'score:', score);
        
        const pair = this.videoPairs[this.currentPairIndex];
        const result = {
            userId: this.currentUserId,
            roundId: this.currentRoundId,
            pairIndex: this.currentPairIndex,
            baseName: pair.baseName,
            leftVideo: pair.leftVideo,
            rightVideo: pair.rightVideo,
            rating: score,
            timestamp: new Date().toISOString()
        };
        
        // Save to current round
        if (!this.currentRound.results) {
            this.currentRound.results = [];
        }
        
        // Check if result already exists in current round, update if so, otherwise add
        const existingIndex = this.currentRound.results.findIndex(
            r => r.pairIndex === this.currentPairIndex
        );
        
        if (existingIndex >= 0) {
            this.currentRound.results[existingIndex] = result;
            console.log('Updated existing result for pair', this.currentPairIndex);
        } else {
            this.currentRound.results.push(result);
            console.log('Added new result for pair', this.currentPairIndex);
        }
        
        // Save to global results for aggregation (avoid duplicates)
        if (!this.currentExperiment.results) {
            this.currentExperiment.results = [];
        }
        
        // Remove any existing global result for this user/round/pair combination to avoid duplicates
        this.currentExperiment.results = this.currentExperiment.results.filter(
            r => !(r.userId === this.currentUserId && 
                   r.roundId === this.currentRoundId && 
                   r.pairIndex === this.currentPairIndex)
        );
        
        // Add the new result
        this.currentExperiment.results.push(result);
        
        // Check if round is completed
        if (this.currentRound.results.length === this.videoPairs.length) {
            this.currentRound.completed = true;
            this.currentRound.completedAt = new Date().toISOString();
            console.log('Round completed!');
            
            // 轮次完成时触发云端同步
            if (window.cloudSyncManager) {
                console.log('🔄 Triggering cloud sync after round completion');
                setTimeout(() => {
                    window.cloudSyncManager.syncToCloud().catch(error => {
                        console.warn('Cloud sync failed:', error);
                    });
                }, 1000); // 延迟1秒，确保本地存储先完成
            }
        }
        
        this.currentExperiment.lastModified = new Date().toISOString();
        
        try {
            console.log('About to save experiment with results:', this.currentExperiment.results.length);
            await this.saveCurrentExperiment();
            console.log('Experiment saved successfully');
        } catch (error) {
            console.error('Error saving experiment:', error);
            console.error('Error details:', error);
            this.showMessage('Error saving results, please try again', 'error');
        }
        
        console.log('=== saveExperimentResult END ===');
    }

    async saveCurrentExperiment() {
        if (!this.currentExperiment) return;
        
        console.log("==> saveCurrentExperiment: Saving current experiment data...");
        try {
            // 使用本地存储模式来保持与 experiment-manager 的一致性
            const localStorageKey = 'sbs_experiments';
            const existingData = localStorage.getItem(localStorageKey);
            let experiments = [];
            
            if (existingData) {
                try {
                    experiments = JSON.parse(existingData);
                } catch (error) {
                    console.error('解析本地存储数据失败:', error);
                    experiments = [];
                }
            }
            
            // 查找并更新当前实验
            const index = experiments.findIndex(exp => exp.id === this.currentExperiment.id);
            if (index >= 0) {
                experiments[index] = this.currentExperiment;
                console.log("==> saveCurrentExperiment: Updated existing experiment");
            } else {
                experiments.push(this.currentExperiment);
                console.log("==> saveCurrentExperiment: Added new experiment");
            }
            
            // 保存到本地存储
            localStorage.setItem(localStorageKey, JSON.stringify(experiments));
            console.log("==> saveCurrentExperiment: Successfully saved to localStorage");
            
        } catch (error) {
            console.error('Error in saveCurrentExperiment:', error);
        }
    }

    async loadExperimentsFromGitHub() {
        const data = await window.githubDataManager.loadData();
        return data ? data.content : { experiments: [] };
    }
}

// Initialize application
let videoComparison;
document.addEventListener('DOMContentLoaded', () => {
    videoComparison = new VideoComparison();
}); 
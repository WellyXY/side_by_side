class VideoComparison {
    constructor() {
        this.videoPairs = [];
        this.currentPairIndex = 0;
        this.ratings = [];
        this.currentRating = null;
        this.currentExperiment = null;
        this.experimentMode = false;
        this.init();
    }

    async init() {
        this.showLoading(true);
        
        // 檢查是否有當前實驗
        this.checkExperimentMode();
        
        // 檢查是否直接顯示結果
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('showResults') === 'true' && this.currentExperiment) {
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
    }

    async loadVideoPairs() {
        try {
            if (this.experimentMode && this.currentExperiment) {
                // 實驗模式：使用實驗配置的配對
                this.videoPairs = this.currentExperiment.pairs.map(pair => {
                    // 隨機決定左右位置
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
                
                // 加載已有的評分結果
                this.ratings = new Array(this.videoPairs.length).fill(null);
                this.currentExperiment.results.forEach(result => {
                    if (result.pairIndex < this.ratings.length) {
                        this.ratings[result.pairIndex] = result.rating;
                    }
                });
                
                // 找到第一個未評分的位置
                const nextIndex = this.ratings.findIndex(rating => rating === null);
                this.currentPairIndex = nextIndex >= 0 ? nextIndex : 0;
                
                console.log(`實驗模式加載完成: ${this.videoPairs.length} 個配對`);
            } else {
                // 默認模式：Pika 2.2 vs Pika 2.5
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
        // 由於瀏覽器安全限制，我們無法直接讀取檔案系統
        // 這裡我們需要手動定義檔案列表，或者使用後端API
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
        
        // 提取檔案名稱的主要部分（去掉seed和副檔名）
        const getBaseName = (filename) => {
            // 先解碼URL編碼的字符（如%20）
            let decoded = decodeURIComponent(filename);
            
            // 去掉各種可能的後綴：seed部分、括號數字、share等
            let baseName = decoded
                .replace(/_seed\d+.*$/, '')  // 去掉從seed開始的所有內容
                .replace(/\s*\(\d+\).*$/, '')  // 去掉括號和數字
                .replace(/_share.*$/, '')  // 去掉share部分
                .replace(/\.mp4$/, '')  // 去掉副檔名
                .trim();
            
            return baseName;
        };

        pika25Files.forEach(file25 => {
            const baseName25 = getBaseName(file25);
            
            // 在 Pika 2.2 中尋找對應的檔案
            const matchingFile22 = pika22Files.find(file22 => {
                const baseName22 = getBaseName(file22);
                return baseName25 === baseName22;
            });

            if (matchingFile22) {
                const baseName22 = getBaseName(matchingFile22);
                
                // 調試信息：確保配對正確
                console.log(`配對成功:`);
                console.log(`  Pika 2.5: ${file25} → baseName: "${baseName25}"`);
                console.log(`  Pika 2.2: ${matchingFile22} → baseName: "${baseName22}"`);
                console.log(`  配對正確: ${baseName25 === baseName22}`);
                
                // 隨機決定左右位置
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
                console.log(`未找到配對 - Pika 2.5: ${file25} → baseName: "${baseName25}"`);
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

        leftVideo.src = pair.leftVideo.path;
        rightVideo.src = pair.rightVideo.path;
        
        // 顯示prompt信息（檔案名稱轉換為可讀的提示詞）
        promptText.textContent = this.formatPrompt(pair.baseName);
        
        // 調試信息：在控制台顯示當前配對
        console.log(`當前配對 #${this.currentPairIndex + 1}:`);
        console.log(`  左側: ${pair.leftVideo.version} - ${pair.leftVideo.originalFileName}`);
        console.log(`  右側: ${pair.rightVideo.version} - ${pair.rightVideo.originalFileName}`);
        console.log(`  基準名稱: "${pair.baseName}"`);
        console.log('---');
        
        // 在評測完成前隱藏版本資訊
        leftLabel.textContent = 'Version A';
        rightLabel.textContent = 'Version B';
        
        // 重設當前評分
        this.currentRating = this.ratings[this.currentPairIndex];
        this.updateRatingButtons();
        
        // 確保視頻自動播放
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
        // 更新進度條
        const progress = document.getElementById('progress');
        const progressText = document.getElementById('progressText');
        const ratedCount = this.ratings.filter(r => r !== null).length;
        const totalCount = this.videoPairs.length;
        
        const percentage = totalCount > 0 ? (ratedCount / totalCount) * 100 : 0;
        progress.style.width = `${percentage}%`;
        progressText.textContent = `${ratedCount} / ${totalCount}`;
        
        // 更新統計
        document.getElementById('ratedCount').textContent = ratedCount;
        document.getElementById('totalCount').textContent = totalCount;
        
        // 更新導航按鈕
        document.getElementById('prevBtn').disabled = this.currentPairIndex === 0;
        document.getElementById('nextBtn').disabled = this.currentPairIndex >= this.videoPairs.length - 1;
    }

    bindEvents() {
        // 評分按鈕事件
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const score = parseInt(e.target.dataset.score);
                this.setRating(score);
            });
        });

        // 導航按鈕事件
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousPair();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextPair();
        });

        // 匯出按鈕事件
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportResults();
        });
        
        // 重新開始按鈕事件
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.restart();
        });

        // 鍵盤快捷鍵
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case '1': this.setRating(2); break;  // >> 右側明顯更好
                case '2': this.setRating(1); break;  // > 右側稍微更好
                case '3': this.setRating(0); break;  // = 相同品質
                case '4': this.setRating(-1); break; // < 左側稍微更好
                case '5': this.setRating(-2); break; // << 左側明顯更好
                case 'ArrowLeft': this.previousPair(); break;
                case 'ArrowRight': this.nextPair(); break;
            }
        });
    }

    setRating(score) {
        this.currentRating = score;
        this.ratings[this.currentPairIndex] = score;
        this.updateRatingButtons();
        this.updateUI();
        
        // 如果是實驗模式，保存結果到實驗
        if (this.experimentMode && this.currentExperiment) {
            this.saveExperimentResult(score);
        }
        
        // 顯示版本資訊
        const pair = this.videoPairs[this.currentPairIndex];
        document.getElementById('leftLabel').textContent = pair.leftVideo.version;
        document.getElementById('rightLabel').textContent = pair.rightVideo.version;
        
        // 檢查是否所有評測都完成
        const allRated = this.ratings.every(r => r !== null);
        
        // 自動跳到下一組（延遲0.8秒）
        setTimeout(() => {
            if (this.currentPairIndex < this.videoPairs.length - 1) {
                this.nextPair();
            } else if (allRated) {
                this.showResults();
            } else {
                this.showMessage('All video evaluations completed!', 'success');
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
        if (this.currentPairIndex < this.videoPairs.length - 1) {
            this.currentPairIndex++;
            this.loadCurrentPair();
            this.updateUI();
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

        // 計算統計資訊
        const validRatings = this.ratings.filter(r => r !== null);
        if (validRatings.length > 0) {
            results.statistics = {
                averageRating: validRatings.reduce((a, b) => a + b, 0) / validRatings.length,
                pika25WinCount: validRatings.filter(r => r < 0).length,
                pika22WinCount: validRatings.filter(r => r > 0).length,
                tieCount: validRatings.filter(r => r === 0).length
            };
        }

        // 下載JSON檔案
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
        
        // 處理特殊情況：如果baseName只是下劃線開頭的話
        if (baseName.startsWith('_') && baseName.replace(/_/g, '').trim() === '') {
            return 'General video generation';
        }
        
        // 將下劃線替換為空格，並處理特殊字符
        let formatted = baseName
            .replace(/_/g, ' ')
            .replace(/,_/g, ', ')
            .replace(/\._/g, '. ')
            .replace(/\s+/g, ' ')
            .trim();
            
        // 如果處理後是空的，返回默認值
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
        // 隱藏評測界面
        document.getElementById('videoComparison').style.display = 'none';
        document.querySelector('.rating-controls').style.display = 'none';
        document.querySelector('.controls').style.display = 'none';
        document.querySelector('.progress-bar').style.display = 'none';
        document.querySelector('.prompt-section').style.display = 'none';
        
        // 顯示結果界面
        const resultsSummary = document.getElementById('resultsSummary');
        resultsSummary.style.display = 'block';
        
        // 計算統計資訊
        const validRatings = this.ratings.filter(r => r !== null);
        const pika25Wins = validRatings.filter(r => r < 0).length;
        const pika22Wins = validRatings.filter(r => r > 0).length;
        const ties = validRatings.filter(r => r === 0).length;
        
        // 更新統計卡片
        document.getElementById('totalEvaluations').textContent = validRatings.length;
        document.getElementById('pika25Wins').textContent = pika25Wins;
        document.getElementById('pika22Wins').textContent = pika22Wins;
        document.getElementById('ties').textContent = ties;
        
        // 繪製餅圖
        this.drawPieChart(pika25Wins, pika22Wins, ties);
    }
    
    drawPieChart(pika25Wins, pika22Wins, ties) {
        const canvas = document.getElementById('resultsChart');
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;
        
        // 清空畫布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const total = pika25Wins + pika22Wins + ties;
        if (total === 0) return;
        
        const data = [
            { label: 'Pika 2.5 Wins', value: pika25Wins, color: '#28a745' },
            { label: 'Pika 2.2 Wins', value: pika22Wins, color: '#007bff' },
            { label: 'Ties', value: ties, color: '#6c757d' }
        ];
        
        let currentAngle = -Math.PI / 2; // 從頂部開始
        
        // 繪製餅圖段落
        data.forEach(segment => {
            if (segment.value > 0) {
                const sliceAngle = (segment.value / total) * 2 * Math.PI;
                
                // 繪製段落
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
                ctx.closePath();
                ctx.fillStyle = segment.color;
                ctx.fill();
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 3;
                ctx.stroke();
                
                // 繪製標籤
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
        
        // 繪製標題
        ctx.fillStyle = '#495057';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Evaluation Results', centerX, 30);
    }
    
    restart() {
        // 重置所有數據
        this.currentPairIndex = 0;
        this.ratings = new Array(this.videoPairs.length).fill(null);
        this.currentRating = null;
        
        // 如果是實驗模式，重置實驗結果
        if (this.experimentMode && this.currentExperiment) {
            this.currentExperiment.results = [];
            this.saveCurrentExperiment();
        }
        
        // 隱藏結果界面
        document.getElementById('resultsSummary').style.display = 'none';
        
        // 顯示評測界面
        document.getElementById('videoComparison').style.display = 'flex';
        document.querySelector('.rating-controls').style.display = 'flex';
        document.querySelector('.controls').style.display = 'flex';
        document.querySelector('.progress-bar').style.display = 'flex';
        document.querySelector('.prompt-section').style.display = 'block';
        
        // 重新載入第一組
        this.loadCurrentPair();
        this.updateUI();
    }

    checkExperimentMode() {
        const experimentId = localStorage.getItem('currentExperimentId');
        if (experimentId) {
            const experiments = JSON.parse(localStorage.getItem('pikaExperiments') || '[]');
            this.currentExperiment = experiments.find(exp => exp.id === experimentId);
            
            if (this.currentExperiment) {
                this.experimentMode = true;
                this.updateExperimentUI();
                console.log('實驗模式啟動:', this.currentExperiment.name);
            }
        }
    }

    updateExperimentUI() {
        if (this.currentExperiment) {
            const experimentNameElement = document.getElementById('currentExperimentName');
            if (experimentNameElement) {
                experimentNameElement.textContent = `當前實驗: ${this.currentExperiment.name}`;
            }
        }
    }

    saveExperimentResult(score) {
        if (!this.currentExperiment) return;
        
        const pair = this.videoPairs[this.currentPairIndex];
        const result = {
            pairIndex: this.currentPairIndex,
            baseName: pair.baseName,
            leftVideo: pair.leftVideo,
            rightVideo: pair.rightVideo,
            rating: score,
            timestamp: new Date().toISOString()
        };
        
        // 檢查是否已有結果，如果有則更新，否則添加
        const existingIndex = this.currentExperiment.results.findIndex(
            r => r.pairIndex === this.currentPairIndex
        );
        
        if (existingIndex >= 0) {
            this.currentExperiment.results[existingIndex] = result;
        } else {
            this.currentExperiment.results.push(result);
        }
        
        this.currentExperiment.lastModified = new Date().toISOString();
        this.saveCurrentExperiment();
    }

    saveCurrentExperiment() {
        if (!this.currentExperiment) return;
        
        const experiments = JSON.parse(localStorage.getItem('pikaExperiments') || '[]');
        const index = experiments.findIndex(exp => exp.id === this.currentExperiment.id);
        
        if (index >= 0) {
            experiments[index] = this.currentExperiment;
            localStorage.setItem('pikaExperiments', JSON.stringify(experiments));
        }
    }
}

// 初始化應用程式
let videoComparison;
document.addEventListener('DOMContentLoaded', () => {
    videoComparison = new VideoComparison();
}); 
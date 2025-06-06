// 自动配置脚本
(function() {
    'use strict';
    
    // 检查是否需要自动配置GitHub token
    function checkAndSetupGitHub() {
        const currentToken = localStorage.getItem('github_token');
        
        if (!currentToken) {
            // 使用base64编码的token
            const encodedToken = 'Z2hwX2g3cjI5MHlVQUNRTUt1cmpMQlVvUkp3MWM1dldzRTI4MFE3UQ==';
            
            try {
                const decodedToken = atob(encodedToken);
                localStorage.setItem('github_token', decodedToken);
                console.log('🔐 GitHub自动配置完成，token已设置');
                
                // 通知所有管理器实例更新token
                updateManagerTokens(decodedToken);
                
            } catch (error) {
                console.warn('自动配置失败:', error);
            }
        } else {
            console.log('🔐 GitHub token已存在，无需配置');
            // 确保管理器实例有正确的token
            updateManagerTokens(currentToken);
        }
    }
    
    // 更新管理器实例的token
    function updateManagerTokens(token) {
        // 立即更新，然后定期重试确保更新成功
        function tryUpdate() {
            try {
                let updated = false;
                
                // 更新 ExperimentManager 实例
                if (window.experimentManager && window.experimentManager.githubConfig) {
                    window.experimentManager.githubConfig.token = token;
                    console.log('✅ ExperimentManager token 已更新');
                    
                    // 重新加载数据以确保同步
                    if (window.experimentManager.loadExperiments) {
                        window.experimentManager.loadExperiments().then(() => {
                            console.log('🔄 ExperimentManager 数据已重新加载');
                        }).catch(err => {
                            console.warn('重新加载数据失败:', err);
                        });
                    }
                    updated = true;
                }
                
                // 更新 CreateExperimentManager 实例
                if (window.createManager && window.createManager.githubConfig) {
                    window.createManager.githubConfig.token = token;
                    console.log('✅ CreateExperimentManager token 已更新');
                    
                    // 确保配置token
                    if (window.createManager.ensureTokenConfiguration) {
                        window.createManager.ensureTokenConfiguration();
                    }
                    updated = true;
                }
                
                return updated;
            } catch (error) {
                console.warn('更新管理器token失败:', error);
                return false;
            }
        }
        
        // 立即尝试更新
        if (!tryUpdate()) {
            // 延迟重试确保管理器实例已创建
            setTimeout(() => {
                if (!tryUpdate()) {
                    setTimeout(() => {
                        if (!tryUpdate()) {
                            setTimeout(tryUpdate, 1000);
                        }
                    }, 500);
                }
            }, 100);
        }
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndSetupGitHub);
    } else {
        checkAndSetupGitHub();
    }
    
    // 暴露更新函数供其他脚本使用
    window.updateManagerTokens = updateManagerTokens;
})(); 
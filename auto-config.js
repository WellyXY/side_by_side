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
                console.log('🔐 GitHub自动配置完成');
                
                // 触发页面重新加载以应用配置
                setTimeout(() => {
                    window.location.reload();
                }, 500);
                
            } catch (error) {
                console.warn('自动配置失败:', error);
            }
        }
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAndSetupGitHub);
    } else {
        checkAndSetupGitHub();
    }
})(); 
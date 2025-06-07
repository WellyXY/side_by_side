// 强制更新GitHub token脚本
(function() {
    'use strict';
    
    console.log('🔧 强制更新GitHub token...');
    
    // 清除旧token
    localStorage.removeItem('github_token');
    console.log('🗑️ 已清除旧token');
    
    // 设置新token (base64编码)
    const encodedToken = 'Z2hwX0tQUVlsZ3A5eWs3cWtIOHZ3OEI4OGh1MEU1dXIxNDBhd3kzcAo=';
    const newToken = atob(encodedToken).trim();
    localStorage.setItem('github_token', newToken);
    console.log('✅ 已设置新token:', newToken.substring(0, 10) + '...');
    
    // 强制更新所有管理器实例
    function forceUpdateManagers() {
        let updated = false;
        
        // 更新 ExperimentManager
        if (window.experimentManager && window.experimentManager.githubConfig) {
            window.experimentManager.githubConfig.token = newToken;
            console.log('✅ ExperimentManager token 强制更新');
            updated = true;
        }
        
        // 更新 CreateExperimentManager
        if (window.createManager && window.createManager.githubConfig) {
            window.createManager.githubConfig.token = newToken;
            console.log('✅ CreateExperimentManager token 强制更新');
            
            // 强制调用token配置方法
            if (window.createManager.ensureTokenConfiguration) {
                window.createManager.ensureTokenConfiguration();
            }
            updated = true;
        }
        
        return updated;
    }
    
    // 立即尝试更新
    if (!forceUpdateManagers()) {
        // 如果管理器还没创建，等待并重试
        setTimeout(() => {
            if (!forceUpdateManagers()) {
                setTimeout(forceUpdateManagers, 1000);
            }
        }, 500);
    }
    
    console.log('🎯 Token强制更新完成，请重试创建实验');
    console.log('📅 更新时间:', new Date().toLocaleString());
})(); 
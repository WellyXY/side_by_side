# SBS 本地部署指南

## 🎯 概述

本地部署方案解决了 GitHub Token 限制问题，让你可以直接访问本地视频文件，无需依赖 GitHub API。

## 🚀 快速开始

### 方法一：使用启动脚本（推荐）

```bash
# 在项目根目录运行
./start-sbs.sh

# 或指定其他端口
./start-sbs.sh 8081
```

### 方法二：手动启动

```bash
# 启动本地文件服务器
python3 start-local-server.py 8080

# 然后在浏览器访问
open http://localhost:8080
```

## 📱 访问地址

- **主页**: http://localhost:8080/
- **视频管理器**: http://localhost:8080/video-manager.html
- **实验管理器**: http://localhost:8080/experiment-manager.html
- **创建实验**: http://localhost:8080/create-experiment.html

## 🔧 配置说明

### 本地模式设置

在 `video-manager.js` 中：

```javascript
const CONFIG = {
    USE_LOCAL_FILES: true,    // 启用本地文件模式
    LOCAL_PATHS: {
        'Pika2.2': './Pika2.2/',
        'Pika2.5': './Pika2.5/', 
        'Pika 2.2 DMD': './Pika 2.2 DMD/'
    }
};
```

### 切换到 GitHub API 模式

如果需要使用 GitHub API（需要配置 Token）：

```javascript
const CONFIG = {
    USE_LOCAL_FILES: false,   // 禁用本地文件模式
    GITHUB_REPO: 'WellyXY/side_by_side'
};
```

## 📁 文件结构

```
SBS/
├── start-sbs.sh              # 启动脚本
├── start-local-server.py     # 本地服务器
├── index.html                # 主页
├── video-manager.html        # 视频管理器
├── experiment-manager.html   # 实验管理器
├── create-experiment.html    # 创建实验页面
├── Pika2.2/                  # 视频文件夹
├── Pika2.5/                  # 视频文件夹
└── Pika 2.2 DMD/            # 视频文件夹
```

## ✨ 特性

### 本地文件服务器特性

- ✅ **CORS 支持**: 允许跨域请求
- ✅ **JSON API**: 支持程序化访问文件列表
- ✅ **静态文件服务**: 直接访问视频文件
- ✅ **目录浏览**: 支持浏览器查看目录内容

### 自动降级机制

1. **优先使用本地文件**: 直接读取本地视频文件
2. **API 失败自动降级**: 如果 GitHub API 失败，自动切换到本地模式
3. **静态文件列表**: 如果无法动态读取，使用预定义文件列表

## 🛠️ 故障排除

### 端口被占用

```bash
# 检查端口占用
lsof -i :8080

# 使用其他端口
./start-sbs.sh 8081
```

### Python 未安装

```bash
# macOS
brew install python3

# 或使用系统自带的 Python
python3 --version
```

### 权限问题

```bash
# 给脚本添加执行权限
chmod +x start-sbs.sh start-local-server.py
```

### 文件无法访问

确保视频文件夹存在且有正确的权限：

```bash
ls -la Pika2.2/ Pika2.5/ "Pika 2.2 DMD/"
```

## 🎬 使用流程

1. **启动服务器**: `./start-sbs.sh`
2. **访问应用**: 打开 http://localhost:8080
3. **管理视频**: 在视频管理器中查看所有本地视频
4. **创建实验**: 使用本地视频创建对比实验
5. **查看结果**: 在实验管理器中查看和分析结果

## 🔄 与 GitHub 同步

本地修改后，仍然可以同步到 GitHub：

```bash
# 提交本地修改
git add .
git commit -m "更新本地配置"
git push origin main
```

## 💡 优势

- 🚫 **无需 GitHub Token**: 避免 API 限制和权限问题
- ⚡ **更快的加载速度**: 直接访问本地文件
- 🔒 **数据隐私**: 视频文件完全在本地
- 🛠️ **易于调试**: 可以直接修改文件并刷新页面 
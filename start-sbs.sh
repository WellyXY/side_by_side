#!/bin/bash

# SBS 本地开发环境启动脚本

echo "🚀 启动 SBS (Side by Side) 本地开发环境"
echo "========================================"

# 检查 Python 是否安装
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 Python3，请先安装 Python"
    exit 1
fi

# 检查是否在正确的目录
if [ ! -f "start-local-server.py" ]; then
    echo "❌ 错误: 请在 SBS 项目根目录运行此脚本"
    exit 1
fi

# 设置端口
PORT=${1:-8080}

echo "📁 当前目录: $(pwd)"
echo "🌐 服务端口: $PORT"
echo "📺 视频文件夹: Pika2.2, Pika2.5, Pika 2.2 DMD"
echo ""

# 检查端口是否被占用
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null; then
    echo "⚠️  警告: 端口 $PORT 已被占用"
    echo "请使用其他端口: ./start-sbs.sh 8081"
    exit 1
fi

echo "🎬 启动本地文件服务器..."
echo "📱 访问地址: http://localhost:$PORT"
echo "🎯 视频管理器: http://localhost:$PORT/video-manager.html"
echo "🔬 实验管理器: http://localhost:$PORT/experiment-manager.html"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "========================================"

# 启动服务器
python3 start-local-server.py $PORT 
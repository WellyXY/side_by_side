#!/usr/bin/env python3
"""
简单的本地文件服务器
支持 CORS 和目录浏览，用于 SBS 视频管理系统
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import unquote
import json

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加 CORS 头部
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_OPTIONS(self):
        # 处理预检请求
        self.send_response(200)
        self.end_headers()

    def list_directory(self, path):
        """返回目录内容的 JSON 格式（用于 API 调用）"""
        try:
            list_dir = os.listdir(path)
        except OSError:
            self.send_error(404, "目录不存在")
            return None
        
        # 检查是否是 API 请求（通过 Accept 头判断）
        if self.headers.get('Accept') == 'application/json':
            files = []
            for name in list_dir:
                if name.endswith('.mp4'):
                    fullname = os.path.join(path, name)
                    if os.path.isfile(fullname):
                        stat = os.stat(fullname)
                        files.append({
                            'name': name,
                            'size': stat.st_size,
                            'url': f'/{os.path.relpath(fullname, os.getcwd()).replace(os.sep, "/")}'
                        })
            
            # 返回 JSON 响应
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.end_headers()
            response = json.dumps(files, ensure_ascii=False)
            self.wfile.write(response.encode('utf-8'))
            return None
        else:
            # 返回标准 HTML 目录列表
            return super().list_directory(path)

def start_server(port=8080, directory=None):
    """启动本地服务器"""
    if directory:
        os.chdir(directory)
    
    print(f"启动本地文件服务器...")
    print(f"端口: {port}")
    print(f"目录: {os.getcwd()}")
    print(f"访问地址: http://localhost:{port}")
    print("\n支持的功能:")
    print("- 静态文件服务")
    print("- CORS 支持")
    print("- JSON API (添加 Accept: application/json 头)")
    print("\n按 Ctrl+C 停止服务器\n")
    
    with socketserver.TCPServer(("", port), CORSHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n服务器已停止")

if __name__ == "__main__":
    port = 8080
    directory = None
    
    # 解析命令行参数
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            directory = sys.argv[1]
            if len(sys.argv) > 2:
                try:
                    port = int(sys.argv[2])
                except ValueError:
                    pass
    
    start_server(port, directory) 
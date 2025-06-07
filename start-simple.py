#!/usr/bin/env python3
"""
简化版本地服务器 - 用于调试
"""

import http.server
import socketserver
import os

class SimpleHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == "__main__":
    port = 8080
    print(f"启动简化服务器 - 端口 {port}")
    print(f"目录: {os.getcwd()}")
    print(f"访问: http://localhost:{port}")
    
    try:
        with socketserver.TCPServer(("", port), SimpleHandler) as httpd:
            print("✅ 服务器启动成功")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
    except Exception as e:
        print(f"错误: {e}") 
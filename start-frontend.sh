#!/bin/bash
# 启动前端 Vite 开发服务器
cd "$(dirname "$0")/frontend"
echo "正在启动前端开发服务器..."
echo "访问地址: http://localhost:5174/"
npx vite --port 5174 --host

#!/bin/bash
echo "============================================"
echo "  中国历代皇室家族 — 一键重启脚本"
echo "============================================"

cd "$(dirname "$0")"

# 1. 停止旧的后端进程
echo "[1/4] 停止旧的后端进程..."
BACKEND_PID=$(lsof -ti:8088 2>/dev/null)
if [ -n "$BACKEND_PID" ]; then
  kill -9 "$BACKEND_PID" 2>/dev/null && echo "  ✔ 后端进程已停止 (PID: $BACKEND_PID)"
else
  echo "  ✔ 后端未在运行"
fi

# 2. 停止旧的前端进程
echo "[2/4] 停止旧的前端进程..."
FRONTEND_PID=$(lsof -ti:5174 2>/dev/null)
if [ -n "$FRONTEND_PID" ]; then
  kill -9 "$FRONTEND_PID" 2>/dev/null && echo "  ✔ 前端进程已停止"
else
  echo "  ✔ 前端未在运行"
fi

sleep 2

# 3. 启动后端
echo "[3/4] 启动后端 (端口8088)..."
cd backend
mvn spring-boot:run > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo "  ✔ 后端启动中 (PID: $BACKEND_PID)"

# 等待后端启动
echo "  等待后端就绪..."
for i in $(seq 1 30); do
  sleep 1
  if lsof -i :8088 > /dev/null 2>&1; then
    echo "  ✔ 后端已就绪 (约${i}秒)"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "  ⚠ 后端启动可能较慢，请稍后检查"
  fi
done

# 等待一会儿再启动前端
sleep 3

# 4. 启动前端
echo "[4/4] 启动前端 (端口5174)..."
cd ../frontend
npx vite --port 5174 --host > /tmp/frontend.log 2>&1 &
echo "  ✔ 前端启动中"
sleep 3

echo ""
echo "============================================"
echo "  ✅ 启动完成！"
echo "  前端: http://localhost:5174/"
echo "  后端: http://localhost:8088/"
echo "============================================"

#!/bin/bash
# ========================================
# 中国历代皇室家族 — 一键启动脚本
# 自动检测前后端运行状态，异常时自动重启
# ========================================

BACKEND_PORT=8088
FRONTEND_PORT=5174
BACKEND_DIR="/Users/gong/Documents/NEWONE/backend"
FRONTEND_DIR="/Users/gong/Documents/NEWONE/frontend"
BACKEND_API="http://localhost:8088/api/dynasties"
FRONTEND_URL="http://localhost:5174"
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'

ok()   { echo -e "  ${GREEN}✓${NC} $1"; }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; }
info() { echo -e "  ${CYAN}→${NC} $1"; }

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║    中国历代皇室家族 — 一键启动      ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# ========== 检测后端 ==========
echo "  ── 后端检测 ──"
BACKEND_OK=false
if lsof -i :$BACKEND_PORT -P -n 2>/dev/null | grep -q LISTEN; then
  HTTP_CODE=$(curl -s -o /tmp/_be_check.json -w "%{http_code}" "$BACKEND_API" 2>/dev/null)
  if [ "$HTTP_CODE" = "200" ]; then
    # Verify JSON is valid and has correct encoding
    FIRST_CHAR=$(head -c 3 /tmp/_be_check.json 2>/dev/null)
    if [ "$FIRST_CHAR" = "[{" ]; then
      ok "后端运行正常 (端口 $BACKEND_PORT)"
      BACKEND_OK=true
    else
      warn "后端 API 返回异常数据，准备重启"
    fi
  else
    warn "后端 HTTP 状态码: $HTTP_CODE，准备重启"
  fi
else
  warn "后端端口 $BACKEND_PORT 未监听"
fi

if [ "$BACKEND_OK" != "true" ]; then
  info "正在关闭旧的后端进程..."
  lsof -ti :$BACKEND_PORT 2>/dev/null | xargs kill -9 2>/dev/null
  sleep 2
  info "正在启动后端 (新终端窗口)..."
  osascript -e "tell application \"Terminal\" to do script \"cd $BACKEND_DIR && mvn spring-boot:run\"" 2>/dev/null
  info "等待后端就绪..."
  BE_READY=false
  for i in $(seq 1 36); do
    sleep 2
    if lsof -i :$BACKEND_PORT -P -n 2>/dev/null | grep -q LISTEN; then
      CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_API" 2>/dev/null)
      if [ "$CODE" = "200" ]; then
        ok "后端就绪 ($((i*2))秒)"
        BE_READY=true
        break
      fi
    fi
    [ $((i % 6)) -eq 0 ] && info "等待中... ($((i*2))秒)"
  done
  if [ "$BE_READY" != "true" ]; then
    fail "后端启动超时，请检查 Maven 编译是否正常"
  fi
fi
echo ""

# ========== 检测前端 ==========
echo "  ── 前端检测 ──"

# Kill the old broken Vite server on 5173 if still running
if lsof -i :5173 -P -n 2>/dev/null | grep -q LISTEN; then
  warn "发现旧的前端服务 (5173端口)，正在关闭..."
  lsof -ti :5173 2>/dev/null | xargs kill -9 2>/dev/null
  sleep 1
fi

FRONTEND_OK=false
if lsof -i :$FRONTEND_PORT -P -n 2>/dev/null | grep -q LISTEN; then
  HTTP_CODE=$(curl -s -o /tmp/_fe_check.html -w "%{http_code}" "$FRONTEND_URL" 2>/dev/null)
  if [ "$HTTP_CODE" = "200" ]; then
    if grep -q "charset=UTF-8" /tmp/_fe_check.html 2>/dev/null && grep -q "中国历代皇室家族" /tmp/_fe_check.html 2>/dev/null; then
      ok "前端运行正常 (端口 $FRONTEND_PORT)"
      FRONTEND_OK=true
    else
      warn "前端页面内容异常，准备重启"
    fi
  else
    warn "前端 HTTP 状态码: $HTTP_CODE，准备重启"
  fi
else
  warn "前端端口 $FRONTEND_PORT 未监听"
fi

if [ "$FRONTEND_OK" != "true" ]; then
  info "正在关闭旧的前端进程..."
  lsof -ti :$FRONTEND_PORT 2>/dev/null | xargs kill -9 2>/dev/null
  sleep 2
  info "正在启动前端 (新终端窗口)..."
  osascript -e "tell application \"Terminal\" to do script \"cd $FRONTEND_DIR && npm run dev -- --port $FRONTEND_PORT\"" 2>/dev/null
  info "等待前端就绪..."
  FE_READY=false
  for i in $(seq 1 24); do
    sleep 2
    if lsof -i :$FRONTEND_PORT -P -n 2>/dev/null | grep -q LISTEN; then
      CODE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" 2>/dev/null)
      if [ "$CODE" = "200" ]; then
        ok "前端就绪 ($((i*2))秒)"
        FE_READY=true
        break
      fi
    fi
    [ $((i % 6)) -eq 0 ] && info "等待中... ($((i*2))秒)"
  done
  if [ "$FE_READY" != "true" ]; then
    fail "前端启动超时，请检查 npm install 是否已完成"
  fi
fi
echo ""

# ========== 结果 ==========
echo "  ── 运行状态 ──"
if lsof -i :$BACKEND_PORT -P -n 2>/dev/null | grep -q LISTEN; then
  ok "后端 http://localhost:$BACKEND_PORT"
else
  fail "后端未运行"
fi
if lsof -i :$FRONTEND_PORT -P -n 2>/dev/null | grep -q LISTEN; then
  ok "前端 http://localhost:$FRONTEND_PORT"
else
  fail "前端未运行"
fi

echo ""
info "正在打开浏览器..."
open "http://localhost:$FRONTEND_PORT" 2>/dev/null || true
echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║             启动完成                 ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

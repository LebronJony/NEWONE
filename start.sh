#!/bin/bash
# ============================================================
# 中国历代皇室家族 — 一键启动脚本
# 功能: 关闭旧终端窗口、健康检查、一键重启
# 访问地址:
#   http://localhost:5174/   (前端开发服务器，推荐)
#   http://localhost:8088/   (后端直连，SPA + API)
# ============================================================

set -e

BACKEND_PORT=8088
FRONTEND_PORT=5174
BACKEND_DIR="/Users/gong/Documents/NEWONE/backend"
FRONTEND_DIR="/Users/gong/Documents/NEWONE/frontend"
BACKEND_HEALTH="http://localhost:8088/api/dynasties"
FRONTEND_URL="http://localhost:5174"

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'

ok()   { echo -e "  ${GREEN}✓${NC} $1"; }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; }
info() { echo -e "  ${CYAN}→${NC} $1"; }

# ---------- 标题 ----------
echo ""
printf "\033[36m  ╔══════════════════════════════════════════════╗\033[0m\n"
printf "\033[36m  ║        中国历代皇室家族 — 一键启动          ║\033[0m\n"
printf "\033[36m  ╚══════════════════════════════════════════════╝\033[0m\n"
echo ""

# ========== 解析参数 ==========
FORCE_RESTART=false
if [ "${1:-}" = "restart" ]; then
  FORCE_RESTART=true
  echo "  ⚡ 强制重启模式 — 清理所有服务..."
  echo ""

  # 强制杀掉所有相关进程
  pkill -f "mvnw.*spring-boot"  || true
  pkill -f "HistoryApplication"  || true
  pkill -f "spring-boot"  || true
  pkill -f "serve_frontend.cjs"  || true
  pkill -f "node.*serve_frontend"  || true
  lsof -ti :$BACKEND_PORT -P -n  | xargs kill -9  || true
  lsof -ti :$FRONTEND_PORT -P -n  | xargs kill -9  || true
  sleep 2
  ok "所有相关进程已终止"

  # 强制关闭所有 Terminal 窗口
  osascript -e 'tell application "Terminal" to close (every window whose frontmost is false)'  || true
  ok "所有 Terminal 窗口已关闭"

  # 强制清除所有缓存
  if [ -d "$FRONTEND_DIR/node_modules/.vite" ]; then
    rm -rf "$FRONTEND_DIR/node_modules/.vite"
  fi
  if [ -d "$FRONTEND_DIR/dist" ]; then
    rm -rf "$FRONTEND_DIR/dist"
  fi
  ok "缓存已完全清除"
  echo ""
  echo "  正在重新启动所有服务..."
  echo ""
fi

# ========== 1. 关闭旧终端窗口 ==========
echo "  ── 关闭旧终端窗口 ──"
osascript -e 'tell application "Terminal" to close (every window whose frontmost is false)'  && ok "旧终端窗口已关闭" || info "无需关闭旧窗口"

# ========== 2. 清除缓存 ==========
echo ""
echo "  ── 清除缓存 ──"
if [ -d "$FRONTEND_DIR/node_modules/.vite" ]; then
  rm -rf "$FRONTEND_DIR/node_modules/.vite" && ok "Vite 缓存已清除" || info "清除 Vite 缓存失败"
else
  info "无需清除 Vite 缓存"
fi
if [ -d "$FRONTEND_DIR/dist" ]; then
  rm -rf "$FRONTEND_DIR/dist" && ok "构建缓存已清除" || info "清除构建缓存失败"
else
  info "无需清除构建缓存"
fi

# ========== 3. 后端检测启动 ==========
echo ""
echo "  ── 后端 (Spring Boot, 端口 $BACKEND_PORT) ──"
BACKEND_OK=false
if lsof -i :$BACKEND_PORT -P -n  | grep -q LISTEN; then
  HTTP_CODE=$(curl -s -o /tmp/_be_check.json -w "%{http_code}" "$BACKEND_HEALTH" )
  if [ "$HTTP_CODE" = "200" ]; then
    H_COUNT=$(head -c 2 /tmp/_be_check.json )
    if [ "$H_COUNT" = "[{" ]; then
      ok "运行正常"
      BACKEND_OK=true
    else
      warn "API 返回异常 — 重启"
    fi
  else
    warn "HTTP $HTTP_CODE — 重启"
  fi
else
  warn "未运行 — 启动中..."
fi

if [ "$BACKEND_OK" != "true" ]; then
  lsof -ti :$BACKEND_PORT  | xargs kill -9  && ok "旧进程已清理" || info "无旧进程"
  sleep 1
  info "启动后端 (新终端窗口)..."
  osascript -e "tell application \"Terminal\" to do script \"cd $BACKEND_DIR && ./mvnw spring-boot:run -DskipTests\"" 
  BE_READY=false
  for i in $(seq 1 30); do
    sleep 2
    if lsof -i :$BACKEND_PORT -P -n  | grep -q LISTEN; then
      CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_HEALTH" )
      if [ "$CODE" = "200" ]; then
        ok "就绪 ($((i*2))秒)"
        BE_READY=true
        break
      fi
    fi
    [ $((i % 5)) -eq 0 ] && info "等待中... ($((i*2))秒)"
  done
  if [ "$BE_READY" != "true" ]; then
    fail "后端启动超时（${BACKEND_DIR}/target 目录可能存在编译错误）"
  fi
fi

# ========== 4. 前端构建 + 部署到后端 ==========
echo ""
echo "  ── 前端 (Vue 3, 端口 $FRONTEND_PORT) ──"
info "构建前端..."
cd "$FRONTEND_DIR" && npx vite build  && ok "构建完成" || { fail "前端构建失败，请检查代码错误"; exit 1; }
info "部署到后端静态目录..."
rm -rf "$BACKEND_DIR/src/main/resources/static/*" 
cp -r "$FRONTEND_DIR/dist/"* "$BACKEND_DIR/src/main/resources/static/"  && ok "已部署到后端静态目录" || info "部署失败（不影响前端独立运行）"

# ========== 5. 前端检测启动 ==========
FRONTEND_OK=false
if lsof -i :$FRONTEND_PORT -P -n  | grep -q LISTEN; then
  HTTP_CODE=$(curl -s -o /tmp/_fe_check.html -w "%{http_code}" "$FRONTEND_URL" )
  if [ "$HTTP_CODE" = "200" ]; then
    if grep -q "charset=UTF-8" /tmp/_fe_check.html  && grep -q "中国历代皇室家族" /tmp/_fe_check.html ; then
      ok "运行正常"
      FRONTEND_OK=true
    else
      warn "页面内容异常 — 重启"
    fi
  else
    warn "HTTP $HTTP_CODE — 重启"
  fi
else
  warn "未运行 — 启动中..."
fi

if [ "$FRONTEND_OK" != "true" ]; then
  lsof -ti :$FRONTEND_PORT  | xargs kill -9  && ok "旧进程已清理" || info "无旧进程"
  sleep 1
  info "启动前端 (新终端窗口)..."
  osascript -e "tell application \"Terminal\" to do script \"cd $FRONTEND_DIR && node serve_frontend.cjs\"" 
  FE_READY=false
  for i in $(seq 1 20); do
    sleep 2
    if lsof -i :$FRONTEND_PORT -P -n  | grep -q LISTEN; then
      CODE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" )
      if [ "$CODE" = "200" ]; then
        ok "就绪 ($((i*2))秒)"
        FE_READY=true
        break
      fi
    fi
    [ $((i % 5)) -eq 0 ] && info "等待中... ($((i*2))秒)"
  done
  if [ "$FE_READY" != "true" ]; then
    fail "前端启动超时"
  fi
fi

# ========== 6. 最终健康检查 ==========
echo ""
echo "  ── 健康检查 ──"
ALL_OK=true
# 后端检查
BE_CODE=$(curl -s -o /tmp/_be_final.json -w "%{http_code}" "$BACKEND_HEALTH" )
BE_JSON=$(head -c 2 /tmp/_be_final.json )
if [ "$BE_CODE" = "200" ] && [ "$BE_JSON" = "[{" ]; then
  D_COUNT=$(python3 -c "import json; d=json.load(open('/tmp/_be_final.json')); print(len(d))"  || echo "0")
  ok "后端 API: ${D_COUNT:-?} 个朝代获取成功"
else
  fail "后端 API 异常 (HTTP $BE_CODE)"
  ALL_OK=false
fi

# 前端检查
FE_CODE=$(curl -s -o /tmp/_fe_final.html -w "%{http_code}" "$FRONTEND_URL" )
if [ "$FE_CODE" = "200" ]; then
  if grep -q "中国历代皇室家族" /tmp/_fe_final.html ; then
    ok "前端页面: 正常加载"
  else
    warn "前端页面不完整"
    ALL_OK=false
  fi
else
  fail "前端 HTTP $FE_CODE"
  ALL_OK=false
fi

# SPA 路由检查
SPA_CODE=$(curl -s -o /tmp/_spa_check.html -w "%{http_code}" "$FRONTEND_URL/dynasty/2" )
if [ "$SPA_CODE" = "200" ]; then
  ok "SPA 路由: /dynasty/2 ➔ 200"
else
  fail "SPA 路由异常 (HTTP $SPA_CODE)"
  ALL_OK=false
fi

# API 通过前端代理检查
PROXY_CODE=$(curl -s -o /tmp/_proxy_check.json -w "%{http_code}" "$FRONTEND_URL/api/dynasties" )
P_JSON=$(head -c 2 /tmp/_proxy_check.json )
if [ "$PROXY_CODE" = "200" ] && [ "$P_JSON" = "[{" ]; then
  ok "前端代理: API 透传正常"
else
  fail "前端代理异常 (HTTP $PROXY_CODE)"
  ALL_OK=false
fi

# ========== 7. 结果输出 ==========
echo ""
if [ "$ALL_OK" = "true" ]; then
  echo -e "  ${GREEN}╔══════════════════════════════════════════╗${NC}"
  echo -e "  ${GREEN}║          ✓  所有服务运行正常           ║${NC}"
  echo -e "  ${GREEN}╚══════════════════════════════════════════╝${NC}"
else
  echo -e "  ${YELLOW}╔══════════════════════════════════════════╗${NC}"
  echo -e "  ${YELLOW}║          ⚠  部分服务异常               ║${NC}"
  echo -e "  ${YELLOW}╚══════════════════════════════════════════╝${NC}"
fi
echo ""
echo "  ┌──────────────────────────────────────┐"
echo "  │  访问地址                              │"
echo "  │                                        │"
echo -e "  │  ${CYAN}http://localhost:$FRONTEND_PORT/${NC}    前端服务器 (推荐) │"
echo -e "  │  ${CYAN}http://localhost:$BACKEND_PORT/${NC}     后端直连       │"
echo "  └──────────────────────────────────────┘"
echo ""

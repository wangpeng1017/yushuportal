#!/bin/bash
# iimake-made-portal 一键部署脚本
# 用法: ./deploy.sh
# 部署到 阿里云 8.130.182.148:3011

set -e

PROJECT_DIR="/Users/wangpeng/Downloads/yushu/xitong/iimake-made-portal/iimake-made-portal"
SERVER="root@8.130.182.148"
REMOTE_PATH="/var/www/yushu-portal"
PORT=3011

cd "$PROJECT_DIR"

echo "📦 [1/4] 本地构建 (mock 模式 - 纯前端 demo)..."
pnpm build:mock

echo "🗜  [2/4] 打包 dist..."
tar -czf /tmp/yushu-portal-dist.tar.gz -C dist .
DIST_SIZE=$(du -sh /tmp/yushu-portal-dist.tar.gz | cut -f1)
echo "    打包大小: $DIST_SIZE"

echo "🚀 [3/4] 上传到服务器..."
scp -q /tmp/yushu-portal-dist.tar.gz "$SERVER:/tmp/"

echo "🔧 [4/4] 服务器解压 + nginx reload..."
ssh "$SERVER" "
  set -e
  mkdir -p $REMOTE_PATH
  # 备份当前版本
  if [ -d $REMOTE_PATH ] && [ \"\$(ls -A $REMOTE_PATH)\" ]; then
    BACKUP=${REMOTE_PATH}-backup-\$(date +%Y%m%d-%H%M%S)
    cp -r $REMOTE_PATH \$BACKUP
    echo \"    旧版本已备份到 \$BACKUP\"
  fi
  rm -rf $REMOTE_PATH/*
  tar -xzf /tmp/yushu-portal-dist.tar.gz -C $REMOTE_PATH
  rm /tmp/yushu-portal-dist.tar.gz
  nginx -s reload
  echo \"    部署完成\"
"

rm /tmp/yushu-portal-dist.tar.gz
echo ""
echo "✅ 全部完成！"
echo "🌐 访问: http://8.130.182.148:$PORT/"

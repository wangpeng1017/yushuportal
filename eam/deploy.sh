#!/bin/bash
# 宇树 EAM 一键部署脚本
# 用法: ./deploy.sh
# 部署到 阿里云 8.130.182.148:3010

set -e

PROJECT_DIR="/Users/wangpeng/Downloads/yushu/xitong/iimake-eam-console-rebuild"
SERVER="root@8.130.182.148"
REMOTE_PATH="/var/www/yushu-eam"
PORT=3010

cd "$PROJECT_DIR"

echo "📦 [1/4] 本地构建 (mock 模式)..."
npm run build:mock

echo "🗜  [2/4] 打包 dist..."
tar -czf /tmp/yushu-eam-dist.tar.gz -C dist .
DIST_SIZE=$(du -sh /tmp/yushu-eam-dist.tar.gz | cut -f1)
echo "    打包大小: $DIST_SIZE"

echo "🚀 [3/4] 上传到服务器..."
scp -q /tmp/yushu-eam-dist.tar.gz "$SERVER:/tmp/"

echo "🔧 [4/4] 服务器解压 + nginx reload..."
ssh "$SERVER" "
  set -e
  # 备份当前版本
  if [ -d $REMOTE_PATH ] && [ \"\$(ls -A $REMOTE_PATH)\" ]; then
    BACKUP=${REMOTE_PATH}-backup-\$(date +%Y%m%d-%H%M%S)
    cp -r $REMOTE_PATH \$BACKUP
    echo \"    旧版本已备份到 \$BACKUP\"
  fi
  rm -rf $REMOTE_PATH/*
  tar -xzf /tmp/yushu-eam-dist.tar.gz -C $REMOTE_PATH
  rm /tmp/yushu-eam-dist.tar.gz
  nginx -s reload
  echo \"    部署完成\"
"

rm /tmp/yushu-eam-dist.tar.gz
echo ""
echo "✅ 全部完成！"
echo "🌐 访问: http://8.130.182.148:$PORT/"
echo "📋 测试账号: admin / c-admin / b-admin / cnc-admin (密码任意)"

#!/usr/bin/env bash
# UniTree UI Theme - 同步脚本
# 把 unitree-ui-theme/ 下的 CSS / SCSS 文件复制到四个项目的固定目录
#
# 用法：
#   ./sync.sh                # 同步全部项目
#   ./sync.sh qms            # 只同步 QMS
#   ./sync.sh mes eam        # 同步 MES 和 EAM
#
# 维护：tokens / base / components 是单一权威源，禁止在各项目内手动修改

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# 颜色输出
GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"
RESET="\033[0m"

# 待同步的源文件
STATIC_FILES=("tokens.css" "base.css" "components.css" "logo.png")
SCSS_FILES=("element-plus-override.scss")

# 项目接入路径配置
# 格式："项目名|项目目录|css 子目录"
PROJECTS=(
  "wms|$ROOT/wms|unitree-theme"                                                   # WMS（待补充本地源码）
  "qms|$ROOT/qms|unitree-theme"                                                   # QMS 6 个 HTML
  "mes|$ROOT/iimake-made-portal/iimake-made-portal/public|unitree-theme"          # MES 静态
  "eam|$ROOT/iimake-eam-console-rebuild/src/styles|unitree-theme"                 # EAM Vue
)

sync_one() {
  local name="$1"
  local proj_dir="$2"
  local css_subdir="$3"

  if [[ ! -d "$proj_dir" ]]; then
    printf "${YELLOW}[SKIP]${RESET} %s: 目录不存在 %s\n" "$name" "$proj_dir"
    return 0
  fi

  local target_dir="$proj_dir/$css_subdir"
  mkdir -p "$target_dir"

  # 复制 CSS
  for f in "${STATIC_FILES[@]}"; do
    cp "$SCRIPT_DIR/$f" "$target_dir/$f"
  done

  # EAM 额外需要 SCSS
  if [[ "$name" == "eam" ]]; then
    for f in "${SCSS_FILES[@]}"; do
      cp "$SCRIPT_DIR/$f" "$target_dir/$f"
    done
  fi

  printf "${GREEN}[OK]${RESET}   %s -> %s\n" "$name" "$target_dir"
}

# 解析参数
TARGETS=("$@")
if [[ ${#TARGETS[@]} -eq 0 ]]; then
  TARGETS=("wms" "qms" "mes" "eam")
fi

echo "UniTree UI Theme 同步：${TARGETS[*]}"
echo "---------------------------------------------"

for target in "${TARGETS[@]}"; do
  matched=0
  for entry in "${PROJECTS[@]}"; do
    IFS='|' read -r name proj_dir css_subdir <<< "$entry"
    if [[ "$name" == "$target" ]]; then
      sync_one "$name" "$proj_dir" "$css_subdir"
      matched=1
      break
    fi
  done
  if [[ $matched -eq 0 ]]; then
    printf "${RED}[ERR]${RESET}  未知项目: %s\n" "$target" >&2
  fi
done

echo "---------------------------------------------"
echo "完成。各项目 HTML 中引用方式："
echo '  <link rel="stylesheet" href="unitree-theme/tokens.css">'
echo '  <link rel="stylesheet" href="unitree-theme/base.css">'
echo '  <link rel="stylesheet" href="unitree-theme/components.css">'

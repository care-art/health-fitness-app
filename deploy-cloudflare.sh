#!/bin/bash
# Cloudflare Pages 部署脚本

echo "开始构建..."
npm run build

echo "构建完成，准备部署..."
echo "请访问 https://dash.cloudflare.com 创建 Pages 项目"
echo "上传 dist 文件夹即可"

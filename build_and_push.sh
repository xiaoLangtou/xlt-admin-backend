#!/bin/bash

# 检查是否传入版本号
if [ -z "$1" ]; then
  echo "❌  请输入版本号，如: ./build_and_push.sh 1.0.0"
  exit 1
fi

VERSION=$1
IMAGE_NAME="xlt-admin-backend"
REGISTRY="swr.cn-north-4.myhuaweicloud.com/weipengcheng"

echo "🚀 开始构建后端项目..."
pnpm run build:prod


echo "📦 构建多架构 Docker 镜像..."

# 使用 buildx 构建支持多个架构的镜像
docker  build --platform=linux/amd64 -t ${IMAGE_NAME}:${VERSION} .

# 标记镜像
echo "🏷️  标记镜像..."
docker tag ${IMAGE_NAME}:${VERSION} ${REGISTRY}/${IMAGE_NAME}:${VERSION}

echo "📤 推送镜像到华为云..."
# 使用 --push 参数推送镜像到远程仓库
docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}

echo "✅ 推送完成: ${REGISTRY}/${IMAGE_NAME}:${VERSION}"

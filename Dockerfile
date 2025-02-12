# --- 构建阶段 ---
FROM node:18-alpine AS build-stage

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 以利用 Docker 缓存
COPY package*.json ./

# 使用淘宝镜像源，加快依赖安装速度
RUN npm config set registry https://registry.npmmirror.com/ && npm install

# 复制项目代码
COPY . .

# 构建生产环境代码
RUN npm run build:prod


# --- 生产环境阶段 ---
FROM node:18-alpine AS production-stage

# 设置环境变量
ENV NODE_ENV=production

# 复制构建后的代码
COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

# 仅安装生产依赖
RUN npm config set registry https://registry.npmmirror.com/ && npm install --only=production

# 暴露端口
EXPOSE 3008

# 运行应用
CMD ["node", "/app/main.js"]

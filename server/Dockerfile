# Imagem do servidor do Clover RP (serve para Render, Railway, Fly.io ou qualquer VPS com Docker)
FROM node:22-slim
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm install --no-save typescript @types/node
COPY tsconfig.json ./
COPY src ./src
RUN npx tsc -p . && npm uninstall typescript @types/node
ENV PORT=2567
EXPOSE 2567
CMD ["node", "dist/index.js"]

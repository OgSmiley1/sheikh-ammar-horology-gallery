FROM node:22-alpine AS verify
WORKDIR /repo/museum
COPY museum/package.json museum/package-lock.json ./
RUN npm ci
COPY museum/dist ./dist
COPY museum/scripts ./scripts
RUN npm test

FROM node:22-alpine
WORKDIR /app
COPY --from=verify --chown=node:node /repo/museum/dist ./dist
COPY --from=verify --chown=node:node /repo/museum/scripts/serve.mjs ./scripts/serve.mjs
USER node
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","scripts/serve.mjs"]

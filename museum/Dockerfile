FROM node:22-alpine
WORKDIR /app
COPY --chown=node:node museum/dist ./dist
COPY --chown=node:node museum/scripts/serve.mjs ./scripts/serve.mjs
USER node
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node","scripts/serve.mjs"]

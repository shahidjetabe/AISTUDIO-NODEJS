###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As base
USER node
WORKDIR /app

COPY --chown=node:node package*.json .

RUN npm ci

COPY --chown=node:node . .

RUN npm run build && npm prune --production

###################
# BUILD FOR PRODUCTION
###################

FROM base As production
ENV NODE_ENV=production
WORKDIR /app
RUN npm ci
COPY --chown=node:node --from=base /app/dist ./dist

USER node

CMD npm run build && npm run start:fast
FROM node:12.13.0
EXPOSE 1234

COPY package.json yarn.lock tsconfig.json .env.development .env.stage .env.production /opt/om/

WORKDIR /opt/om
RUN yarn

COPY src /opt/om

ARG ENV=production
RUN yarn build:$ENV

CMD ["yarn", "build:production"]

FROM node:lts-alpine

ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

COPY dist dist
COPY node_modules node_modules

CMD [ "node", "dist/main.js" ]
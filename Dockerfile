FROM node:lts-alpine

ENV NASNE_NOTIFIER_HOST=localhost \
    NASNE_NOTIFIER_INTERVAL=60

RUN apk update && apk add --no-cache git tini tzdata alpine-conf
RUN setup-timezone -z Asia/Tokyo

WORKDIR /app
RUN git clone https://github.com/mtane0412/nasne-wrapper.git

COPY package.json package-lock.json index.js .
RUN npm install

CMD ["node", "index.js"]
ENTRYPOINT ["/sbin/tini", "--"]

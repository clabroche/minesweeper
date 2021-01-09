FROM alpine:3.11 as builder
RUN apk --no-cache add gcc g++ make python nodejs npm
RUN npm i -g @vue/cli-service
WORKDIR /minesweeper
COPY . .
RUN npm i
ARG VUE_APP_HOST
ENV VUE_APP_HOST=$VUE_APP_HOST
ARG VUE_APP_SOCKET
ENV VUE_APP_SOCKET=$VUE_APP_SOCKET
RUN npm run build
RUN rm -rf node_modules
RUN npm i express

FROM alpine:3.11
RUN apk --no-cache add nodejs
WORKDIR /minesweeper

COPY --from=builder /minesweeper/node_modules ./node_modules
COPY --from=builder /minesweeper/server ./
CMD ["node", "bin/www"]

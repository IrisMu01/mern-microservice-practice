FROM node:18 AS build
WORKDIR /work-dir
COPY package.json package-lock.json ./
RUN npm install --production
COPY public ./public
COPY src ./src

ENV REACT_APP_AUTH_SERVICE_URL="http://localhost:4000/api/auth"
ENV REACT_APP_USER_SERVICE_URL="http://localhost:4001/api/users"
ENV REACT_APP_GAME_SERVICE_URL="http://localhost:4003/api/game"

RUN npm run build

FROM nginx:alpine
COPY --from=build /work-dir/build /usr/share/nginx/html
CMD ["sh", "-c", "cd /usr/share/nginx/html/ && ./set-env.sh && nginx -g 'daemon off;'"]

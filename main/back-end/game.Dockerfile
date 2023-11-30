FROM node:18-alpine
WORKDIR /game-service

# copy & install common library dependencies
COPY common/package.json common/package-lock.json common/
RUN ls /game-service/

RUN cd /game-service/common/ && npm install --production

# copy common library source code
COPY common/src/ common/src/

# copy & install microservice dependencies
COPY microservice-game/package.json microservice-game/package-lock.json app/
RUN cd /game-service/app/ && npm install --production

# copy microservice source code
COPY microservice-game/src app/src/

# command to start app
CMD ["node", "app/src/app.js"]

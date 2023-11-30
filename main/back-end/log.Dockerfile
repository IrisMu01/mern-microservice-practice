FROM node:18-alpine
WORKDIR /log-service

# copy & install common library dependencies
COPY common/package.json common/package-lock.json common/
RUN ls /log-service/

RUN cd /log-service/common/ && npm install --production

# copy common library source code
COPY common/src/ common/src/

# copy & install microservice dependencies
COPY microservice-log/package.json microservice-log/package-lock.json app/
RUN cd /log-service/app/ && npm install --production

# copy microservice source code
COPY microservice-log/src app/src/

# command to start app
CMD ["node", "app/src/app.js"]

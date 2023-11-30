FROM node:18-alpine
WORKDIR /user-service

# copy & install common library dependencies
COPY common/package.json common/package-lock.json common/
RUN ls /user-service/

RUN cd /user-service/common/ && npm install --production

# copy common library source code
COPY common/src/ common/src/

# copy & install microservice dependencies
COPY microservice-user/package.json microservice-user/package-lock.json app/
RUN cd /user-service/app/ && npm install --production

# copy microservice source code
COPY microservice-user/src app/src/

# command to start app
CMD ["node", "app/src/app.js"]

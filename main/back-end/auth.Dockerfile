FROM node:18-alpine
WORKDIR /auth-service

# copy & install common library dependencies
COPY common/package.json common/package-lock.json common/
RUN ls /auth-service/

RUN cd /auth-service/common/ && npm install --production

# copy common library source code
COPY common/src/ common/src/

# copy & install microservice dependencies
COPY microservice-auth/package.json microservice-auth/package-lock.json app/
RUN cd /auth-service/app/ && npm install --production

# copy microservice source code
COPY microservice-auth/src app/src/

# command to start app
CMD ["node", "app/src/app.js"]

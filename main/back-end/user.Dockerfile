FROM --platform=linux/amd64 node:18-alpine
WORKDIR /work-dir

# copy & install common library dependencies
COPY common/package.json common/package-lock.json common/

RUN cd /work-dir/common/ && npm install --production

# copy common library source code
COPY common/src/ common/src/

# copy & install microservice dependencies
COPY microservice-user/package.json microservice-user/package-lock.json app/
RUN cd /work-dir/app/ && npm install --production

# copy microservice source code
COPY microservice-user/src /work-dir/app/src/

#copy AWS credential & config files
COPY .aws ./.aws

# command to start app
CMD ["node", "/work-dir/app/src/app.js"]

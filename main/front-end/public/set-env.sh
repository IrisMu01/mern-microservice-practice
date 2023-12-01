#!/bin/sh

# Black magic for bringing in environment variables into production build: https://www.bencode.net/posts/react-build/

# Substitute container environment into production packaged react app
# CRA does have some support for managing .env files, but not as an `npm build` output

# To test:
# docker run --rm -e API_URI=http://localhost:5000/api -e CONFLUENCE_URI=https://confluence.evilcorp.org -e INTRANET_URI=https://intranet.evilcorp.org -it -p 3000:80/tcp dam-frontend:latest

cp -f /usr/share/nginx/html/index.html /tmp

if [ -n "$REACT_APP_AUTH_SERVICE_URL" ]; then
sed -i -e "s|REPLACE_REACT_APP_AUTH_SERVICE_URL|$REACT_APP_AUTH_SERVICE_URL|g" /tmp/index.html
fi

if [ -n "$REACT_APP_USER_SERVICE_URL" ]; then
sed -i -e "s|REPLACE_REACT_APP_USER_SERVICE_URL|$REACT_APP_USER_SERVICE_URL|g" /tmp/index.html
fi

if [ -n "$REACT_APP_GAME_SERVICE_URL" ]; then
sed -i -e "s|REPLACE_REACT_APP_GAME_SERVICE_URL|$REACT_APP_GAME_SERVICE_URL|g" /tmp/index.html
fi

cat /tmp/index.html > /usr/share/nginx/html/index.html

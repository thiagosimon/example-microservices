FROM node:10.15-alpine

# CREATE ARGs
ARG nameImage="ms-user"
ARG port=5001

# install deps
RUN mkdir /tmp/$nameImage
ADD package.json /tmp/$nameImage/package.json
RUN cd /tmp/$nameImage && npm install

# Copy deps
RUN mkdir -p /opt/line/ms-$nameImage && cp -a /tmp/$nameImage/node_modules /opt/line/ms-$nameImage

# Setup workdir
WORKDIR /opt/line/ms-$nameImage
COPY . /opt/line/ms-$nameImage

# run
EXPOSE $port
CMD ["npm", "start"]
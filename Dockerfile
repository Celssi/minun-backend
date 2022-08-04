FROM node:17
EXPOSE 3000
RUN mkdir /home/node/app
COPY ./ /home/node/app
WORKDIR /home/node/app
RUN yarn install
RUN yarn build
RUN yarn run migration:up
ENTRYPOINT ["npm", "run", "start:prod"]

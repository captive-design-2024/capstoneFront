FROM node:22

WORKDIR /frontend

COPY . .

RUN yarn install

EXPOSE 3001

CMD bash -c "yarn start"
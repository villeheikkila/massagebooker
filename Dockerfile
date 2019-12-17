FROM node:10
EXPOSE 3001

WORKDIR /usr/src/app
RUN mkdir massagebooker-frontend
COPY massagebooker-frontend/package.json ./massagebooker-frontend
RUN cd massagebooker-frontend && npm install

COPY . .

RUN cd /usr/src/app/massagebooker-frontend && npm run-script build

WORKDIR /usr/src/app
RUN mv ./massagebooker-frontend/build ./massagebooker-backend

WORKDIR /usr/src/app/massagebooker
RUN npm install

CMD [ "npm", "start" ]

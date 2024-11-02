FROM quay.io/a-s-w-i-n-s-p-a-r-k-y/x-bot-md:latest
COPY package.json .
RUN yarn install
COPY . .
CMD npm start

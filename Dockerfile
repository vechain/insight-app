FROM node:18

RUN apt-get update && apt-get install -y iproute2
RUN npm install -g @vechain/devpal
CMD ["devpal", "https://galactica.live.dev.node.vechain.org"]

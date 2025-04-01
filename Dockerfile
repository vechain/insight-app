FROM node:18

RUN apt-get update && apt-get install -y iproute2
RUN npm install -g @vechain/devpal
EXPOSE 80 
CMD ["devpal", "https://galactica.live.dev.node.vechain.org"]

FROM node:18-slim

WORKDIR /app

EXPOSE $PORT

CMD ["npm", "run", "start:dev"]
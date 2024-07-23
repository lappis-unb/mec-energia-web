FROM node:18.20.4-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY ./ ./

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

CMD ["npm", "run", "dev"]

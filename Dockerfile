FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=4000
ENV NODE_ENV=production
ENV MONGO_URI=mongodb://mongodb:27017/blogdb
ENV JWT_SECRET=your-secret-key

EXPOSE 4000

CMD ["npm", "start"]
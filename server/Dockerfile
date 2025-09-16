#Stage : 1  Build backend
FROM node:24-alpine AS build 

WORKDIR /app 

#copy package files and install dependencies
COPY package*.json ./
RUN npm install

#copy the spource code
COPY  . .

#generate the prisma client and buildn typescript
RUN npx prisma generate
RUN npm run build

#Stage : 2  Run backend
FROM node:24-alpine

WORKDIR /app

COPY  --from=build /app/package*.json ./
COPY  --from=build /app/node_modules ./node_modules
COPY  --from=build /app/dist ./dist
COPY  --from=build /app/prisma ./prisma

#Expose the port
EXPOSE  8000

#Start the server
CMD ["node", "dist/server.js"]
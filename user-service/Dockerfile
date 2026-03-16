FROM node:18-alpine

WORKDIR /app

# ก๊อปปี้ไฟล์ package.json เพื่อลง dependencies
COPY package*.json ./

RUN npm install

# ก๊อปปี้โค้ดทั้งหมดเข้าเครื่อง
COPY . .

EXPOSE 3003

CMD ["node", "src/index.js"]
FROM node:18-alpine3.15

WORKDIR /usr/src/app

# 호스트 머신의 /etc/localtime 파일을 복사하여 타임존 설정 적용
RUN apk add --no-cache tzdata
ENV TZ=Asia/Seoul

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080
CMD ["npm", "start"]

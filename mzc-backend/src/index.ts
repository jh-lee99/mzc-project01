import express from 'express';
import {createConnection} from "typeorm";
import router from './router';
import {AuthMiddleware} from "./middleware/AuthMiddleware";
import { collectMetrics } from './middleware/metrics';

let app = express();

// body-parser는 내장되어있음.  json 파싱하기 위해서 설정만 추가
app.use(express.json());

// express에는 json 데이터를 파싱하는 모듈이 내장되어있다.
// 하지만 json만 되고 x-www-form-urlencoded를 파싱하기 위해서 아래를 확장해야 한다.
app.use(express.urlencoded({
  extended: true
}))

// 모든 요청에 대한 메트릭 수집
app.use(collectMetrics);

// 모든 http method 허용, 스트링 리턴
app.use('/hello', (req, res) => {
  res.send('Hello test');
})

app.use('/api', router);

createConnection().then(connection => {
  app.listen(8080, () => {
    console.log('server is listening 8080');
  });
});


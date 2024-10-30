import express from 'express';
import {createConnection} from "typeorm";
import router from './router';
import {AuthMiddleware} from "./middleware/AuthMiddleware";
import { collectMetrics, metricsEndpoint } from './middleware/metrics';

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

// GET만 허용
app.get('/hello2', (req, res) => {
  res.send('Hello test');
})

// GET + query 파라메터로 데이터 전송
app.get('/hello3', (req, res) => {
  const {name} = req.query;
  res.send(`Hello ${name}`);
})

// GET + uri 파라메터로 데이터 전송
app.get('/hello32/:name', (req, res) => {
  const {name} = req.params;
  res.send(`Hello ${name}`);
})

// POST + query 파라메터로 데이터 전송
app.post('/hello33', (req, res) => {
  const {name} = req.query;
  res.send(`Hello ${name}`);
})

// post 전송, x-www-form-urlencoded 방식
app.post('/hello4', (req, res) => {
  const {name} = req.body;
  res.send(`Hello ${name}`);
})

// response - json 데이터 보내기
app.post('/hello5', (req, res) => {
  const result = {
    code: 0,
    message: 'success'
  };
  res.send(result);
})

// request - json 데이터 받기
app.post('/hello6', (req, res) => {
  const result = req.body;
  res.send(result);
})

app.get('/metrics', metricsEndpoint);

app.use('/api', router);

createConnection().then(connection => {
  app.listen(8080, () => {
    console.log('server is listening 8080');
  });
});


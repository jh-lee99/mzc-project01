import { Request, Response, NextFunction } from 'express';
import client from 'prom-client';

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'example-nodejs-app'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// HTTP 요청 카운터
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

// 요청 처리 시간 히스토그램
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.1, 0.5, 1, 2, 5] // 요청 시간을 기록할 버킷
});

// 메트릭 등록
register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);
// register.registerMetric(activeUsersGauge);
// register.registerMetric(dbConnectionPoolGauge);

// 미들웨어 함수로 각 요청의 메트릭 수집
export const collectMetrics = (req: Request, res: Response, next: NextFunction) => {
  const end = httpRequestDuration.startTimer(); // 요청 처리 시간 측정 시작

  res.on('finish', () => {
    // 요청이 완료되면 메트릭 수집
    const route = req.route ? req.route.path : req.path;
    httpRequestCounter.inc({ method: req.method, route, status: res.statusCode.toString() });
    end({ method: req.method, route, status: res.statusCode.toString() });
  });

  next();
};

// /metrics 경로에서 Prometheus 메트릭 제공
export const metricsEndpoint = (req: Request, res: Response) => {
  res.setHeader('Content-Type', register.contentType);
  register.metrics().then((metrics) => res.end(metrics));
};

import { Request, Response } from 'express';
import client from 'prom-client';

// Create a Registry which registers the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'example-nodejs-app'
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Export a function to attach the /metrics route
export const metricsEndpoint = (req: Request, res: Response) => {
  res.setHeader('Content-Type', register.contentType);
  register.metrics().then((metrics) => res.end(metrics));
};

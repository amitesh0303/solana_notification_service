import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { initDb } from './db/client';
import subscriptionsRouter from './routes/subscriptions';
import notificationsRouter from './routes/notifications';
import webhooksRouter from './routes/webhooks';

// Import workers so they start listening
import './workers/emailWorker';
import './workers/smsWorker';
import './workers/telegramWorker';
import './workers/discordWorker';

export const app = express();

// Rate limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many webhook requests.' },
});

// Capture raw body for webhook signature verification before JSON parsing
app.use(
  express.json({
    verify: (req: Request & { rawBody?: Buffer }, _res: Response, buf: Buffer) => {
      req.rawBody = buf;
    },
  }),
);

app.use('/subscriptions', apiLimiter, subscriptionsRouter);
app.use('/notifications', apiLimiter, notificationsRouter);
app.use('/webhooks', webhookLimiter, webhooksRouter);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = parseInt(process.env.PORT ?? '3001', 10);

async function start(): Promise<void> {
  await initDb();
  app.listen(PORT, () => {
    console.log(`SolNotify backend listening on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

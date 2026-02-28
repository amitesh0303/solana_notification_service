import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { processEvent } from '../services/eventProcessor';
import { SolanaEvent, EventType } from '../types';

const router = Router();

const VALID_EVENT_TYPES: EventType[] = [
  'transfer',
  'nft_sale',
  'defi_position',
  'token_transfer',
  'program_interaction',
];

function verifyHeliusSignature(rawBody: Buffer, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

// POST /webhooks/helius
router.post('/helius', async (req: Request, res: Response): Promise<void> => {
  const secret = process.env.HELIUS_WEBHOOK_SECRET;

  if (secret) {
    const signature = req.headers['helius-signature'] as string | undefined;
    if (!signature) {
      res.status(401).json({ error: 'Missing Helius-Signature header' });
      return;
    }

    const rawBody: Buffer | undefined = (req as Request & { rawBody?: Buffer }).rawBody;
    if (!rawBody) {
      res.status(401).json({ error: 'Cannot verify signature: raw body unavailable' });
      return;
    }
    if (!verifyHeliusSignature(rawBody, signature, secret)) {
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }
  }

  const payload = req.body as unknown;

  // Helius sends an array of transactions
  const events: unknown[] = Array.isArray(payload) ? payload : [payload];

  const processed: string[] = [];
  const errors: string[] = [];

  for (const raw of events) {
    try {
      const rawEvent = raw as Record<string, unknown>;

      const eventType = (rawEvent['type'] as string | undefined)?.toLowerCase() as EventType | undefined;
      if (!eventType || !VALID_EVENT_TYPES.includes(eventType)) {
        continue;
      }

      const accountKeys = Array.isArray(rawEvent['accountData'])
        ? (rawEvent['accountData'] as Array<{ account: string }>).map((a) => a.account)
        : Array.isArray(rawEvent['accountKeys'])
          ? (rawEvent['accountKeys'] as string[])
          : [];

      const event: SolanaEvent = {
        type: eventType,
        signature: (rawEvent['signature'] as string) ?? '',
        timestamp: typeof rawEvent['timestamp'] === 'number' ? rawEvent['timestamp'] : Math.floor(Date.now() / 1000),
        accountKeys,
        data: (rawEvent['data'] as Record<string, unknown>) ?? rawEvent,
      };

      await processEvent(event);
      processed.push(event.signature);
    } catch (err) {
      console.error('Error processing webhook event:', err);
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }

  res.json({ processed: processed.length, errors: errors.length > 0 ? errors : undefined });
});

export default router;

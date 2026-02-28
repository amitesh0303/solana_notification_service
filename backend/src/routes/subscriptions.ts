import { Router, Request, Response } from 'express';
import { pool } from '../db/client';
import { EventType, Channel } from '../types';

const router = Router();

const VALID_EVENT_TYPES: EventType[] = [
  'transfer',
  'nft_sale',
  'defi_position',
  'token_transfer',
  'program_interaction',
];
const VALID_CHANNELS: Channel[] = ['email', 'sms', 'telegram', 'discord'];

// POST /subscriptions
router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { userId, eventType, targetAddress, channel, conditions, channelConfig } = req.body as {
    userId?: string;
    eventType?: string;
    targetAddress?: string;
    channel?: string;
    conditions?: Record<string, unknown>;
    channelConfig?: Record<string, unknown>;
  };

  if (!userId || !eventType || !targetAddress || !channel) {
    res.status(400).json({ error: 'userId, eventType, targetAddress, and channel are required' });
    return;
  }

  if (!VALID_EVENT_TYPES.includes(eventType as EventType)) {
    res.status(400).json({ error: `Invalid eventType. Must be one of: ${VALID_EVENT_TYPES.join(', ')}` });
    return;
  }

  if (!VALID_CHANNELS.includes(channel as Channel)) {
    res.status(400).json({ error: `Invalid channel. Must be one of: ${VALID_CHANNELS.join(', ')}` });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO subscriptions (user_id, event_type, target_address, channel, conditions, channel_config)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        userId,
        eventType,
        targetAddress,
        channel,
        JSON.stringify(conditions ?? {}),
        JSON.stringify(channelConfig ?? {}),
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating subscription:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /subscriptions
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.query as { userId?: string };

  if (!userId) {
    res.status(400).json({ error: 'userId query parameter is required' });
    return;
  }

  try {
    const result = await pool.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error listing subscriptions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /subscriptions/:id
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { eventType, targetAddress, channel, conditions, channelConfig, active } = req.body as {
    eventType?: string;
    targetAddress?: string;
    channel?: string;
    conditions?: Record<string, unknown>;
    channelConfig?: Record<string, unknown>;
    active?: boolean;
  };

  if (eventType && !VALID_EVENT_TYPES.includes(eventType as EventType)) {
    res.status(400).json({ error: `Invalid eventType. Must be one of: ${VALID_EVENT_TYPES.join(', ')}` });
    return;
  }

  if (channel && !VALID_CHANNELS.includes(channel as Channel)) {
    res.status(400).json({ error: `Invalid channel. Must be one of: ${VALID_CHANNELS.join(', ')}` });
    return;
  }

  try {
    const existing = await pool.query(`SELECT * FROM subscriptions WHERE id = $1`, [id]);
    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    const current = existing.rows[0];
    const result = await pool.query(
      `UPDATE subscriptions
       SET event_type = $1,
           target_address = $2,
           channel = $3,
           conditions = $4,
           channel_config = $5,
           active = $6,
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [
        eventType ?? current.event_type,
        targetAddress ?? current.target_address,
        channel ?? current.channel,
        JSON.stringify(conditions ?? current.conditions),
        JSON.stringify(channelConfig ?? current.channel_config),
        active ?? current.active,
        id,
      ],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating subscription:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /subscriptions/:id
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM subscriptions WHERE id = $1 RETURNING id`,
      [id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }
    res.json({ message: 'Subscription deleted' });
  } catch (err) {
    console.error('Error deleting subscription:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

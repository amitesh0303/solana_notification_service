import { Router, Request, Response } from 'express';
import { pool } from '../db/client';

const router = Router();

// GET /notifications
router.get('/', async (req: Request, res: Response): Promise<void> => {
  const rawLimit = req.query['limit'];
  const rawOffset = req.query['offset'];
  const userId = req.query['userId'] as string | undefined;
  const subscriptionId = req.query['subscriptionId'] as string | undefined;
  const parsedLimit = Math.min(
    Number.isFinite(Number(rawLimit)) ? parseInt(rawLimit as string, 10) : 50,
    200,
  );
  const parsedOffset = Number.isFinite(Number(rawOffset)) ? parseInt(rawOffset as string, 10) : 0;

  try {
    if (subscriptionId) {
      const result = await pool.query(
        `SELECT n.* FROM notifications n
         WHERE n.subscription_id = $1
         ORDER BY n.created_at DESC
         LIMIT $2 OFFSET $3`,
        [subscriptionId, parsedLimit, parsedOffset],
      );
      res.json(result.rows);
      return;
    }

    if (userId) {
      const result = await pool.query(
        `SELECT n.* FROM notifications n
         JOIN subscriptions s ON n.subscription_id = s.id
         WHERE s.user_id = $1
         ORDER BY n.created_at DESC
         LIMIT $2 OFFSET $3`,
        [userId, parsedLimit, parsedOffset],
      );
      res.json(result.rows);
      return;
    }

    res.status(400).json({ error: 'userId or subscriptionId query parameter is required' });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

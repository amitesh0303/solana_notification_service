"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("../db/client");
const router = (0, express_1.Router)();
// GET /notifications
router.get('/', async (req, res) => {
    const rawLimit = req.query['limit'];
    const rawOffset = req.query['offset'];
    const userId = req.query['userId'];
    const subscriptionId = req.query['subscriptionId'];
    const parsedLimit = Math.min(Number.isFinite(Number(rawLimit)) ? parseInt(rawLimit, 10) : 50, 200);
    const parsedOffset = Number.isFinite(Number(rawOffset)) ? parseInt(rawOffset, 10) : 0;
    try {
        if (subscriptionId) {
            const result = await client_1.pool.query(`SELECT n.* FROM notifications n
         WHERE n.subscription_id = $1
         ORDER BY n.created_at DESC
         LIMIT $2 OFFSET $3`, [subscriptionId, parsedLimit, parsedOffset]);
            res.json(result.rows);
            return;
        }
        if (userId) {
            const result = await client_1.pool.query(`SELECT n.* FROM notifications n
         JOIN subscriptions s ON n.subscription_id = s.id
         WHERE s.user_id = $1
         ORDER BY n.created_at DESC
         LIMIT $2 OFFSET $3`, [userId, parsedLimit, parsedOffset]);
            res.json(result.rows);
            return;
        }
        res.status(400).json({ error: 'userId or subscriptionId query parameter is required' });
    }
    catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=notifications.js.map
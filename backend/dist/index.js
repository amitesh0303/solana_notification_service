"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const client_1 = require("./db/client");
const subscriptions_1 = __importDefault(require("./routes/subscriptions"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const webhooks_1 = __importDefault(require("./routes/webhooks"));
// Import workers so they start listening
require("./workers/emailWorker");
require("./workers/smsWorker");
require("./workers/telegramWorker");
require("./workers/discordWorker");
exports.app = (0, express_1.default)();
// Capture raw body for webhook signature verification before JSON parsing
exports.app.use(express_1.default.json({
    verify: (req, _res, buf) => {
        req.rawBody = buf;
    },
}));
exports.app.use('/subscriptions', subscriptions_1.default);
exports.app.use('/notifications', notifications_1.default);
exports.app.use('/webhooks', webhooks_1.default);
exports.app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
// Global error handler
exports.app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
const PORT = parseInt(process.env.PORT ?? '3001', 10);
async function start() {
    await (0, client_1.initDb)();
    exports.app.listen(PORT, () => {
        console.log(`SolNotify backend listening on port ${PORT}`);
    });
}
start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.initDb = initDb;
const pg_1 = require("pg");
exports.pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
async function initDb() {
    await exports.pool.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      event_type VARCHAR(50) NOT NULL,
      target_address VARCHAR(44) NOT NULL,
      channel VARCHAR(20) NOT NULL,
      conditions JSONB DEFAULT '{}',
      channel_config JSONB DEFAULT '{}',
      active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      subscription_id UUID REFERENCES subscriptions(id),
      event_data JSONB NOT NULL,
      channel VARCHAR(20) NOT NULL,
      delivered BOOLEAN DEFAULT false,
      delivered_at TIMESTAMP,
      error TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}
//# sourceMappingURL=client.js.map
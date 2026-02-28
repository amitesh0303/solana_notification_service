export default function SettingsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Configure notification channels. These values are set as environment variables on the
          backend.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* Email */}
        <SettingsSection
          icon="✉️"
          title="Email (Resend)"
          color="blue"
          vars={[
            {
              name: 'RESEND_API_KEY',
              description: 'Your Resend API key for sending transactional emails.',
              example: 're_xxxxxxxxxxxxxxxxxxxx',
            },
            {
              name: 'RESEND_FROM_EMAIL',
              description: 'The "from" address for outgoing emails.',
              example: 'alerts@yourdomain.com',
            },
          ]}
          docs="https://resend.com/docs"
          docsLabel="Resend Docs"
        />

        {/* SMS */}
        <SettingsSection
          icon="📱"
          title="SMS (Twilio)"
          color="green"
          vars={[
            {
              name: 'TWILIO_ACCOUNT_SID',
              description: 'Your Twilio Account SID.',
              example: 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            },
            {
              name: 'TWILIO_AUTH_TOKEN',
              description: 'Your Twilio Auth Token.',
              example: 'your_auth_token',
            },
            {
              name: 'TWILIO_FROM_NUMBER',
              description: 'The Twilio phone number to send SMS from.',
              example: '+15550001234',
            },
          ]}
          docs="https://www.twilio.com/docs/sms"
          docsLabel="Twilio Docs"
        />

        {/* Telegram */}
        <SettingsSection
          icon="✈️"
          title="Telegram Bot"
          color="sky"
          vars={[
            {
              name: 'TELEGRAM_BOT_TOKEN',
              description:
                'Bot token obtained from @BotFather on Telegram.',
              example: '123456789:AAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            },
          ]}
          docs="https://core.telegram.org/bots"
          docsLabel="Telegram Bot Docs"
          steps={[
            'Message @BotFather on Telegram and send /newbot',
            'Follow the prompts and copy the token',
            'Add the token to your backend .env as TELEGRAM_BOT_TOKEN',
            'Start a chat with your bot and get your Chat ID',
            'Use the Chat ID when creating a Telegram subscription',
          ]}
        />

        {/* Discord */}
        <SettingsSection
          icon="🎮"
          title="Discord Bot"
          color="purple"
          vars={[
            {
              name: 'DISCORD_BOT_TOKEN',
              description: 'Bot token from the Discord Developer Portal.',
              example: 'MTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            },
          ]}
          docs="https://discord.com/developers/docs/intro"
          docsLabel="Discord Developer Docs"
          steps={[
            'Go to https://discord.com/developers/applications and create a new application',
            'Under "Bot", create a bot and copy the token',
            'Add DISCORD_BOT_TOKEN to your backend .env',
            'Invite the bot to your server with the Guilds intent',
            'Enable Developer Mode in Discord, right-click a channel and copy its Channel ID',
            'Use the Channel ID when creating a Discord subscription',
          ]}
          note="The backend uses discord.js — the bot must be in the server and have permission to send messages in the target channel."
        />

        {/* Redis / Backend */}
        <SettingsSection
          icon="⚙️"
          title="Backend & Queue"
          color="orange"
          vars={[
            {
              name: 'DATABASE_URL',
              description: 'PostgreSQL connection string.',
              example: 'postgres://user:pass@localhost:5432/solnotify',
            },
            {
              name: 'REDIS_URL',
              description: 'Redis URL used by BullMQ for background jobs.',
              example: 'redis://localhost:6379',
            },
            {
              name: 'PORT',
              description: 'Port the backend API listens on.',
              example: '3001',
            },
          ]}
          docs={null}
          docsLabel={null}
        />
      </div>
    </main>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

const COLOR_MAP: Record<
  string,
  { border: string; bg: string; iconBg: string; badge: string }
> = {
  blue: {
    border: 'border-blue-200 dark:border-blue-800',
    bg: 'bg-blue-50 dark:bg-blue-900/10',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  },
  green: {
    border: 'border-green-200 dark:border-green-800',
    bg: 'bg-green-50 dark:bg-green-900/10',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  },
  sky: {
    border: 'border-sky-200 dark:border-sky-800',
    bg: 'bg-sky-50 dark:bg-sky-900/10',
    iconBg: 'bg-sky-100 dark:bg-sky-900/30',
    badge: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
  },
  purple: {
    border: 'border-purple-200 dark:border-purple-800',
    bg: 'bg-purple-50 dark:bg-purple-900/10',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  },
  orange: {
    border: 'border-orange-200 dark:border-orange-800',
    bg: 'bg-orange-50 dark:bg-orange-900/10',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    badge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  },
};

interface EnvVar {
  name: string;
  description: string;
  example: string;
}

interface SettingsSectionProps {
  icon: string;
  title: string;
  color: string;
  vars: EnvVar[];
  docs: string | null;
  docsLabel: string | null;
  steps?: string[];
  note?: string;
}

function SettingsSection({
  icon,
  title,
  color,
  vars,
  docs,
  docsLabel,
  steps,
  note,
}: SettingsSectionProps) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.blue;

  return (
    <div
      className={`rounded-2xl border ${c.border} ${c.bg} p-6 flex flex-col gap-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`text-2xl p-2 rounded-xl ${c.iconBg}`}>{icon}</span>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        </div>
        {docs && docsLabel && (
          <a
            href={docs}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-semibold px-3 py-1.5 rounded-full ${c.badge} hover:opacity-80 transition-opacity`}
          >
            {docsLabel} ↗
          </a>
        )}
      </div>

      {note && (
        <p className="text-sm text-gray-600 dark:text-gray-400 italic">{note}</p>
      )}

      {vars.length > 0 && (
        <div className="flex flex-col gap-3">
          {vars.map((v) => (
            <div
              key={v.name}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-start justify-between gap-4 mb-1">
                <code className="text-sm font-mono font-bold text-gray-900 dark:text-gray-100">
                  {v.name}
                </code>
                <span className="text-xs text-gray-400 shrink-0">env var</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {v.description}
              </p>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg px-3 py-2">
                <code className="text-xs font-mono text-gray-500 dark:text-gray-400">
                  {v.name}=<span className="text-gray-400">{v.example}</span>
                </code>
              </div>
            </div>
          ))}
        </div>
      )}

      {steps && steps.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Setup Steps:
          </p>
          <ol className="flex flex-col gap-1.5 list-none">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="shrink-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

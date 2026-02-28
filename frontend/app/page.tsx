import Link from 'next/link';

const FEATURES = [
  {
    icon: '💸',
    title: 'Wallet Transfers',
    description:
      'Get instant alerts whenever SOL moves in or out of any wallet you monitor.',
  },
  {
    icon: '🖼️',
    title: 'NFT Sales',
    description:
      'Track NFT sales across all major marketplaces — never miss a floor sweep.',
  },
  {
    icon: '📊',
    title: 'DeFi Monitoring',
    description:
      'Monitor liquidity positions, liquidation risks, and yield changes in real time.',
  },
  {
    icon: '🪙',
    title: 'Token Price Alerts',
    description:
      'Set price thresholds for any SPL token and get notified when they hit.',
  },
];

const STEPS = [
  {
    step: '01',
    title: 'Connect your wallet',
    description:
      'Sign in with your Solana wallet or use a demo account to get started in seconds.',
  },
  {
    step: '02',
    title: 'Set up subscriptions',
    description:
      'Choose events to watch, set thresholds, and pick your preferred notification channel.',
  },
  {
    step: '03',
    title: 'Get instant alerts',
    description:
      'Receive real-time notifications via email, SMS, Telegram, or Discord the moment events fire.',
  },
];

const CHANNELS = [
  { icon: '✉️', name: 'Email' },
  { icon: '📱', name: 'SMS' },
  { icon: '✈️', name: 'Telegram' },
  { icon: '🎮', name: 'Discord' },
  { icon: '🔗', name: 'Webhooks' },
];

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    highlight: false,
    features: [
      '100 notifications / month',
      '3 active subscriptions',
      'Email channel',
      'Community support',
    ],
    cta: 'Get Started Free',
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    highlight: true,
    features: [
      '5,000 notifications / month',
      'Unlimited subscriptions',
      'All channels (Email, SMS, Telegram, Discord)',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
  },
  {
    name: 'Business',
    price: '$29',
    period: '/month',
    highlight: false,
    features: [
      'Unlimited notifications',
      'Unlimited subscriptions',
      'All channels + Webhooks',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
  },
];

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-brand-600 to-purple-700 text-white py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-brand-200 text-sm font-semibold tracking-widest uppercase mb-4">
            Solana Push Notifications
          </p>
          <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
            Never Miss an<br />
            On-Chain Event
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto mb-10">
            Real-time alerts for wallet transfers, NFT sales, DeFi positions, and
            token price movements — delivered directly to your inbox, phone, or
            favourite chat app.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/subscriptions/new"
              className="bg-white text-brand-700 font-bold px-8 py-3.5 rounded-xl hover:bg-brand-50 transition-colors shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/dashboard"
              className="border-2 border-white/60 text-white font-bold px-8 py-3.5 rounded-xl hover:border-white hover:bg-white/10 transition-colors"
            >
              View Dashboard →
            </Link>
          </div>
        </div>
        {/* decorative blobs */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="py-24 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Monitor Every On-Chain Event
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              From simple wallet watches to complex DeFi position tracking, SolNotify
              has you covered.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Up and Running in Minutes
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Three simple steps to start receiving real-time on-chain alerts.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-brand-500/30">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                  {s.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Channels ─────────────────────────────────────── */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Deliver Alerts Your Way
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-12">
            Pick the notification channel that fits your workflow.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {CHANNELS.map((c) => (
              <div
                key={c.name}
                className="flex flex-col items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl px-8 py-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-4xl">{c.icon}</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────── */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Start free. Upgrade when you need more.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 flex flex-col gap-6 ${
                  plan.highlight
                    ? 'bg-brand-600 text-white shadow-2xl shadow-brand-500/40 scale-105'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div>
                  <p
                    className={`font-semibold text-sm mb-1 ${
                      plan.highlight ? 'text-brand-200' : 'text-brand-600 dark:text-brand-400'
                    }`}
                  >
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span
                      className={`text-sm mb-1 ${plan.highlight ? 'text-brand-200' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="flex flex-col gap-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className={plan.highlight ? 'text-brand-200' : 'text-green-500'}>
                        ✓
                      </span>
                      <span
                        className={
                          plan.highlight ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/subscriptions/new"
                  className={`text-center font-bold py-3 rounded-xl transition-colors ${
                    plan.highlight
                      ? 'bg-white text-brand-700 hover:bg-brand-50'
                      : 'bg-brand-600 text-white hover:bg-brand-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="py-24 px-4 bg-gradient-to-br from-brand-600 to-purple-700 text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
          Set Up Your First Alert
        </h2>
        <p className="text-brand-100 mb-10 max-w-lg mx-auto">
          Join thousands of Solana users who trust SolNotify to keep them informed
          about the events that matter most.
        </p>
        <Link
          href="/subscriptions/new"
          className="inline-block bg-white text-brand-700 font-bold px-10 py-4 rounded-xl hover:bg-brand-50 transition-colors shadow-lg"
        >
          Get Started Free
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔔</span>
            <span className="font-bold text-white text-lg">SolNotify</span>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm">
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/subscriptions/new" className="hover:text-white transition-colors">
              New Alert
            </Link>
            <Link href="/notifications" className="hover:text-white transition-colors">
              Notifications
            </Link>
            <Link href="/settings" className="hover:text-white transition-colors">
              Settings
            </Link>
          </nav>
          <p className="text-sm">© {new Date().getFullYear()} SolNotify</p>
        </div>
      </footer>
    </main>
  );
}

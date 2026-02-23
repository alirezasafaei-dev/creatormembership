function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var: ${name}`);
  return value;
}

function parseCsv(value: string | undefined, fallback: string[]): string[] {
  const raw = String(value || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);
  return raw.length ? raw : fallback;
}

export const config = {
  port: Number(process.env.PORT || 4000),
  host: process.env.HOST || '127.0.0.1',
  databaseUrl: process.env.DATABASE_URL || '',
  sessionSecret: process.env.SESSION_SECRET || 'dev-insecure-session-secret',
  adminApiKey: process.env.ADMIN_API_KEY || '',
  paymentGateway: process.env.PAYMENT_GATEWAY || 'mock',
  paymentGatewayBaseUrl: process.env.PAYMENT_GATEWAY_BASE_URL || '',
  paymentGatewayWebhookSecret: process.env.PAYMENT_GATEWAY_WEBHOOK_SECRET || '',
  paymentGatewayTimeoutMs: Number(process.env.PAYMENT_GATEWAY_TIMEOUT_MS || 5000),
  contentStorageRoot: process.env.CONTENT_STORAGE_ROOT || '/tmp/asdev-content',
  corsAllowOrigins: parseCsv(process.env.CORS_ALLOW_ORIGINS, [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'http://127.0.0.1:4000',
    'http://localhost:4000',
  ]),
  csrfEnabled: String(process.env.CSRF_ENABLED || '1') !== '0',
  required,
};

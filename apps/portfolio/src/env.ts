/**
 * Validates required environment variables at startup.
 * Called from next.config.ts and payload.config.ts entry points.
 */
export function validateProductionEnv(): void {
  const isProduction = process.env.VERCEL_ENV === 'production'

  if (!isProduction) return

  const required = [
    'PAYLOAD_SECRET',
    'MONGODB_URI',
    'PREVIEW_SECRET',
    'CRON_SECRET',
    'REVALIDATE_SECRET',
  ] as const

  const missing = required.filter((key) => !process.env[key]?.trim())

  if (missing.length > 0) {
    throw new Error(
      `Missing required production environment variables: ${missing.join(', ')}`,
    )
  }

  if (process.env.VERCEL === '1') {
    const r2Required = [
      'R2_BUCKET',
      'R2_ACCESS_KEY_ID',
      'R2_SECRET_ACCESS_KEY',
      'R2_ENDPOINT',
      'R2_PUBLIC_URL',
    ] as const

    const missingR2 = r2Required.filter((key) => !process.env[key]?.trim())

    if (missingR2.length > 0) {
      throw new Error(
        `Missing required R2 environment variables on Vercel: ${missingR2.join(', ')}`,
      )
    }
  }

  const seedPassword = process.env.SEED_ADMIN_PASSWORD
  if (seedPassword === 'changeme' || !seedPassword) {
    throw new Error(
      'SEED_ADMIN_PASSWORD must be set to a secure value in production (not "changeme").',
    )
  }
}

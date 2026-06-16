declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      MONGODB_URI: string
      NEXT_PUBLIC_SERVER_URL: string
      PRODUCTION_URLS?: string
      VERCEL_URL?: string
      VERCEL_PROJECT_PRODUCTION_URL?: string
      VERCEL_ENV?: string
      VERCEL?: string
      CRON_SECRET?: string
      PREVIEW_SECRET?: string
      REVALIDATE_SECRET?: string
      SEED_ADMIN_EMAIL?: string
      SEED_ADMIN_PASSWORD?: string
      RESEND_API_KEY?: string
      RESEND_FROM_EMAIL?: string
      RESEND_FROM_NAME?: string
      R2_BUCKET?: string
      R2_ACCESS_KEY_ID?: string
      R2_SECRET_ACCESS_KEY?: string
      R2_ENDPOINT?: string
      R2_PUBLIC_URL?: string
      JOURNEYS_REVALIDATE_URL?: string
      JOURNEYS_SITE_URL?: string
    }
  }
}

export {}

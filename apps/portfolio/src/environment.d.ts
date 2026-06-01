declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      NEXT_PUBLIC_SERVER_URL: string
      PRODUCTION_URLS?: string
      VERCEL_URL?: string
      VERCEL_PROJECT_PRODUCTION_URL?: string
    }
  }
}

export {}

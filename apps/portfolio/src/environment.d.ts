declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      MONGODB_URI: string
      NEXT_PUBLIC_SERVER_URL: string
      PRODUCTION_URLS?: string
      VERCEL_URL?: string
      VERCEL_PROJECT_PRODUCTION_URL?: string
    }
  }
}

export {}

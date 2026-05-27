declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      DATABASE_URL: string
      NEXT_PUBLIC_SERVER_URL: string
      RAILWAY_PROJECT_PRODUCTION_URLS: string
    }
  }
}

export {}

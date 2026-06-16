import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest, type SharpDependency } from 'payload'
import { fileURLToPath } from 'url'

import { isAdmin } from './access/isAdmin'
import type { User } from '@repo/payload-types'
import { validateProductionEnv } from './env'

import { Experiences } from './collections/Experiences'
import { Articles } from './collections/Articles'
import { GalleryCollections } from './collections/GalleryCollections'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { Vehicles } from './collections/Vehicles'
import { GallerySettings } from './globals/GallerySettings/config'
import { JourneysSettings } from './globals/JourneysSettings/config'
import { SiteSettings } from './globals/SiteSettings/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getAllowedOrigins } from './utilities/siteURLs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const allowedOrigins = getAllowedOrigins()

validateProductionEnv()

export default buildConfig({
  cors: allowedOrigins,
  csrf: allowedOrigins,
  admin: {
    ...(process.env.NODE_ENV === 'development' && {
      autoLogin: {
        email: process.env.SEED_ADMIN_EMAIL || 'admin@example.com',
        password: process.env.SEED_ADMIN_PASSWORD || 'changeme',
      },
    }),
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  editor: defaultLexical,
  email: resendAdapter({
    defaultFromAddress: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
    defaultFromName: process.env.RESEND_FROM_NAME || 'Portfolio',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
    connectOptions: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    },
  }),
  graphQL: {
    disable: true,
  },
  collections: [
    Pages,
    Posts,
    Articles,
    Tags,
    GalleryCollections,
    Vehicles,
    Experiences,
    Media,
    Users,
  ],
  globals: [SiteSettings, JourneysSettings, GallerySettings],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp: sharp as unknown as SharpDependency,
  typescript: {
    outputFile: path.resolve(dirname, '../../../packages/payload-types/payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return isAdmin(req.user as User)
        const secret = process.env.CRON_SECRET
        if (!secret) return false
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})

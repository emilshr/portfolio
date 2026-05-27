import { generateRSS } from '@/utilities/generateFeed'

export const dynamic = 'force-dynamic'

export async function GET() {
  return generateRSS()
}

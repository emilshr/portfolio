import { NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export async function GET(
  _request: Request,
  _context: { params: Promise<{ route: string[] }> },
) {
  const defaultOg = path.resolve(dirname, '../../../../../public/og/chiri-og.png')

  if (fs.existsSync(defaultOg)) {
    const buffer = fs.readFileSync(defaultOg)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    })
  }

  return new NextResponse('Not found', { status: 404 })
}

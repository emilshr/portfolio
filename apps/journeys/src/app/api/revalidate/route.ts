import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

type RevalidateBody = {
  tags?: string[]
}

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret')
  const expected = process.env.REVALIDATE_SECRET

  if (!expected || secret !== expected) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  let body: RevalidateBody = {}

  try {
    body = (await request.json()) as RevalidateBody
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const tags = body.tags ?? []

  for (const tag of tags) {
    revalidateTag(tag, 'max')
  }

  return NextResponse.json({ revalidated: true, tags })
}

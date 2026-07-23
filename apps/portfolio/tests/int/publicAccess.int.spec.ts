import { getPayload, type Payload } from 'payload'
import config from '@/payload.config'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { PUBLIC_PAYLOAD_QUERY } from '@/utilities/payloadPublicQuery'

let payload: Payload
let draftPostId: string | undefined

describe('public Local API access', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const created = await payload.create({
      collection: 'posts',
      draft: true,
      context: { disableRevalidate: true },
      data: {
        title: 'Draft-only public access test',
        slug: `draft-public-access-${Date.now()}`,
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: 'Draft body',
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        },
      },
    })
    draftPostId = created.id
  })

  afterAll(async () => {
    if (draftPostId) {
      await payload.delete({
        collection: 'posts',
        id: draftPostId,
        overrideAccess: true,
        context: { disableRevalidate: true },
      })
    }
  })

  it('does not return draft posts with PUBLIC_PAYLOAD_QUERY', async () => {
    const result = await payload.find({
      collection: 'posts',
      where: { id: { equals: draftPostId } },
      limit: 1,
      ...PUBLIC_PAYLOAD_QUERY,
    })

    expect(result.docs).toHaveLength(0)
  })

  it('does not return drafts when draft:true but overrideAccess:false without user', async () => {
    const result = await payload.find({
      collection: 'posts',
      draft: true,
      overrideAccess: false,
      where: { id: { equals: draftPostId } },
      limit: 1,
    })

    expect(result.docs).toHaveLength(0)
  })
})

import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('payload', () => ({
  createLocalReq: vi.fn(),
  getPayload: vi.fn(),
}))

vi.mock('@payload-config', () => ({
  default: Promise.resolve({}),
}))

vi.mock('next/headers', () => ({
  headers: vi.fn(async () => new Headers()),
}))

vi.mock('@/endpoints/seed', () => ({
  seed: vi.fn(),
}))

vi.mock('@/access/isAdmin', () => ({
  isAdmin: vi.fn((user: { roles?: string[] } | null) =>
    Boolean(user?.roles?.includes('admin')),
  ),
}))

describe('POST /next/seed', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('returns 404 in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    const { POST } = await import('@/app/(frontend)/next/seed/route')
    const response = await POST()
    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Not found')
  })

  it('returns 403 for non-admin users in development', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({
      auth: vi.fn(async () => ({ user: { id: '1', roles: ['editor'] } })),
      logger: { error: vi.fn() },
    } as never)

    const { POST } = await import('@/app/(frontend)/next/seed/route')
    const response = await POST()
    expect(response.status).toBe(403)
    expect(await response.text()).toBe('Action forbidden.')
  })

  it('returns 403 when unauthenticated in development', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const { getPayload } = await import('payload')
    vi.mocked(getPayload).mockResolvedValue({
      auth: vi.fn(async () => ({ user: null })),
      logger: { error: vi.fn() },
    } as never)

    const { POST } = await import('@/app/(frontend)/next/seed/route')
    const response = await POST()
    expect(response.status).toBe(403)
  })
})

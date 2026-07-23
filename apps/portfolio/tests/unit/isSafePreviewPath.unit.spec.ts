import { describe, expect, it } from 'vitest'

import { getSafePreviewRedirect, isSafePreviewPath } from '@/utilities/isSafePreviewPath'

const ORIGIN = 'https://emilshr.com'

describe('isSafePreviewPath / getSafePreviewRedirect', () => {
  it('allows same-origin relative paths', () => {
    expect(isSafePreviewPath('/', ORIGIN)).toBe(true)
    expect(isSafePreviewPath('/about', ORIGIN)).toBe(true)
    expect(getSafePreviewRedirect('/posts?x=1#top', ORIGIN)).toBe('/posts?x=1#top')
  })

  it('rejects protocol-relative open redirects', () => {
    expect(isSafePreviewPath('//evil.example', ORIGIN)).toBe(false)
    expect(isSafePreviewPath('//evil.example/path', ORIGIN)).toBe(false)
    expect(getSafePreviewRedirect('//evil.example', ORIGIN)).toBeNull()
  })

  it('rejects backslash and absolute off-site URLs', () => {
    expect(isSafePreviewPath('/\\evil.example', ORIGIN)).toBe(false)
    expect(isSafePreviewPath('https://evil.example/path', ORIGIN)).toBe(false)
    expect(isSafePreviewPath('http://evil.example', ORIGIN)).toBe(false)
  })

  it('rejects paths that do not start with /', () => {
    expect(isSafePreviewPath('about', ORIGIN)).toBe(false)
    expect(isSafePreviewPath('', ORIGIN)).toBe(false)
  })
})

import { cleanup, fireEvent, render, within } from '@testing-library/react'
import type { Media } from '@repo/payload-types'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AboutAvatar } from '@/blocks/About/Avatar.client'

vi.mock('@/components/Media/ImageMedia', () => ({
  ImageMedia: ({
    onLoad,
    onError,
    resource,
  }: {
    onLoad?: () => void
    onError?: () => void
    resource?: Media
  }) => (
    <div>
      <button type="button" onClick={() => onLoad?.()}>
        complete-load
      </button>
      <button type="button" onClick={() => onError?.()}>
        trigger-error
      </button>
      <span data-testid="avatar-alt">{resource?.alt}</span>
    </div>
  ),
}))

const avatar = {
  id: 'avatar-1',
  alt: 'Portrait of Emil',
  updatedAt: '2026-01-01T00:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  url: '/api/media/file/avatar.jpg',
  width: 256,
  height: 256,
} as Media

afterEach(() => {
  cleanup()
})

describe('AboutAvatar', () => {
  it('shows a loading status while the image is loading', () => {
    const { container } = render(<AboutAvatar avatar={avatar} />)

    const status = within(container).getByRole('status')
    expect(status.textContent).toContain('Loading avatar')
    expect(container.querySelector('[aria-busy="true"]')).not.toBeNull()
  })

  it('hides the spinner after the image loads', () => {
    const { container } = render(<AboutAvatar avatar={avatar} />)

    fireEvent.click(within(container).getByRole('button', { name: 'complete-load' }))

    expect(within(container).queryByRole('status')).toBeNull()
    expect(container.querySelector('[aria-busy="false"]')).not.toBeNull()
  })

  it('hides the spinner when the image fails to load', () => {
    const { container } = render(<AboutAvatar avatar={avatar} />)

    fireEvent.click(within(container).getByRole('button', { name: 'trigger-error' }))

    expect(within(container).queryByRole('status')).toBeNull()
    expect(container.querySelector('[aria-busy="false"]')).not.toBeNull()
  })
})

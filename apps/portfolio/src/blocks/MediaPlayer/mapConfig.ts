import type { MediaPlayerBlock } from '@repo/payload-types'
import {
  mapMediaPlayerBlockFields,
  type MediaPlayerBlockConfig,
} from '@repo/ui/lib/media-player-block'

export function mapMediaPlayerBlockToConfig(
  block: MediaPlayerBlock,
): MediaPlayerBlockConfig {
  return mapMediaPlayerBlockFields(block)
}

export type MediaPlayerKind = 'video' | 'audio'

export type MediaPlayerKindConfig = 'auto' | MediaPlayerKind

export type MediaPlayerTimeVariant = 'current' | 'duration' | 'remaining'

export type MediaPlayerMaxWidth = 'full' | 'content' | 'narrow'

export type MediaPlayerControlsConfig = {
  play?: boolean
  seekBackward?: boolean
  seekForward?: boolean
  volume?: boolean
  seek?: boolean
  time?: boolean
  controlsOverlay?: boolean
  loading?: boolean
  error?: boolean
  volumeIndicator?: boolean
  playbackSpeed?: boolean
  loop?: boolean
  captions?: boolean
  pip?: boolean
  fullscreen?: boolean
  download?: boolean
  settings?: boolean
}

export type MediaPlayerPlayerConfig = {
  autoHide?: boolean
  disabled?: boolean
  withoutTooltip?: boolean
  tooltipSideOffset?: number | null
  tooltipDelayDuration?: number | null
  label?: string | null
}

export type MediaPlayerControlOptionsConfig = {
  seekBackwardSeconds?: number | null
  seekForwardSeconds?: number | null
  seekWithTime?: boolean
  seekWithoutTooltip?: boolean
  volumeExpandable?: boolean
  timeVariant?: MediaPlayerTimeVariant
  playbackSpeeds?: string | null
  settingsSpeeds?: string | null
  loadingDelay?: number | null
}

export type MediaPlayerLayoutConfig = {
  maxWidth?: MediaPlayerMaxWidth
}

export type MediaPlayerBlockConfig = {
  playerKind?: MediaPlayerKindConfig
  player?: MediaPlayerPlayerConfig
  controls?: MediaPlayerControlsConfig
  controlOptions?: MediaPlayerControlOptionsConfig
  layout?: MediaPlayerLayoutConfig
}

export const DEFAULT_MEDIA_PLAYER_CONTROLS: Required<MediaPlayerControlsConfig> = {
  play: true,
  seekBackward: true,
  seekForward: true,
  volume: true,
  seek: true,
  time: true,
  controlsOverlay: true,
  loading: true,
  error: true,
  volumeIndicator: true,
  playbackSpeed: false,
  loop: false,
  captions: false,
  pip: false,
  fullscreen: false,
  download: false,
  settings: false,
}

export const DEFAULT_PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

export function resolvePlayerKind(
  mimeType: string | null | undefined,
  configKind: MediaPlayerKindConfig = 'auto',
): MediaPlayerKind {
  if (configKind === 'video' || configKind === 'audio') {
    return configKind
  }

  if (mimeType?.includes('audio')) {
    return 'audio'
  }

  return 'video'
}

export function parseSpeeds(value: string | number[] | null | undefined): number[] {
  if (Array.isArray(value)) {
    const parsed = value.filter((n) => typeof n === 'number' && Number.isFinite(n) && n > 0)
    if (parsed.length > 0) return parsed
  }

  if (typeof value === 'string' && value.trim()) {
    const parsed = value
      .split(/[,;\s]+/)
      .map((part) => Number.parseFloat(part.trim()))
      .filter((n) => Number.isFinite(n) && n > 0)
    if (parsed.length > 0) return parsed
  }

  return [...DEFAULT_PLAYBACK_SPEEDS]
}

export function resolveControls(
  controls?: MediaPlayerControlsConfig,
): Required<MediaPlayerControlsConfig> {
  return {
    ...DEFAULT_MEDIA_PLAYER_CONTROLS,
    ...controls,
  }
}

export function mapTimeVariantToPlayer(
  variant: MediaPlayerTimeVariant = 'current',
): 'progress' | 'duration' | 'remaining' {
  if (variant === 'duration' || variant === 'remaining') {
    return variant
  }

  return 'progress'
}

export function mediaPlayerWrapperClassName(
  maxWidth: MediaPlayerMaxWidth = 'content',
): string {
  switch (maxWidth) {
    case 'full':
      return 'w-full'
    case 'narrow':
      return 'mx-auto w-full max-w-2xl'
    case 'content':
    default:
      return 'mx-auto w-full max-w-4xl'
  }
}

type Nullable<T> = {
  [K in keyof T]?: T[K] | null
}

/** CMS field shape for a media player block (Payload or other sources). */
export type MediaPlayerBlockFields = {
  playerKind?: MediaPlayerKindConfig | null
  player?: Nullable<MediaPlayerPlayerConfig> | null
  controls?: Nullable<MediaPlayerControlsConfig> | null
  controlOptions?: Nullable<MediaPlayerControlOptionsConfig> | null
  layout?: Nullable<MediaPlayerLayoutConfig> | null
}

function resolveControlsFromFields(
  controls: MediaPlayerBlockFields['controls'],
): MediaPlayerControlsConfig | undefined {
  if (!controls) return undefined

  const resolved: MediaPlayerControlsConfig = {}
  for (const [key, value] of Object.entries(controls) as [
    keyof MediaPlayerControlsConfig,
    boolean | null | undefined,
  ][]) {
    if (value != null) {
      resolved[key] = value
    }
  }

  return resolved
}

export function mapMediaPlayerBlockFields(
  block: MediaPlayerBlockFields,
): MediaPlayerBlockConfig {
  return {
    playerKind: block.playerKind ?? 'auto',
    player: block.player
      ? {
          autoHide: block.player.autoHide ?? true,
          disabled: block.player.disabled ?? false,
          withoutTooltip: block.player.withoutTooltip ?? false,
          tooltipSideOffset: block.player.tooltipSideOffset ?? undefined,
          tooltipDelayDuration: block.player.tooltipDelayDuration ?? undefined,
          label: block.player.label ?? undefined,
        }
      : undefined,
    controls: resolveControlsFromFields(block.controls),
    controlOptions: block.controlOptions
      ? {
          seekBackwardSeconds: block.controlOptions.seekBackwardSeconds ?? undefined,
          seekForwardSeconds: block.controlOptions.seekForwardSeconds ?? undefined,
          seekWithTime: block.controlOptions.seekWithTime ?? false,
          seekWithoutTooltip: block.controlOptions.seekWithoutTooltip ?? false,
          volumeExpandable: block.controlOptions.volumeExpandable ?? true,
          timeVariant: block.controlOptions.timeVariant ?? 'current',
          playbackSpeeds: block.controlOptions.playbackSpeeds ?? undefined,
          settingsSpeeds: block.controlOptions.settingsSpeeds ?? undefined,
          loadingDelay: block.controlOptions.loadingDelay ?? undefined,
        }
      : undefined,
    layout: block.layout
      ? {
          maxWidth: block.layout.maxWidth ?? 'content',
        }
      : undefined,
  }
}

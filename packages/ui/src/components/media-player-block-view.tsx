'use client'

import {
  MediaPlayer,
  MediaPlayerAudio,
  MediaPlayerCaptions,
  MediaPlayerControls,
  MediaPlayerControlsOverlay,
  MediaPlayerDownload,
  MediaPlayerError,
  MediaPlayerFullscreen,
  MediaPlayerLoading,
  MediaPlayerLoop,
  MediaPlayerPiP,
  MediaPlayerPlay,
  MediaPlayerPlaybackSpeed,
  MediaPlayerSeek,
  MediaPlayerSeekBackward,
  MediaPlayerSeekForward,
  MediaPlayerSettings,
  MediaPlayerTime,
  MediaPlayerVideo,
  MediaPlayerVolume,
} from './media-player'
import {
  mapTimeVariantToPlayer,
  mediaPlayerWrapperClassName,
  parseSpeeds,
  resolveControls,
  resolvePlayerKind,
  type MediaPlayerBlockConfig,
} from '../lib/media-player-block'

export type MediaPlayerBlockViewProps = {
  src: string
  mimeType?: string | null
  config?: MediaPlayerBlockConfig
  className?: string
}

export function MediaPlayerBlockView({
  src,
  mimeType,
  config,
  className,
}: MediaPlayerBlockViewProps) {
  const kind = resolvePlayerKind(mimeType, config?.playerKind ?? 'auto')
  const isVideo = kind === 'video'
  const player = config?.player ?? {}
  const controls = resolveControls(config?.controls)
  const options = config?.controlOptions ?? {}
  const speeds = parseSpeeds(options.playbackSpeeds)
  const settingsSpeeds = parseSpeeds(options.settingsSpeeds ?? options.playbackSpeeds)
  const timeVariant = mapTimeVariantToPlayer(options.timeVariant ?? 'current')

  const hasControlsBar = Object.entries(controls).some(
    ([key, enabled]) =>
      enabled &&
      key !== 'loading' &&
      key !== 'error' &&
      key !== 'volumeIndicator' &&
      key !== 'controlsOverlay',
  )

  return (
    <div
      className={mediaPlayerWrapperClassName(config?.layout?.maxWidth ?? 'content')}
    >
      <MediaPlayer
        className={className}
        autoHide={player.autoHide ?? true}
        disabled={player.disabled ?? false}
        withoutTooltip={player.withoutTooltip ?? false}
        tooltipSideOffset={player.tooltipSideOffset ?? undefined}
        tooltipDelayDuration={player.tooltipDelayDuration ?? undefined}
        label={player.label ?? undefined}
      >
        {isVideo ? (
          <MediaPlayerVideo>
            <source src={src} type={mimeType ?? undefined} />
          </MediaPlayerVideo>
        ) : (
          <MediaPlayerAudio>
            <source src={src} type={mimeType ?? undefined} />
          </MediaPlayerAudio>
        )}

        {controls.loading && (
          <MediaPlayerLoading
            delayMs={options.loadingDelay ?? undefined}
          />
        )}
        {controls.error && <MediaPlayerError />}

        {hasControlsBar && (
          <MediaPlayerControls>
            {controls.controlsOverlay && <MediaPlayerControlsOverlay />}
            {controls.play && <MediaPlayerPlay />}
            {controls.seekBackward && (
              <MediaPlayerSeekBackward
                seconds={options.seekBackwardSeconds ?? 10}
              />
            )}
            {controls.seekForward && (
              <MediaPlayerSeekForward seconds={options.seekForwardSeconds ?? 10} />
            )}
            {controls.volume && (
              <MediaPlayerVolume expandable={options.volumeExpandable ?? true} />
            )}
            {controls.seek && (
              <MediaPlayerSeek
                withTime={options.seekWithTime ?? false}
                withoutTooltip={options.seekWithoutTooltip ?? false}
              />
            )}
            {controls.time && <MediaPlayerTime variant={timeVariant} />}
            {controls.playbackSpeed && (
              <MediaPlayerPlaybackSpeed speeds={speeds} />
            )}
            {controls.loop && <MediaPlayerLoop />}
            {isVideo && controls.captions && <MediaPlayerCaptions />}
            {isVideo && controls.pip && <MediaPlayerPiP />}
            {isVideo && controls.fullscreen && <MediaPlayerFullscreen />}
            {controls.download && <MediaPlayerDownload />}
            {controls.settings && (
              <MediaPlayerSettings speeds={settingsSpeeds} />
            )}
          </MediaPlayerControls>
        )}
      </MediaPlayer>
    </div>
  )
}

import type { Block, Field } from 'payload'

const controlCheckbox = (
  name: string,
  label: string,
  defaultValue: boolean,
  description?: string,
): Field => ({
  name,
  type: 'checkbox',
  label,
  defaultValue,
  ...(description ? { admin: { description } } : {}),
})

export const MediaPlayerBlock: Block = {
  slug: 'mediaPlayer',
  interfaceName: 'MediaPlayerBlock',
  labels: {
    singular: 'Media Player',
    plural: 'Media Players',
  },
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: {
        or: [{ mimeType: { contains: 'video' } }, { mimeType: { contains: 'audio' } }],
      },
    },
    {
      name: 'playerKind',
      type: 'select',
      label: 'Player type',
      defaultValue: 'auto',
      options: [
        { label: 'Auto (from file)', value: 'auto' },
        { label: 'Video', value: 'video' },
        { label: 'Audio', value: 'audio' },
      ],
      required: true,
    },
    {
      name: 'player',
      type: 'group',
      label: 'Player options',
      fields: [
        {
          name: 'autoHide',
          type: 'checkbox',
          label: 'Auto-hide controls',
          defaultValue: true,
        },
        {
          name: 'disabled',
          type: 'checkbox',
          label: 'Disabled',
          defaultValue: false,
        },
        {
          name: 'withoutTooltip',
          type: 'checkbox',
          label: 'Hide control tooltips',
          defaultValue: false,
        },
        {
          name: 'tooltipSideOffset',
          type: 'number',
          label: 'Tooltip side offset',
          admin: {
            description: 'Leave empty for the player default.',
          },
        },
        {
          name: 'tooltipDelayDuration',
          type: 'number',
          label: 'Tooltip delay (ms)',
          admin: {
            description: 'Leave empty for the player default.',
          },
        },
        {
          name: 'label',
          type: 'text',
          label: 'Accessible label',
          admin: {
            description: 'Screen reader label for the player region.',
          },
        },
      ],
    },
    {
      name: 'controls',
      type: 'group',
      label: 'Controls',
      admin: {
        description: 'Choose which controls appear in the player bar.',
      },
      fields: [
        controlCheckbox('play', 'Play / pause', true),
        controlCheckbox('seekBackward', 'Seek backward', true),
        controlCheckbox('seekForward', 'Seek forward', true),
        controlCheckbox('volume', 'Volume', true),
        controlCheckbox('seek', 'Seek bar', true),
        controlCheckbox('time', 'Time display', true),
        controlCheckbox('controlsOverlay', 'Controls overlay', true),
        controlCheckbox('loading', 'Loading indicator', true),
        controlCheckbox('error', 'Error state', true),
        controlCheckbox(
          'volumeIndicator',
          'Volume indicator (keyboard)',
          true,
          'Shown briefly when volume changes via keyboard.',
        ),
        controlCheckbox('playbackSpeed', 'Playback speed', false),
        controlCheckbox('loop', 'Loop', false),
        controlCheckbox(
          'captions',
          'Captions',
          false,
          'Requires WebVTT tracks on the media file. Video only.',
        ),
        controlCheckbox('pip', 'Picture-in-picture', false, 'Video only.'),
        controlCheckbox('fullscreen', 'Fullscreen', false, 'Video only.'),
        controlCheckbox('download', 'Download', false),
        controlCheckbox('settings', 'Settings menu', false),
      ],
    },
    {
      name: 'controlOptions',
      type: 'group',
      label: 'Control options',
      fields: [
        {
          name: 'seekBackwardSeconds',
          type: 'number',
          label: 'Seek backward (seconds)',
          defaultValue: 10,
          min: 1,
        },
        {
          name: 'seekForwardSeconds',
          type: 'number',
          label: 'Seek forward (seconds)',
          defaultValue: 10,
          min: 1,
        },
        {
          name: 'seekWithTime',
          type: 'checkbox',
          label: 'Seek bar with inline time',
          defaultValue: false,
        },
        {
          name: 'seekWithoutTooltip',
          type: 'checkbox',
          label: 'Seek bar without hover tooltip',
          defaultValue: false,
        },
        {
          name: 'volumeExpandable',
          type: 'checkbox',
          label: 'Expandable volume slider',
          defaultValue: true,
        },
        {
          name: 'timeVariant',
          type: 'select',
          label: 'Time display',
          defaultValue: 'current',
          options: [
            { label: 'Current / duration', value: 'current' },
            { label: 'Duration only', value: 'duration' },
            { label: 'Remaining', value: 'remaining' },
          ],
          required: true,
        },
        {
          name: 'playbackSpeeds',
          type: 'text',
          label: 'Playback speeds',
          defaultValue: '0.5, 0.75, 1, 1.25, 1.5, 2',
          admin: {
            description: 'Comma-separated values for the playback speed control.',
          },
        },
        {
          name: 'settingsSpeeds',
          type: 'text',
          label: 'Settings menu speeds',
          admin: {
            description:
              'Comma-separated values for the settings menu. Falls back to playback speeds.',
          },
        },
        {
          name: 'loadingDelay',
          type: 'number',
          label: 'Loading indicator delay (ms)',
          admin: {
            description: 'Leave empty for the player default.',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'group',
      label: 'Layout',
      fields: [
        {
          name: 'maxWidth',
          type: 'select',
          label: 'Max width',
          defaultValue: 'content',
          options: [
            { label: 'Full width', value: 'full' },
            { label: 'Content width', value: 'content' },
            { label: 'Narrow', value: 'narrow' },
          ],
          required: true,
        },
      ],
    },
  ],
}

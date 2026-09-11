import type { Meta, StoryObj } from '@storybook/react-vite';
import TwitchPlayer from '../../src/components/TwitchPlayer';
import { DEFAULTS } from '../../src/constants';
import { STORYBOOK_DEFAULTS } from '../defaults';
import withAutoplayWarning from '../helpers/withAutoplayWarning';
import withNextMediaControls from '../helpers/withNextMediaControls';
import withVideoControls from '../helpers/withVideoControls';

const meta: Meta = {
  title: 'Examples/TwitchPlayer',
  component: withAutoplayWarning(TwitchPlayer),
  argTypes: {
    channel: {
      control: 'text',
      description: 'The name of the channel to embed their stream.',
      table: {
        type: { summary: 'string' }
      }
    },
    video: {
      control: 'text',
      description: 'The ID of the video to embed.',
      table: {
        type: { summary: 'string' }
      }
    },
    collection: {
      control: 'text',
      description: 'The ID of collection to embed. If both `video` and `collection` are provided, the player will play the provided collection while starting with the provided video.',
      table: {
        type: { summary: 'string' }
      }
    },
    parent: {
      control: 'text',
      description: "The URL of the site that is embedding this player. Multiple values can be added by passing an array. You don't need to specify this as the current hostname is already picked up by the underlying API.",
      table: {
        type: { summary: 'string | string[]' },
        defaultValue: { summary: 'window.location.hostname' }
      }
    },
    autoplay: {
      control: 'boolean',
      description: 'Whether the content should autoplay on load. Keep in mind that the audio might not play unless the user has focused at least once on the player.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(DEFAULTS.AUTOPLAY) }
      }
    },
    muted: {
      control: 'boolean',
      description: 'Whether the content should start muted when playing. The user can still change the volume later.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(DEFAULTS.MUTED) }
      }
    },
    time: {
      control: 'text',
      description: 'The timestamp from where the content should play. If a `channel` is provided then this setting is ignored. Should be a string formatted like `XhYmZs` for an X hour, Y minute and Z second timestamp.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: DEFAULTS.TIME }
      }
    },
    allowFullscreen: {
      control: 'boolean',
      description: 'Whether the player allows fullscreen to be played in fullscreen mode. Disabling this also removes the fullscreen button from the player.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(DEFAULTS.ALLOW_FULLSCREEN) }
      }
    },
    playsInline: {
      control: 'boolean',
      description: 'Whether the embedded player plays inline for mobile iOS apps. This setting is undocumented so its functionality is unknown.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(DEFAULTS.INLINE) }
      }
    },
    hideControls: {
      control: 'boolean',
      description: 'Whether the player controls should be hidden.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(DEFAULTS.HIDE_CONTROLS) }
      }
    },
    onCaptions: {
      control: false,
      description: "This event is fired when a batch of captions is received by the player. The type of the data payload might not be accurate as I couldn't find any stream or VOD that had captions enabled. The documentation mentions that this should be a string.",
      table: {
        type: { summary: '(p: TwitchPlayerInstance, d: string) => void' },
        defaultValue: { summary: '() => void' }
      }
    },
    onEnded: {
      control: false,
      description: 'This event is fired when the content that was being played in the player ends.',
      table: {
        type: { summary: '(p: TwitchPlayerInstance) => void' },
        defaultValue: { summary: '() => void' }
      }
    },
    onPause: {
      control: false,
      description: 'This event is fired when the player pauses.',
      table: {
        type: { summary: '(p: TwitchPlayerInstance) => void' },
        defaultValue: { summary: '() => void' }
      }
    },
    onPlay: {
      control: false,
      description: 'This event is fired when the player starts playing or resumes content.',
      table: {
        type: { summary: '(p: TwitchPlayerInstance, d: OnPlayData) => void' },
        defaultValue: { summary: '() => void' }
      }
    },
    onPlaybackBlocked: {
      control: false,
      description: 'This event is fired when the player playback is blocked, possibly due to an unmuted programmatic call to `play()`.',
      table: {
        type: { summary: '(p: TwitchPlayerInstance) => void' },
        defaultValue: { summary: '() => void' }
      }
    },
    onPlaying: {
      control: false,
      description: 'This event is fired when the player starts playing content.',
      table: {
        type: { summary: '(p: TwitchPlayerInstance) => void' },
        defaultValue: { summary: '() => void' }
      }
    },
    onOffline: {
      control: false,
      description: 'This event is fired when the channel being streamed has gone offline.',
      table: {
        type: { summary: '(p: TwitchPlayerInstance) => void' },
        defaultValue: { summary: '() => void' }
      }
    },
    onOnline: {
      control: false,
      description: 'This event is fired when the channel being streamed has gone online.',
      table: {
        type: { summary: '(p: TwitchPlayerInstance) => void' },
        defaultValue: { summary: '() => void' }
      }
    },
    onReady: {
      control: false,
      description: 'This event is fired when the player is ready. Use this if you need to keep track of the player instance. Updating certain props might trigger a recreation of the player, so this event should keep track of those changes.',
      table: {
        type: { summary: '(p: TwitchPlayerInstance) => void' },
        defaultValue: { summary: '() => void' }
      }
    },
    onSeek: {
      control: false,
      description: 'This event is fired when the user uses the seek functionality in the player.',
      table: {
        type: { summary: '(p: TwitchPlayerInstance, d: OnSeekData) => void' },
        defaultValue: { summary: '() => void' }
      }
    },
    id: {
      control: 'text',
      description: 'The ID of the `div` node where the player will be mounted. The underlying API uses this. You should not use an ID that depends on the channel name because it will trigger recreations of the player unnecessarily.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: DEFAULTS.ID.TWITCH_PLAYER }
      }
    },
    height: {
      control: 'text',
      description: 'The height of the embed. Percentage values can be used (i.e `100%`).',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: String(DEFAULTS.MEDIA.HEIGHT) }
      }
    },
    width: {
      control: 'text',
      description: 'The width of the embed. Percentage values can be used (i.e `100%`).',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: String(DEFAULTS.MEDIA.WIDTH) }
      }
    }
  }
} satisfies Meta<typeof TwitchPlayer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithAutoplay: Story = {
  args: { video: STORYBOOK_DEFAULTS.video, autoplay: true }
};

export const NoAutoplay: Story = {
  args: { video: STORYBOOK_DEFAULTS.video, autoplay: false }
};

export const Muted: Story = {
  args: { video: STORYBOOK_DEFAULTS.video, muted: true }
};

export const NotMuted: Story = {
  args: { video: STORYBOOK_DEFAULTS.video, muted: false }
};

export const FullscreenAllowed: Story = {
  args: { channel: STORYBOOK_DEFAULTS.channel, allowFullscreen: true }
};

export const FullscreenForbidden: Story = {
  args: { channel: STORYBOOK_DEFAULTS.channel, allowFullscreen: false }
};

export const ControlsVisible: Story = {
  args: { channel: STORYBOOK_DEFAULTS.channel, hideControls: false }
};

export const ControlsHidden: Story = {
  args: { channel: STORYBOOK_DEFAULTS.channel, hideControls: true }
};

export const CollectionWithInitialVideo: Story = {
  args: { video: STORYBOOK_DEFAULTS.videoInCollection, collection: STORYBOOK_DEFAULTS.collection }
};

export const ChannelSmoothSwitching: Story = {
  render: withNextMediaControls(TwitchPlayer, 'channel', STORYBOOK_DEFAULTS.channels)
};

export const VideosSmoothSwitching: Story = {
  render: withNextMediaControls(TwitchPlayer, 'video', STORYBOOK_DEFAULTS.videos)
};

export const CollectionsSmoothSwitching: Story = {
  render: withNextMediaControls(TwitchPlayer, 'collection', STORYBOOK_DEFAULTS.collections)
};

export const ControlledFromOutside: Story = {
  render: withVideoControls(TwitchPlayer, STORYBOOK_DEFAULTS.video, 'onReady')
};

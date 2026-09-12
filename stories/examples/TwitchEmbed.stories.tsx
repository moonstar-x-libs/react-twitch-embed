import type { Meta, StoryObj } from '@storybook/react-vite';
import { TwitchEmbed } from '../../src';
import { DEFAULTS } from '../../src/constants';
import { STORYBOOK_DEFAULTS } from '../defaults';
import withAutoplayWarning from '../helpers/withAutoplayWarning';
import withNextMediaControls from '../helpers/withNextMediaControls';
import withVideoControls from '../helpers/withVideoControls';

const meta: Meta = {
  title: 'Examples/TwitchEmbed',
  component: withAutoplayWarning(TwitchEmbed),
  argTypes: {
    allowFullscreen: {
      control: 'boolean',
      description: 'Whether the player allows fullscreen to be played in fullscreen mode. Disabling this also removes the fullscreen button from the player.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(DEFAULTS.ALLOW_FULLSCREEN) }
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
    withChat: {
      control: 'boolean',
      description: 'Whether the embed should include the live chat or not. This setting is only applied when `channel` is provided. There are no chat options for VODs.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(DEFAULTS.WITH_CHAT) }
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
    parent: {
      control: 'text',
      description: "The URL of the site that is embedding this player. Multiple values can be added by passing an array. You don't need to specify this as the current hostname is already picked up by the underlying API.",
      table: {
        type: { summary: 'string | string[]' },
        defaultValue: { summary: 'window.location.hostname' }
      }
    },
    darkMode: {
      control: 'boolean',
      description: 'Whether the chat embed should be displayed in a dark or light theme.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(DEFAULTS.DARK_MODE) }
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
    hideControls: {
      control: 'boolean',
      description: 'Whether the player controls should be hidden.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(DEFAULTS.HIDE_CONTROLS) }
      }
    },
    onAuthenticate: {
      control: false,
      description: 'This event is fired when the embed authenticates the client through their stored credentials in the browser.',
      table: {
        type: { summary: '(e: TwitchEmbedInstance, d: OnAuthenticateData) => void' },
        defaultValue: { summary: '() => void' }
      }
    },
    onVideoPlay: {
      control: false,
      description: 'This event is fired when the player starts playing or resumes content.',
      table: {
        type: { summary: '(e: TwitchEmbedInstance, d: OnPlayData) => void' },
        defaultValue: { summary: '() => void' }
      }
    },
    onVideoPause: {
      control: false,
      description: 'This event is fired when the player pauses.',
      table: {
        type: { summary: '(e: TwitchEmbedInstance) => void' },
        defaultValue: { summary: '() => void' }
      }
    },
    onVideoReady: {
      control: false,
      description: 'This event is fired when the player embed is ready. Use this if you need to keep track of the embed instance. Updating certain props might trigger a recreation of the embed, so this event should keep track of those changes.',
      table: {
        type: { summary: '(e: TwitchEmbedInstance) => void' },
        defaultValue: { summary: '() => void' }
      }
    },
    id: {
      control: 'text',
      description: 'The ID of the `div` node where the player will be mounted. The underlying API uses this. You should not use an ID that depends on the channel name because it will trigger recreations of the player unnecessarily.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: DEFAULTS.ID.TWITCH_EMBED }
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
} satisfies Meta<typeof TwitchEmbed>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightModeWithChat: Story = {
  args: { channel: STORYBOOK_DEFAULTS.channel, darkMode: false, withChat: true }
};

export const LightModeNoChat: Story = {
  args: { channel: STORYBOOK_DEFAULTS.channel, darkMode: false, withChat: false }
};

export const DarkModeWithChat: Story = {
  args: { channel: STORYBOOK_DEFAULTS.channel, darkMode: true, withChat: true }
};

export const DarkModeNoChat: Story = {
  args: { channel: STORYBOOK_DEFAULTS.channel, darkMode: true, withChat: false }
};

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

export const MultipleEmbeds: Story = {
  render: withAutoplayWarning(() => (
    <>
      <TwitchEmbed darkMode withChat channel={STORYBOOK_DEFAULTS.channel} id="embed-1" />
      <TwitchEmbed withChat channel={STORYBOOK_DEFAULTS.channel} darkMode={false} id="embed-2" />
    </>
  ))
};

export const ChannelSmoothSwitching: Story = {
  render: withAutoplayWarning(withNextMediaControls(TwitchEmbed, 'channel', STORYBOOK_DEFAULTS.channels))
};

export const VideosSmoothSwitching: Story = {
  render: withAutoplayWarning(withNextMediaControls(TwitchEmbed, 'video', STORYBOOK_DEFAULTS.videos))
};

export const CollectionsSmoothSwitching: Story = {
  render: withAutoplayWarning(withNextMediaControls(TwitchEmbed, 'collection', STORYBOOK_DEFAULTS.collections))
};

export const ControlledFromOutside: Story = {
  render: withAutoplayWarning(withVideoControls(TwitchEmbed, STORYBOOK_DEFAULTS.video, 'onVideoReady'))
};

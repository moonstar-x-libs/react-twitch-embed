import type { Meta, StoryObj } from '@storybook/react-vite';
import { TwitchPlayerNonInteractive } from '../../src/components/TwitchPlayerNonInteractive';
import { DEFAULTS } from '../../src/constants';
import { STORYBOOK_DEFAULTS } from '../defaults';
import withAutoplayWarning from '../helpers/withAutoplayWarning';

const meta: Meta = {
  title: 'Examples/TwitchPlayerNonInteractive',
  component: withAutoplayWarning(TwitchPlayerNonInteractive),
  argTypes: {
    parent: {
      control: 'text',
      description: "The URL of the site that is embedding this player. Multiple values can be added by passing an array. You don't need to specify this as the current hostname is already picked up.",
      table: {
        type: { summary: 'string | string[]' },
        defaultValue: { summary: 'window.location.hostname' }
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
    title: {
      control: 'text',
      description: 'The name of the `iframe` that embeds the player. Useful for accessibility reasons.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: DEFAULTS.TITLE.TWITCH_PLAYER_NON_INTERACTIVE }
      }
    },
    height: {
      control: 'text',
      description: 'The height of the player embed. Percentage values can be used (i.e `100%`).',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: String(DEFAULTS.MEDIA.HEIGHT) }
      }
    },
    width: {
      control: 'text',
      description: 'The width of the player embed. Percentage values can be used (i.e `100%`).',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: String(DEFAULTS.MEDIA.WIDTH) }
      }
    }
  }
} satisfies Meta<typeof TwitchPlayerNonInteractive>;

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

export const Channel: Story = {
  args: { channel: STORYBOOK_DEFAULTS.channel }
};

export const Video: Story = {
  args: { video: STORYBOOK_DEFAULTS.video }
};

export const Collection: Story = {
  args: { collection: STORYBOOK_DEFAULTS.collection }
};

export const CollectionWithInitialVideo: Story = {
  args: { video: STORYBOOK_DEFAULTS.videoInCollection, collection: STORYBOOK_DEFAULTS.collection }
};

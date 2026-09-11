import type { Meta, StoryObj } from '@storybook/react-vite';
import TwitchClip from '../../src/components/TwitchClip';
import { DEFAULTS } from '../../src/constants';
import { STORYBOOK_DEFAULTS } from '../defaults';
import withAutoplayWarning from '../helpers/withAutoplayWarning';

const meta: Meta = {
  title: 'Examples/TwitchClip',
  component: withAutoplayWarning(TwitchClip),
  args: {
    clip: STORYBOOK_DEFAULTS.clips[0]
  },
  argTypes: {
    clip: {
      control: 'text',
      description: 'The ID of the clip to embed.',
      table: {
        type: { summary: 'string' }
      }
    },
    parent: {
      control: 'text',
      description: "The URL of the site that is embedding this clip. Multiple values can be added by passing an array. You don't need to specify this as the current hostname is already picked up.",
      table: {
        type: { summary: 'string | string[]' },
        defaultValue: { summary: 'window.location.hostname' }
      }
    },
    autoplay: {
      control: 'boolean',
      description: 'Whether the clip should autoplay on load. Keep in mind that the audio might not play unless the user has focused at least once on the player.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(DEFAULTS.AUTOPLAY) }
      }
    },
    muted: {
      control: 'boolean',
      description: 'Whether the clip should start muted when playing. The user can still change the volume later.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(DEFAULTS.MUTED) }
      }
    },
    title: {
      control: 'text',
      description: 'The name of the `iframe` that embeds the player. Useful for accessibility reasons.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: DEFAULTS.TITLE.TWITCH_CLIP }
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
} satisfies Meta<typeof TwitchClip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithAutoplay: Story = {
  args: { autoplay: true }
};

export const NoAutoplay: Story = {
  args: { autoplay: false }
};

export const Muted: Story = {
  args: { clip: STORYBOOK_DEFAULTS.clips[1], muted: true }
};

export const NotMuted: Story = {
  args: { clip: STORYBOOK_DEFAULTS.clips[1], muted: false }
};

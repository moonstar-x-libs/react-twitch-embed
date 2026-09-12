import type { Meta, StoryObj } from '@storybook/react-vite';
import { TwitchChat } from '../../src';
import { DEFAULTS } from '../../src/constants';
import { STORYBOOK_DEFAULTS } from '../defaults';

const meta: Meta = {
  title: 'Examples/TwitchChat',
  component: TwitchChat,
  args: {
    channel: STORYBOOK_DEFAULTS.channel
  },
  argTypes: {
    channel: {
      control: 'text',
      description: 'The name of the channel to embed the chat.',
      table: {
        type: { summary: 'string' }
      }
    },
    parent: {
      control: 'text',
      description: "The URL of the site that is embedding this chat. Multiple values can be added by passing an array. You don't need to specify this as the current hostname is already picked up.",
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
    title: {
      control: 'text',
      description: 'The name of the `iframe` that embeds the chat. Useful for accessibility reasons.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: DEFAULTS.TITLE.TWITCH_CHAT }
      }
    },
    height: {
      control: 'text',
      description: 'The height of the chat embed. Percentage values can be used (i.e `100%`).',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: String(DEFAULTS.CHAT.HEIGHT) }
      }
    },
    width: {
      control: 'text',
      description: 'The width of the chat embed. Percentage values can be used (i.e `100%`).',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: String(DEFAULTS.CHAT.WIDTH) }
      }
    }
  }
} satisfies Meta<typeof TwitchChat>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LightMode: Story = {
  args: { darkMode: false }
};

export const DarkMode: Story = {
  args: { darkMode: true }
};

import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(?:background|color)$/iu,
        date: /Date$/u
      }
    },
    docs: {
      toc: true
    }
  }
};

export default preview;

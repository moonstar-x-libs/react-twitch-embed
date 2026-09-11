import { describe, expect, it } from '@jest/globals';
import { URLS } from '../constants';
import { generateUrl } from './TwitchChat';

const channel = 'channel';
const parent = 'localhost';

describe('Utils -> TwitchChat', () => {
  describe('generateUrl()', () => {
    it('should return a string with the correct URL.', () => {
      const url = generateUrl(channel, parent);
      expect(url).toContain(URLS.TWITCH_CHAT_URL);
    });

    it('should return a string with the provided channel.', () => {
      const url = generateUrl('channel', parent);
      expect(url).toContain('/channel/chat');
    });

    it('should return a string with dark mode if enabled.', () => {
      const url = generateUrl(channel, parent, { darkMode: true });
      expect(url).toContain('?darkpopout&');
    });

    it('should return a string without dark mode if disabled.', () => {
      const url = generateUrl(channel, parent, { darkMode: false });
      expect(url).not.toContain('?darkpopout&');
    });

    it('should return a string with a single parent if parent is a string.', () => {
      const url = generateUrl(channel, 'localhost');
      expect(url).toContain('parent=localhost');
    });

    it('should return a string with multiple parents if parent is an array.', () => {
      const parents = ['host1', 'host2', 'host3'];
      const url = generateUrl(channel, parents);

      for (const p of parents) {
        expect(url).toContain(`parent=${p}`);
      }
    });

    it('should return a string with all the default options if no options are provided.', () => {
      const url = generateUrl(channel, parent);

      expect(url).toContain('?darkpopout&');
    });
  });
});

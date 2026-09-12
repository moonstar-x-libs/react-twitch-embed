import { describe, expect, it } from '@jest/globals';
import { URLS } from '../constants';
import { generateUrl } from './TwitchClip';

const clip = 'clip';
const parent = 'localhost';

describe('Utils -> TwitchClip', () => {
  describe('generateUrl()', () => {
    it('should return a string with the correct URL.', () => {
      const url = generateUrl(clip, parent);
      expect(url).toContain(URLS.TWITCH_CLIP_URL);
    });

    it('should return a string with the provided clip.', () => {
      const url = generateUrl('clip', parent);
      expect(url).toContain('clip=clip');
    });

    it('should return a string with autoplay true if enabled.', () => {
      const url = generateUrl(clip, parent, { autoplay: true });
      expect(url).toContain('autoplay=true');
    });

    it('should return a string with autoplay false if disabled.', () => {
      const url = generateUrl(clip, parent, { autoplay: false });
      expect(url).toContain('autoplay=false');
    });

    it('should return a string with muted true if enabled.', () => {
      const url = generateUrl(clip, parent, { muted: true });
      expect(url).toContain('muted=true');
    });

    it('should return a string with muted false if disabled.', () => {
      const url = generateUrl(clip, parent, { muted: false });
      expect(url).toContain('muted=false');
    });

    it('should return a string with a single parent if parent is a string.', () => {
      const url = generateUrl(clip, 'localhost');
      expect(url).toContain('parent=localhost');
    });

    it('should return a string with multiple parents if parent is an array.', () => {
      const parents = ['host1', 'host2', 'host3'];
      const url = generateUrl(clip, parents);

      for (const p of parents) {
        expect(url).toContain(`parent=${p}`);
      }
    });

    it('should return a string with all the default options if no options are provided.', () => {
      const url = generateUrl(clip, parent);

      expect(url).toContain('autoplay=true');
      expect(url).toContain('muted=false');
    });
  });
});

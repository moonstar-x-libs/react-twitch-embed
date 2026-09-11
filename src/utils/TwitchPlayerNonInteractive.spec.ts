import { describe, expect, it } from '@jest/globals';
import { URLS } from '../constants';
import { generateUrl } from './TwitchPlayerNonInteractive';

const channel = 'channel';
const parent = 'localhost';

describe('Utils -> TwitchPlayerNonInteractive', () => {
  describe('generateUrl()', () => {
    it('should return a string with the correct URL.', () => {
      const url = generateUrl({ channel }, parent);
      expect(url).toContain(URLS.TWITCH_PLAYER_NON_INTERACTIVE_URL);
    });

    it('should return a string with the provided channel.', () => {
      const url = generateUrl({ channel: 'channel' }, parent);
      expect(url).toContain('channel=channel');
    });

    it('should return a string with the provided video.', () => {
      const url = generateUrl({ video: 'video' }, parent);
      expect(url).toContain('video=video');
    });

    it('should return a string with the provided collection.', () => {
      const url = generateUrl({ collection: 'collection' }, parent);
      expect(url).toContain('collection=collection');
    });

    it('should return a string with the provided video and collection.', () => {
      const url = generateUrl({ video: 'video', collection: 'collection' }, parent);
      expect(url).toContain('video=video');
      expect(url).toContain('collection=collection');
    });

    it('should return a string with only the channel if all media are provided.', () => {
      const url = generateUrl({ channel: 'channel', video: 'video', collection: 'collection' }, parent);
      expect(url).toContain('channel=channel');
      expect(url).not.toContain('video=video');
      expect(url).not.toContain('collection=collection');
    });

    it('should return a string with autoplay true if enabled.', () => {
      const url = generateUrl({ channel }, parent, { autoplay: true });
      expect(url).toContain('autoplay=true');
    });

    it('should return a string with autoplay false if disabled.', () => {
      const url = generateUrl({ channel }, parent, { autoplay: false });
      expect(url).toContain('autoplay=false');
    });

    it('should return a string with muted true if enabled.', () => {
      const url = generateUrl({ channel }, parent, { muted: true });
      expect(url).toContain('muted=true');
    });

    it('should return a string with muted false if disabled.', () => {
      const url = generateUrl({ channel }, parent, { muted: false });
      expect(url).toContain('muted=false');
    });

    it('should return a string with time if provided.', () => {
      const url = generateUrl({ channel }, parent, { time: '4m20s' });
      expect(url).toContain('time=4m20s');
    });

    it('should return a string with time 0h0m0s if not provided.', () => {
      const url = generateUrl({ channel }, parent);
      expect(url).toContain('time=0h0m0s');
    });

    it('should return a string with a single parent if parent is a string.', () => {
      const url = generateUrl({ channel }, 'localhost');
      expect(url).toContain('parent=localhost');
    });

    it('should return a string with multiple parents if parent is an array.', () => {
      const parents = ['host1', 'host2', 'host3'];
      const url = generateUrl({ channel }, parents);

      for (const parent of parents) {
        expect(url).toContain(`parent=${parent}`);
      }
    });

    it('should return a string with all the default options if no options are provided.', () => {
      const url = generateUrl({ channel }, parent);

      expect(url).toContain('autoplay=true');
      expect(url).toContain('muted=false');
      expect(url).toContain('time=0h0m0s');
    });
  });
});

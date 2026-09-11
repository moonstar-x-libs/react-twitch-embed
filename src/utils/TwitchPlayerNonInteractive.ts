import { DEFAULTS, URLS } from '../constants';
import { appendParents } from './parent';
import type { Parent } from './parent';

export interface TwitchPlayerNonInteractiveMedia {
  channel?: string | undefined;
  collection?: string | undefined;
  video?: string | undefined;
}

export interface TwitchPlayerNonInteractiveOptions {
  autoplay?: boolean | undefined;
  muted?: boolean | undefined;
  time?: string | undefined;
}

export const generateUrl = (
  media: TwitchPlayerNonInteractiveMedia,
  parent: Parent,
  options: TwitchPlayerNonInteractiveOptions = {}
): string => {
  const { autoplay = DEFAULTS.AUTOPLAY, muted = DEFAULTS.MUTED, time = DEFAULTS.TIME } = options;
  const params = new URLSearchParams();

  // A channel always wins over a video or a collection, they cannot be embedded together.
  if (typeof media.channel === 'string') {
    params.append('channel', media.channel);
  } else {
    if (typeof media.video === 'string') {
      params.append('video', media.video);
    }

    if (typeof media.collection === 'string') {
      params.append('collection', media.collection);
    }
  }

  params.append('autoplay', autoplay.toString());
  params.append('muted', muted.toString());
  params.append('time', time);
  appendParents(params, parent);

  return `${URLS.TWITCH_PLAYER_NON_INTERACTIVE_URL}/?${params.toString()}`;
};

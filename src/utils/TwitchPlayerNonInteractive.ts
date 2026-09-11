import { DEFAULTS, URLS } from '../constants';
import { appendParents } from './parent';
import type { Parent } from './parent';
import type { Optional } from './types';

export interface TwitchPlayerNonInteractiveMedia {
  channel?: Optional<string>;
  collection?: Optional<string>;
  video?: Optional<string>;
}

export interface TwitchPlayerNonInteractiveOptions {
  autoplay?: Optional<boolean>;
  muted?: Optional<boolean>;
  time?: Optional<string>;
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

import { DEFAULTS, URLS } from '../constants';
import { appendParents } from './parent';
import type { Parent } from './parent';

export interface TwitchClipGenerateUrlOptions {
  autoplay?: boolean | undefined;
  muted?: boolean | undefined;
}

export const generateUrl = (
  clip: string,
  parent: Parent,
  options: TwitchClipGenerateUrlOptions = {}
): string => {
  const { autoplay = DEFAULTS.AUTOPLAY, muted = DEFAULTS.MUTED } = options;
  const params = new URLSearchParams();

  params.append('clip', clip);
  params.append('autoplay', autoplay.toString());
  params.append('muted', muted.toString());
  appendParents(params, parent);

  return `${URLS.TWITCH_CLIP_URL}?${params.toString()}`;
};

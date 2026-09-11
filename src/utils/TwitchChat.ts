import { DEFAULTS, URLS } from '../constants';
import { appendParents } from './parent';
import type { Parent } from './parent';
import type { Optional } from './types';

export interface TwitchChatGenerateUrlOptions {
  darkMode?: Optional<boolean>;
}

export const generateUrl = (
  channel: string,
  parent: Parent,
  options: TwitchChatGenerateUrlOptions = {}
): string => {
  const { darkMode = DEFAULTS.DARK_MODE } = options;
  const params = new URLSearchParams();

  appendParents(params, parent);

  const startOfQuery = darkMode ? '?darkpopout&' : '?';

  return `${URLS.TWITCH_CHAT_URL}/${channel}/chat${startOfQuery}${params.toString()}`;
};

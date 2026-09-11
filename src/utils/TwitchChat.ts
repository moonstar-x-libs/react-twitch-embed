import { URLS, DEFAULTS } from '../constants';
import { appendParents, type Parent } from './parent';

export interface TwitchChatGenerateUrlOptions {
  darkMode?: boolean
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

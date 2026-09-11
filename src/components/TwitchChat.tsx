import type { FC, HTMLAttributes } from 'react';
import useHostname from '../hooks/useHostname';
import { DEFAULTS } from '../constants';
import { generateUrl } from '../utils/TwitchChat';
import type { Parent } from '../utils/parent';

export interface TwitchChatProps extends HTMLAttributes<HTMLIFrameElement> {
  channel: string
  parent?: Parent
  darkMode?: boolean

  title?: string
  height?: string | number
  width?: string | number
}

const TwitchChat: FC<TwitchChatProps> = ({
  channel,
  parent,
  darkMode = DEFAULTS.DARK_MODE,

  title = DEFAULTS.TITLE.TWITCH_CHAT,
  height = DEFAULTS.CHAT.HEIGHT,
  width = DEFAULTS.CHAT.WIDTH,
  ...props
}) => {
  const hostname = useHostname();
  const resolvedParent = parent ?? hostname;

  if (!resolvedParent) {
    return null;
  }

  const chatUrl = generateUrl(channel, resolvedParent, { darkMode });

  return (
    <iframe
      title={title}
      height={height}
      width={width}
      src={chatUrl}
      frameBorder={0}
      {...props}
    />
  );
};

export default TwitchChat;

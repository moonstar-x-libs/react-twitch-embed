import type { ComponentProps, FC } from 'react';
import { DEFAULTS } from '../constants';
import useHostname from '../hooks/useHostname';
import type { Parent } from '../utils/parent';
import { generateUrl } from '../utils/TwitchChat';

export interface TwitchChatProps extends ComponentProps<'iframe'> {
  channel: string;
  darkMode?: boolean | undefined;
  height?: number | string | undefined;

  parent?: Parent | undefined;
  title?: string | undefined;
  width?: number | string | undefined;
}

const TwitchChat: FC<TwitchChatProps> = ({
  channel,
  parent,
  style,
  darkMode = DEFAULTS.DARK_MODE,

  title = DEFAULTS.TITLE.TWITCH_CHAT,
  height = DEFAULTS.CHAT.HEIGHT,
  width = DEFAULTS.CHAT.WIDTH,
  ...props
}) => {
  const hostname = useHostname();
  const resolvedParent = parent ?? hostname;

  if (resolvedParent === undefined) {
    return null;
  }

  return (
    <iframe
      height={height}
      src={generateUrl(channel, resolvedParent, { darkMode })}
      style={{ border: 'none', ...style }}
      title={title}
      width={width}
      {...props}
    />
  );
};

export default TwitchChat;

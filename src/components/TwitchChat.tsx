import type { ComponentProps, FC } from 'react';
import { DEFAULTS } from '../constants';
import useHostname from '../hooks/useHostname';
import type { Parent } from '../utils/parent';
import { generateUrl } from '../utils/TwitchChat';
import type { Optional } from '../utils/types';

export interface TwitchChatProps extends Omit<ComponentProps<'iframe'>, 'src'> {
  channel: string;
  darkMode?: Optional<boolean>;
  height?: Optional<number | string>;

  parent?: Optional<Parent>;
  title?: Optional<string>;
  width?: Optional<number | string>;
}

export const TwitchChat: FC<TwitchChatProps> = ({
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

import type { ComponentProps, FC } from 'react';
import { DEFAULTS } from '../constants';
import useHostname from '../hooks/useHostname';
import type { Parent } from '../utils/parent';
import { generateUrl } from '../utils/TwitchChat';
import type { Optional } from '../utils/types';

/**
 * The props supported by the {@link TwitchChat} component.
 *
 * Any prop that is not listed here is forwarded to the underlying `iframe` node.
 */
export interface TwitchChatProps extends Omit<ComponentProps<'iframe'>, 'src'> {
  /**
   * The name of the channel to embed the chat.
   */
  channel: string;

  /**
   * Whether the chat embed should be displayed in a dark or light theme.
   *
   * @defaultValue `true`
   */
  darkMode?: Optional<boolean>;

  /**
   * The height of the chat embed. Percentage values can be used (i.e. `100%`).
   *
   * @defaultValue `550`
   */
  height?: Optional<number | string>;

  /**
   * The URL of the site that is embedding this chat. Multiple values can be added.
   * You don't need to specify this as the current hostname is already picked up.
   *
   * @defaultValue `window.location.hostname`
   */
  parent?: Optional<Parent>;

  /**
   * The name of the `iframe` that embeds the chat. Useful for accessibility reasons.
   *
   * @defaultValue `'TwitchChat'`
   */
  title?: Optional<string>;

  /**
   * The width of the chat embed. Percentage values can be used (i.e. `100%`).
   *
   * @defaultValue `350`
   */
  width?: Optional<number | string>;
}

/**
 * Frames a channel's chat window inside an `iframe`.
 *
 * The parent hostname is read from `window.location.hostname`, which is not available while rendering on
 * the server. In that case nothing is rendered unless an explicit {@link TwitchChatProps.parent | parent} is given.
 *
 * @example
 * ```tsx
 * import { TwitchChat } from 'react-twitch-embed';
 *
 * const MyComponent = () => {
 *   return (
 *     <TwitchChat channel="moonstar_x" darkMode />
 *   );
 * };
 * ```
 */
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

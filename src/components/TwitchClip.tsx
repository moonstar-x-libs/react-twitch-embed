import type { ComponentProps, FC } from 'react';
import { DEFAULTS } from '../constants';
import useHostname from '../hooks/useHostname';
import type { Parent } from '../utils/parent';
import { generateUrl } from '../utils/TwitchClip';
import type { Optional } from '../utils/types';

/**
 * The props supported by the {@link TwitchClip} component.
 *
 * Any prop that is not listed here is forwarded to the underlying `iframe` node.
 */
export interface TwitchClipProps extends Omit<ComponentProps<'iframe'>, 'src'> {
  /**
   * Whether the clip should autoplay on load. Keep in mind that the audio might not play
   * unless the user has focused at least once on the player.
   *
   * @defaultValue `true`
   */
  autoplay?: Optional<boolean>;

  /**
   * The ID of the clip to embed.
   */
  clip: string;

  /**
   * The height of the player embed. Percentage values can be used (i.e. `100%`).
   *
   * @defaultValue `480`
   */
  height?: Optional<number | string>;

  /**
   * Whether the clip should start muted when playing. The user can still change the volume later.
   *
   * @defaultValue `false`
   */
  muted?: Optional<boolean>;

  /**
   * The URL of the site that is embedding this clip. Multiple values can be added.
   * You don't need to specify this as the current hostname is already picked up.
   *
   * @defaultValue `window.location.hostname`
   */
  parent?: Optional<Parent>;

  /**
   * The name of the `iframe` that embeds the player. Useful for accessibility reasons.
   *
   * @defaultValue `'TwitchClip'`
   */
  title?: Optional<string>;

  /**
   * The width of the player embed. Percentage values can be used (i.e. `100%`).
   *
   * @defaultValue `940`
   */
  width?: Optional<number | string>;
}

/**
 * Frames a player for clips inside an `iframe`. Use {@link TwitchPlayer} or
 * {@link TwitchPlayerNonInteractive} for streams, VODs and collections instead.
 *
 * The parent hostname is read from `window.location.hostname`, which is not available while rendering on
 * the server. In that case nothing is rendered unless an explicit {@link TwitchClipProps.parent | parent} is given.
 *
 * @example
 * ```tsx
 * import { TwitchClip } from 'react-twitch-embed';
 *
 * const MyComponent = () => {
 *   return (
 *     <TwitchClip clip="AdventurousBusyWormTwitchRaid-7vDEE8L5ur9j9dzi" autoplay muted />
 *   );
 * };
 * ```
 */
export const TwitchClip: FC<TwitchClipProps> = ({
  clip,
  parent,
  style,
  autoplay = DEFAULTS.AUTOPLAY,
  muted = DEFAULTS.MUTED,

  title = DEFAULTS.TITLE.TWITCH_CLIP,
  height = DEFAULTS.MEDIA.HEIGHT,
  width = DEFAULTS.MEDIA.WIDTH,
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
      src={generateUrl(clip, resolvedParent, { autoplay, muted })}
      style={{ border: 'none', ...style }}
      title={title}
      width={width}
      {...props}
    />
  );
};

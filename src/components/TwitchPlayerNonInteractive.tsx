import type { ComponentProps, FC } from 'react';
import { DEFAULTS } from '../constants';
import useHostname from '../hooks/useHostname';
import type { Parent } from '../utils/parent';
import { generateUrl } from '../utils/TwitchPlayerNonInteractive';
import type { Optional } from '../utils/types';

/**
 * The props supported by the {@link TwitchPlayerNonInteractive} component.
 *
 * Any prop that is not listed here is forwarded to the underlying `iframe` node.
 *
 * If `channel`, `video` and `collection` are provided, only `channel` is taken into account.
 * If `collection` and `video` are provided, the player plays the videos in the collection starting
 * from the video that was provided. If the collection does not contain the video, the player might
 * enter an undefined state where it plays only the video, plays only the collection, or remains black.
 */
export interface TwitchPlayerNonInteractiveProps extends Omit<ComponentProps<'iframe'>, 'src'> {
  /**
   * Whether the content should autoplay on load. Keep in mind that the audio might not play
   * unless the user has focused at least once on the player.
   *
   * @defaultValue `true`
   */
  autoplay?: Optional<boolean>;

  /**
   * The name of the channel to embed their stream.
   */
  channel?: Optional<string>;

  /**
   * The ID of the collection to embed. If both `video` and `collection` are provided, the player
   * plays the provided collection while starting with the provided video.
   */
  collection?: Optional<string>;

  /**
   * The height of the player embed. Percentage values can be used (i.e. `100%`).
   *
   * @defaultValue `480`
   */
  height?: Optional<number | string>;

  /**
   * Whether the content should start muted when playing. The user can still change the volume later.
   *
   * @defaultValue `false`
   */
  muted?: Optional<boolean>;

  /**
   * The URL of the site that is embedding this player. Multiple values can be added.
   * You don't need to specify this as the current hostname is already picked up.
   *
   * @defaultValue `window.location.hostname`
   */
  parent?: Optional<Parent>;

  /**
   * The timestamp from where the content should play. If a `channel` is provided then this setting
   * is ignored. Should be a string formatted like `XhYmZs` for an X hour, Y minute and Z second timestamp.
   *
   * @defaultValue `'0h0m0s'`
   */
  time?: Optional<string>;

  /**
   * The name of the `iframe` that embeds the player. Useful for accessibility reasons.
   *
   * @defaultValue `'TwitchPlayerNonInteractive'`
   */
  title?: Optional<string>;

  /**
   * The ID of the video to embed.
   */
  video?: Optional<string>;

  /**
   * The width of the player embed. Percentage values can be used (i.e. `100%`).
   *
   * @defaultValue `940`
   */
  width?: Optional<number | string>;
}

/**
 * Frames a non-interactive player for streams, VODs and collections. This component has no underlying
 * API, it is just a simple `iframe`, so it downloads no extra script and adds no extra nodes to the document.
 *
 * Using this or {@link TwitchPlayer} is up to you. They both embed the same content, but changing the
 * `channel`, `video` or `collection` props recreates this embed, while the interactive player switches
 * the media through its internal API instead.
 *
 * The parent hostname is read from `window.location.hostname`, which is not available while rendering on
 * the server. In that case nothing is rendered unless an explicit
 * {@link TwitchPlayerNonInteractiveProps.parent | parent} is given.
 *
 * @example
 * ```tsx
 * import { TwitchPlayerNonInteractive } from 'react-twitch-embed';
 *
 * const MyComponent = () => {
 *   return (
 *     <TwitchPlayerNonInteractive channel="moonstar_x" autoplay muted />
 *   );
 * };
 * ```
 */
export const TwitchPlayerNonInteractive: FC<TwitchPlayerNonInteractiveProps> = ({
  parent,
  channel,
  video,
  collection,
  style,
  autoplay = DEFAULTS.AUTOPLAY,
  muted = DEFAULTS.MUTED,
  time = DEFAULTS.TIME,

  title = DEFAULTS.TITLE.TWITCH_PLAYER_NON_INTERACTIVE,
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
      src={generateUrl({ channel, video, collection }, resolvedParent, { autoplay, muted, time })}
      style={{ border: 'none', ...style }}
      title={title}
      width={width}
      {...props}
    />
  );
};

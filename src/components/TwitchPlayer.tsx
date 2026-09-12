import { useEffect, useMemo, useRef } from 'react';
import type { ComponentProps, FC, RefObject } from 'react';
import { DEFAULTS, URLS } from '../constants';
import useLatest from '../hooks/useLatest';
import useParents from '../hooks/useParents';
import useScript from '../hooks/useScript';
import { clearElementById } from '../utils/document';
import { noop } from '../utils/misc';
import { isShallowEqual } from '../utils/object';
import type { Parent } from '../utils/parent';
import type {
  OnPlayData,
  OnSeekData, Optional,
  TwitchPlayerConstructor,
  TwitchPlayerConstructorOptions,
  TwitchPlayerInstance,
  TwitchWindow
} from '../utils/types';

type PlayerDivProps = Omit<ComponentProps<'div'>, 'onEnded' | 'onPause' | 'onPlay' | 'onPlaying'>;

/**
 * The props supported by the {@link TwitchPlayer} component.
 *
 * Any prop that is not listed here is forwarded to the underlying `div` node. The media events of the
 * `div` that clash with the player events (`onEnded`, `onPause`, `onPlay` and `onPlaying`) are not forwarded.
 *
 * If `channel`, `video` and `collection` are provided, only `channel` is taken into account.
 * If `collection` and `video` are provided, the player plays the videos in the collection starting
 * from the video that was provided. If the collection does not contain the video, the player might
 * enter an undefined state where it plays only the video, plays only the collection, or remains black.
 */
export interface TwitchPlayerProps extends PlayerDivProps {
  /**
   * Whether the player allows the content to be played in fullscreen mode. Disabling this also
   * removes the fullscreen button from the player.
   *
   * @defaultValue `true`
   */
  allowFullscreen?: Optional<boolean>;

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
   * The height of the embed. Percentage values can be used (i.e. `100%`).
   *
   * @defaultValue `480`
   */
  height?: Optional<number | string>;

  /**
   * Whether the player controls should be hidden.
   *
   * @defaultValue `false`
   */
  hideControls?: Optional<boolean>;

  /**
   * The ID of the `div` node where the player is mounted, which the underlying API needs. If you
   * display multiple players simultaneously you should provide a static ID for each one. You should
   * not use an ID that depends on the channel name because it triggers unnecessary recreations of the player.
   *
   * @defaultValue `'twitch-player'`
   */
  id?: Optional<string>;

  /**
   * Whether the content should start muted when playing. The user can still change the volume later.
   *
   * @defaultValue `false`
   */
  muted?: Optional<boolean>;

  /**
   * Fired when a batch of captions is received by the player. The type of the data payload might not
   * be accurate as no stream or VOD with captions enabled could be found to verify it. The official
   * documentation mentions that this should be a string.
   *
   * @defaultValue A no-op.
   */
  onCaptions?: Optional<(player: TwitchPlayerInstance, captions: string) => void>;

  /**
   * Fired when the content that was being played in the player ends.
   *
   * @defaultValue A no-op.
   */
  onEnded?: Optional<(player: TwitchPlayerInstance) => void>;

  /**
   * Fired when the channel being streamed has gone offline.
   *
   * @defaultValue A no-op.
   */
  onOffline?: Optional<(player: TwitchPlayerInstance) => void>;

  /**
   * Fired when the channel being streamed has gone online.
   *
   * @defaultValue A no-op.
   */
  onOnline?: Optional<(player: TwitchPlayerInstance) => void>;

  /**
   * Fired when the player pauses. Buffering and seeking are not considered paused.
   *
   * @defaultValue A no-op.
   */
  onPause?: Optional<(player: TwitchPlayerInstance) => void>;

  /**
   * Fired when the player starts playing or resumes content.
   *
   * @defaultValue A no-op.
   */
  onPlay?: Optional<(player: TwitchPlayerInstance, data: OnPlayData) => void>;

  /**
   * Fired when the player playback is blocked, usually due to an unmuted autoplay or an unmuted
   * programmatic call to `play()`.
   *
   * @defaultValue A no-op.
   */
  onPlaybackBlocked?: Optional<(player: TwitchPlayerInstance) => void>;

  /**
   * Fired when the player starts playing content.
   *
   * @defaultValue A no-op.
   */
  onPlaying?: Optional<(player: TwitchPlayerInstance) => void>;

  /**
   * Fired when the player is ready to accept API calls. Use this if you need to keep track of the
   * player instance. Updating certain props recreates the player, so this event should keep track of
   * those changes.
   *
   * @defaultValue A no-op.
   */
  onReady?: Optional<(player: TwitchPlayerInstance) => void>;

  /**
   * Fired when the user uses the seek functionality in the player, when `seek()` is called, or when
   * live playback seeks to sync up after being paused.
   *
   * @defaultValue A no-op.
   */
  onSeek?: Optional<(player: TwitchPlayerInstance, data: OnSeekData) => void>;

  /**
   * The URL of the site that is embedding this player. Multiple values can be added. You don't need
   * to specify this as the current hostname is already picked up by the underlying API.
   *
   * @defaultValue `window.location.hostname`
   */
  parent?: Optional<Parent>;

  /**
   * Whether the embedded player plays inline for mobile iOS apps. This setting is undocumented by
   * Twitch, so its exact functionality is unknown.
   *
   * @defaultValue `true`
   */
  playsInline?: Optional<boolean>;

  /**
   * The timestamp from where the content should play. If a `channel` is provided then this setting
   * is ignored. Should be a string formatted like `XhYmZs` for an X hour, Y minute and Z second timestamp.
   *
   * @defaultValue `'0h0m0s'`
   */
  time?: Optional<string>;

  /**
   * The ID of the video to embed.
   */
  video?: Optional<string>;

  /**
   * The width of the embed. Percentage values can be used (i.e. `100%`).
   *
   * @defaultValue `940`
   */
  width?: Optional<number | string>;
}

type PlayerEventName = 'onCaptions' | 'onEnded' | 'onOffline' | 'onOnline' | 'onPause' | 'onPlay' | 'onPlaybackBlocked' | 'onPlaying' | 'onReady' | 'onSeek';

// The handlers always have a value inside the component because every one of them defaults to noop.
type PlayerEventHandlers = { [K in PlayerEventName]: NonNullable<TwitchPlayerProps[K]> };

interface Media {
  channel?: Optional<string>;
  collection?: Optional<string>;
  video?: Optional<string>;
}

interface MountedPlayer {
  id: string;
  media: Media;
  options: TwitchPlayerConstructorOptions;
}

/**
 * Subscribes to every player event once. The handlers are read from a ref at call time, so the
 * listeners never have to be reattached when inline props change identity.
 */
const attachListeners = (
  instance: TwitchPlayerInstance,
  PlayerConstructor: TwitchPlayerConstructor,
  handlers: RefObject<PlayerEventHandlers>
): void => {
  instance.addEventListener(PlayerConstructor.CAPTIONS, (captions: string) => handlers.current.onCaptions(instance, captions));
  instance.addEventListener(PlayerConstructor.ENDED, () => handlers.current.onEnded(instance));
  instance.addEventListener(PlayerConstructor.PAUSE, () => handlers.current.onPause(instance));
  instance.addEventListener(PlayerConstructor.PLAY, (data: OnPlayData) => handlers.current.onPlay(instance, data));
  instance.addEventListener(PlayerConstructor.PLAYBACK_BLOCKED, () => handlers.current.onPlaybackBlocked(instance));
  instance.addEventListener(PlayerConstructor.PLAYING, () => handlers.current.onPlaying(instance));
  instance.addEventListener(PlayerConstructor.OFFLINE, () => handlers.current.onOffline(instance));
  instance.addEventListener(PlayerConstructor.ONLINE, () => handlers.current.onOnline(instance));
  instance.addEventListener(PlayerConstructor.READY, () => handlers.current.onReady(instance));
  instance.addEventListener(PlayerConstructor.SEEK, (data: OnSeekData) => handlers.current.onSeek(instance, data));
};

/**
 * Switches the media being played through the player API, which keeps the embed alive instead of
 * recreating it.
 */
const switchMedia = (instance: TwitchPlayerInstance, previous: Media, next: Media): void => {
  const { channel, collection, video } = next;

  if (channel !== undefined && channel !== '' && channel !== previous.channel) {
    instance.setChannel(channel);
  }

  if (video !== undefined && video !== '' && video !== previous.video) {
    instance.setVideo(video, 0);
  }

  if (collection !== undefined && collection !== '' && collection !== previous.collection) {
    instance.setCollection(collection, video);
  }
};

/**
 * Frames an interactive player for streams, VODs and collections. It exposes the underlying Twitch
 * player instance through its events, which can be used to control the player from the outside
 * (i.e. custom control components). Unlike {@link TwitchEmbed}, it cannot display the live chat.
 *
 * The Twitch player script is loaded on demand, so nothing is rendered until it has loaded.
 *
 * The underlying instance is only recreated when the `id` or one of the options owned by the Twitch
 * constructor changes: `parent`, `autoplay`, `muted`, `time`, `allowFullscreen`, `playsInline` and
 * `hideControls`. The `channel`, `video` and `collection` props are switched through the internal API
 * instead, and every other prop, including the event handlers, `height`, `width` and anything
 * forwarded to the `div`, never triggers a recreation. Inline arrow functions are therefore safe to
 * use as handlers, the latest one is always the one that gets called.
 *
 * @example
 * ```tsx
 * import { useRef } from 'react';
 * import { TwitchPlayer } from 'react-twitch-embed';
 * import type { TwitchPlayerInstance } from 'react-twitch-embed';
 *
 * const MyComponent = () => {
 *   const player = useRef<TwitchPlayerInstance | null>(null); // We use a ref instead of state to avoid rerenders.
 *
 *   const handleReady = (p: TwitchPlayerInstance) => {
 *     player.current = p;
 *   };
 *
 *   return (
 *     <TwitchPlayer channel="moonstar_x" autoplay muted onReady={handleReady} />
 *   );
 * };
 * ```
 */
export const TwitchPlayer: FC<TwitchPlayerProps> = ({
  channel,
  video,
  collection,
  parent,
  autoplay = DEFAULTS.AUTOPLAY,
  muted = DEFAULTS.MUTED,
  time = DEFAULTS.TIME,
  allowFullscreen = DEFAULTS.ALLOW_FULLSCREEN,
  playsInline = DEFAULTS.INLINE,
  hideControls = DEFAULTS.HIDE_CONTROLS,

  onCaptions = noop,
  onEnded = noop,
  onPause = noop,
  onPlay = noop,
  onPlaybackBlocked = noop,
  onPlaying = noop,
  onOffline = noop,
  onOnline = noop,
  onReady = noop,
  onSeek = noop,

  id = DEFAULTS.ID.TWITCH_PLAYER,
  height = DEFAULTS.MEDIA.HEIGHT,
  width = DEFAULTS.MEDIA.WIDTH,
  ...restOfProps
// Every prop default counts towards the complexity of the component, which is not real branching.
// eslint-disable-next-line complexity
}) => {
  const { loading, error } = useScript(URLS.TWITCH_PLAYER_URL);
  const parents = useParents(parent);

  // Read through a ref so that inline handlers do not force the player to be recreated.
  const handlers = useLatest({
    onCaptions,
    onEnded,
    onPause,
    onPlay,
    onPlaybackBlocked,
    onPlaying,
    onOffline,
    onOnline,
    onReady,
    onSeek
  });

  const playerRef = useRef<TwitchPlayerInstance>(undefined);
  const mountedRef = useRef<MountedPlayer>(undefined);

  // Everything the constructor needs except the media, which is switched through the player API.
  const options = useMemo<TwitchPlayerConstructorOptions>(() => ({
    parent: parents,
    autoplay,
    muted,
    time,
    allowfullscreen: allowFullscreen,
    playsinline: playsInline,
    controls: !hideControls,
    height: '100%',
    width: '100%'
  }), [parents, autoplay, muted, time, allowFullscreen, playsInline, hideControls]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (error) {
      console.error(error);
      return;
    }

    const PlayerConstructor: Optional<TwitchPlayerConstructor> = (window as TwitchWindow).Twitch?.Player;

    if (!PlayerConstructor) {
      return;
    }

    const media: Media = { channel, video, collection };
    const previous = mountedRef.current;
    const instance = playerRef.current;
    const shouldReconstruct = !instance ||
      !previous ||
      previous.id !== id ||
      !isShallowEqual(previous.options, options);

    if (shouldReconstruct) {
      clearElementById(id);

      const player = new PlayerConstructor(id, { ...options, ...media });

      attachListeners(player, PlayerConstructor, handlers);

      playerRef.current = player;
      mountedRef.current = { id, options, media };
      return;
    }

    switchMedia(instance, previous.media, media);
    mountedRef.current = { ...previous, media };
  }, [loading, error, id, options, channel, video, collection, handlers]);

  if (loading) {
    return null;
  }

  return (
    <div
      id={id}
      style={{ height, width }}
      {...restOfProps}
    />
  );
};

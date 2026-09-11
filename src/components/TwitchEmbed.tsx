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
  OnAuthenticateData,
  OnPlayData, Optional,
  TwitchEmbedConstructor,
  TwitchEmbedConstructorOptions,
  TwitchEmbedInstance,
  TwitchPlayerInstance,
  TwitchWindow
} from '../utils/types';

/**
 * The props supported by the {@link TwitchEmbed} component.
 *
 * Any prop that is not listed here is forwarded to the underlying `div` node.
 *
 * If `channel`, `video` and `collection` are provided, only `channel` is taken into account.
 * If `collection` and `video` are provided, the player plays the videos in the collection starting
 * from the video that was provided. If the collection does not contain the video, the player might
 * enter an undefined state where it plays only the video, plays only the collection, or remains black.
 */
export interface TwitchEmbedProps extends ComponentProps<'div'> {
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
   * The ID of the collection to embed. If both `video` and `collection` are provided, the embed
   * plays the provided collection while starting with the provided video.
   */
  collection?: Optional<string>;

  /**
   * Whether the embed should be displayed in a dark or light theme.
   *
   * @defaultValue `true`
   */
  darkMode?: Optional<boolean>;

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
   * The ID of the `div` node where the embed is mounted, which the underlying API needs. If you
   * display multiple embeds simultaneously you should provide a static ID for each one. You should
   * not use an ID that depends on the channel name because it triggers unnecessary recreations of the embed.
   *
   * @defaultValue `'twitch-embed'`
   */
  id?: Optional<string>;

  /**
   * Whether the content should start muted when playing. The user can still change the volume later.
   *
   * @defaultValue `false`
   */
  muted?: Optional<boolean>;

  /**
   * Fired when the embed authenticates the client through their stored credentials in the browser.
   *
   * @defaultValue A no-op.
   */
  onAuthenticate?: Optional<(embed: TwitchEmbedInstance, data: OnAuthenticateData) => void>;

  /**
   * Fired when the player pauses.
   *
   * @defaultValue A no-op.
   */
  onVideoPause?: Optional<(embed: TwitchEmbedInstance) => void>;

  /**
   * Fired when the player starts playing or resumes content.
   *
   * @defaultValue A no-op.
   */
  onVideoPlay?: Optional<(embed: TwitchEmbedInstance, data: OnPlayData) => void>;

  /**
   * Fired when the embed is ready for API commands. Use this if you need to keep track of the embed
   * instance. Updating certain props recreates the embed, so this event should keep track of those changes.
   *
   * @defaultValue A no-op.
   */
  onVideoReady?: Optional<(embed: TwitchEmbedInstance) => void>;

  /**
   * The URL of the site that is embedding this player. Multiple values can be added. You don't need
   * to specify this as the current hostname is already picked up by the underlying API.
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
   * The ID of the video to embed.
   */
  video?: Optional<string>;

  /**
   * The width of the embed. Percentage values can be used (i.e. `100%`).
   *
   * @defaultValue `940`
   */
  width?: Optional<number | string>;

  /**
   * Whether the embed should include the live chat or not. This setting is only applied when
   * `channel` is provided, as there are no chat options for VODs.
   *
   * @defaultValue `true`
   */
  withChat?: Optional<boolean>;
}

interface Media {
  channel?: Optional<string>;
  collection?: Optional<string>;
  video?: Optional<string>;
}

interface MountedEmbed {
  id: string;
  media: Media;
  options: TwitchEmbedConstructorOptions;
}

type EmbedEventName = 'onAuthenticate' | 'onVideoPause' | 'onVideoPlay' | 'onVideoReady';

// The handlers always have a value inside the component because every one of them defaults to noop.
type EmbedEventHandlers = { [K in EmbedEventName]: NonNullable<TwitchEmbedProps[K]> };

/**
 * Subscribes to every embed event once. The handlers are read from a ref at call time, so the
 * listeners never have to be reattached when inline props change identity.
 */
const attachListeners = (
  instance: TwitchEmbedInstance,
  EmbedConstructor: TwitchEmbedConstructor,
  handlers: RefObject<EmbedEventHandlers>
): void => {
  instance.addEventListener(EmbedConstructor.AUTHENTICATE, (data: OnAuthenticateData) => handlers.current.onAuthenticate(instance, data));
  instance.addEventListener(EmbedConstructor.VIDEO_PLAY, (data: OnPlayData) => handlers.current.onVideoPlay(instance, data));
  instance.addEventListener(EmbedConstructor.VIDEO_PAUSE, () => handlers.current.onVideoPause(instance));
  instance.addEventListener(EmbedConstructor.VIDEO_READY, () => handlers.current.onVideoReady(instance));
};

/**
 * Switches the media being played through the player API, which keeps the embed alive instead of
 * recreating it.
 */
const switchMedia = (player: TwitchPlayerInstance, previous: Media, next: Media): void => {
  const { channel, collection, video } = next;

  if (channel !== undefined && channel !== '' && channel !== previous.channel) {
    player.setChannel(channel);
  }

  if (video !== undefined && video !== '' && video !== previous.video) {
    player.setVideo(video, 0);
  }

  if (collection !== undefined && collection !== '' && collection !== previous.collection) {
    player.setCollection(collection, video);
  }
};

/**
 * Frames an interactive embed for a stream with its chat, VODs and collections. It exposes the
 * underlying Twitch embed instance through its events, which can be used to control the player from
 * the outside (i.e. custom control components).
 *
 * The Twitch embed script is loaded on demand, so nothing is rendered until it has loaded.
 *
 * The underlying instance is only recreated when the `id` or one of the options owned by the Twitch
 * constructor changes: `allowFullscreen`, `autoplay`, `withChat`, `muted`, `parent`, `darkMode`,
 * `time` and `hideControls`. The `channel`, `video` and `collection` props are switched through the
 * internal API instead, and every other prop, including the event handlers, `height`, `width` and
 * anything forwarded to the `div`, never triggers a recreation. Inline arrow functions are therefore
 * safe to use as handlers, the latest one is always the one that gets called.
 *
 * @example
 * ```tsx
 * import { useRef } from 'react';
 * import { TwitchEmbed } from 'react-twitch-embed';
 * import type { TwitchEmbedInstance } from 'react-twitch-embed';
 *
 * const MyComponent = () => {
 *   const embed = useRef<TwitchEmbedInstance | null>(null); // We use a ref instead of state to avoid rerenders.
 *
 *   const handleReady = (e: TwitchEmbedInstance) => {
 *     embed.current = e;
 *   };
 *
 *   return (
 *     <TwitchEmbed channel="moonstar_x" autoplay muted withChat onVideoReady={handleReady} />
 *   );
 * };
 * ```
 */
export const TwitchEmbed: FC<TwitchEmbedProps> = ({
  allowFullscreen = DEFAULTS.ALLOW_FULLSCREEN,
  autoplay = DEFAULTS.AUTOPLAY,
  channel,
  video,
  collection,
  withChat = DEFAULTS.WITH_CHAT,
  muted = DEFAULTS.MUTED,
  parent,
  darkMode = DEFAULTS.DARK_MODE,
  time = DEFAULTS.TIME,
  hideControls = DEFAULTS.HIDE_CONTROLS,

  onAuthenticate = noop,
  onVideoPlay = noop,
  onVideoPause = noop,
  onVideoReady = noop,

  id = DEFAULTS.ID.TWITCH_EMBED,
  height = DEFAULTS.MEDIA.HEIGHT,
  width = DEFAULTS.MEDIA.WIDTH,
  ...restOfProps
// Every prop default counts towards the complexity of the component, which is not real branching.
// eslint-disable-next-line complexity
}) => {
  const { loading, error } = useScript(URLS.TWITCH_EMBED_URL);
  const parents = useParents(parent);

  // Read through a ref so that inline handlers do not force the embed to be recreated.
  const handlers = useLatest({ onAuthenticate, onVideoPlay, onVideoPause, onVideoReady });

  const embedRef = useRef<TwitchEmbedInstance>(undefined);
  const mountedRef = useRef<MountedEmbed>(undefined);

  // Everything the constructor needs except the media, which is switched through the player API.
  const options = useMemo<TwitchEmbedConstructorOptions>(() => ({
    allowfullscreen: allowFullscreen,
    autoplay,
    layout: withChat ? 'video-with-chat' : 'video',
    muted,
    parent: parents,
    theme: darkMode ? 'dark' : 'light',
    time,
    controls: !hideControls,
    height: '100%',
    width: '100%'
  }), [allowFullscreen, autoplay, withChat, muted, parents, darkMode, time, hideControls]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (error) {
      console.error(error);
      return;
    }

    const EmbedConstructor: Optional<TwitchEmbedConstructor> = (window as TwitchWindow).Twitch?.Embed;

    if (!EmbedConstructor) {
      return;
    }

    const media: Media = { channel, video, collection };
    const previous = mountedRef.current;
    const instance = embedRef.current;
    const shouldReconstruct = !instance ||
      !previous ||
      previous.id !== id ||
      !isShallowEqual(previous.options, options);

    if (shouldReconstruct) {
      clearElementById(id);

      const embed = new EmbedConstructor(id, { ...options, ...media });

      attachListeners(embed, EmbedConstructor, handlers);

      embedRef.current = embed;
      mountedRef.current = { id, options, media };
      return;
    }

    switchMedia(instance.getPlayer(), previous.media, media);
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

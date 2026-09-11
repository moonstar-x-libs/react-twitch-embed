import { useEffect, useMemo, useRef } from 'react';
import type { FC, HTMLAttributes, RefObject } from 'react';
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
  OnSeekData,
  TwitchPlayerConstructor,
  TwitchPlayerConstructorOptions,
  TwitchPlayerInstance,
  TwitchWindow
} from '../utils/types';

type PlayerHTMLAttributes = Omit<HTMLAttributes<HTMLDivElement>, 'onEnded' | 'onPause' | 'onPlay' | 'onPlaying'>;

export interface TwitchPlayerProps extends PlayerHTMLAttributes {
  allowFullscreen?: boolean | undefined;
  autoplay?: boolean | undefined;
  channel?: string | undefined;
  collection?: string | undefined;
  height?: number | string | undefined;
  hideControls?: boolean | undefined;
  id?: string | undefined;
  muted?: boolean | undefined;
  onCaptions?: ((player: TwitchPlayerInstance, captions: string) => void) | undefined;
  onEnded?: ((player: TwitchPlayerInstance) => void) | undefined;

  onOffline?: ((player: TwitchPlayerInstance) => void) | undefined;
  onOnline?: ((player: TwitchPlayerInstance) => void) | undefined;
  onPause?: ((player: TwitchPlayerInstance) => void) | undefined;
  onPlay?: ((player: TwitchPlayerInstance, data: OnPlayData) => void) | undefined;
  onPlaybackBlocked?: ((player: TwitchPlayerInstance) => void) | undefined;
  onPlaying?: ((player: TwitchPlayerInstance) => void) | undefined;
  onReady?: ((player: TwitchPlayerInstance) => void) | undefined;
  onSeek?: ((player: TwitchPlayerInstance, data: OnSeekData) => void) | undefined;
  parent?: Parent | undefined;
  playsInline?: boolean | undefined;

  time?: string | undefined;
  video?: string | undefined;
  width?: number | string | undefined;
}

type PlayerEventName = 'onCaptions' | 'onEnded' | 'onOffline' | 'onOnline' | 'onPause' | 'onPlay' | 'onPlaybackBlocked' | 'onPlaying' | 'onReady' | 'onSeek';

// The handlers always have a value inside the component because every one of them defaults to noop.
type PlayerEventHandlers = { [K in PlayerEventName]: NonNullable<TwitchPlayerProps[K]> };

interface Media {
  channel?: string | undefined;
  collection?: string | undefined;
  video?: string | undefined;
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

const TwitchPlayer: FC<TwitchPlayerProps> = ({
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

    const PlayerConstructor: TwitchPlayerConstructor | undefined = (window as TwitchWindow).Twitch?.Player;

    if (!PlayerConstructor) {
      return;
    }

    const media: Media = { channel, video, collection };
    const previous = mountedRef.current;
    const instance = playerRef.current;
    const isMustReconstruct = !instance ||
      !previous ||
      previous.id !== id ||
      !isShallowEqual(previous.options, options);

    if (isMustReconstruct) {
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

export default TwitchPlayer;

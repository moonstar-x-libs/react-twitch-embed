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
  OnPlayData,
  TwitchEmbedConstructor,
  TwitchEmbedConstructorOptions,
  TwitchEmbedInstance,
  TwitchPlayerInstance,
  TwitchWindow
} from '../utils/types';

export interface TwitchEmbedProps extends ComponentProps<'div'> {
  allowFullscreen?: boolean | undefined;
  autoplay?: boolean | undefined;
  channel?: string | undefined;
  collection?: string | undefined;
  darkMode?: boolean | undefined;
  height?: number | string | undefined;
  hideControls?: boolean | undefined;
  id?: string | undefined;
  muted?: boolean | undefined;
  onAuthenticate?: ((embed: TwitchEmbedInstance, data: OnAuthenticateData) => void) | undefined;
  onVideoPause?: ((embed: TwitchEmbedInstance) => void) | undefined;

  onVideoPlay?: ((embed: TwitchEmbedInstance, data: OnPlayData) => void) | undefined;
  onVideoReady?: ((embed: TwitchEmbedInstance) => void) | undefined;
  parent?: Parent | undefined;
  time?: string | undefined;

  video?: string | undefined;
  width?: number | string | undefined;
  withChat?: boolean | undefined;
}

interface Media {
  channel?: string | undefined;
  collection?: string | undefined;
  video?: string | undefined;
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

const TwitchEmbed: FC<TwitchEmbedProps> = ({
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

    const EmbedConstructor: TwitchEmbedConstructor | undefined = (window as TwitchWindow).Twitch?.Embed;

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

export default TwitchEmbed;

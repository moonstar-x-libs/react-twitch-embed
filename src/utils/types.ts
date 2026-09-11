/**
 * A value that might not be present.
 */
export type Optional<T> = T | undefined;

/**
 * A value that might be explicitly empty.
 */
export type Nullable<T> = null | T;

/**
 * The payload received by the play events of the embed and the player.
 */
export interface OnPlayData {
  /**
   * The ID of the playback session that just started.
   */
  sessionId: string;
}

/**
 * The payload received by the seek event of the player.
 */
export interface OnSeekData {
  /**
   * The timestamp, in seconds, the playback has seeked to.
   */
  position: number;
}

/**
 * UNDOCUMENTED. The payload received by the authenticate event of the embed, describing the user
 * whose stored browser credentials were used.
 */
export interface OnAuthenticateData {
  /**
   * The display name of the authenticated user.
   */
  displayName: string;

  /**
   * The ID of the authenticated user.
   */
  id: string;

  /**
   * The URL of the profile picture of the authenticated user.
   */
  profileImageURL: string;
}

/**
 * One of the video qualities available for the content being played, as returned by
 * {@link TwitchPlayerInstance.getQualities}.
 */
export interface PlayerQuality {
  /**
   * The bitrate of this quality, in bits per second.
   */
  bitrate: number;

  /**
   * The codecs used by this quality, comma-separated (video,audio).
   */
  codecs: string;

  /**
   * The frame rate of this quality. Not available on all browsers.
   */
  framerate?: Optional<number>;

  /**
   * The group name of this quality, which is the value accepted by {@link TwitchPlayerInstance.setQuality}.
   */
  group: string;

  /**
   * The height of this quality, in pixels.
   */
  height: number;

  /**
   * Whether this is the quality the player selects by default.
   */
  isDefault: boolean;

  /**
   * The human readable name of this quality (eg. 1080p60).
   */
  name: string;

  /**
   * The width of this quality, in pixels.
   */
  width: number;
}

/**
 * Statistics on the embedded video player and the current live stream or VOD, as returned by
 * {@link TwitchPlayerInstance.getPlaybackStats}.
 */
export interface PlaybackStats {
  /**
   * The version of the Twitch video player backend.
   */
  backendVersion: string;

  /**
   * The size of the video buffer in seconds.
   */
  bufferSize: number;

  /**
   * Codecs currently in use, comma-separated (video,audio).
   */
  codecs: string;

  /**
   * The current size of the video player element (eg. 850x480).
   */
  displayResolution: string;

  /**
   * The video playback rate in frames per second. Not available on all browsers.
   */
  fps: number;

  /**
   * Current latency to the broadcaster in seconds. Only available for live content.
   */
  hlsLatencyBroadcaster: number;

  /**
   * The playback bitrate in Kbps.
   */
  playbackRate: number;

  /**
   * The number of dropped frames.
   */
  skippedFrames: number;

  /**
   * The native resolution of the current video (eg. 640x480).
   */
  videoResolution: string;
}

/**
 * UNDOCUMENTED. A snapshot of the current state of the player, as returned by
 * {@link TwitchPlayerInstance.getPlayerState}.
 */
export interface PlayerState {
  /**
   * The ID of the channel being played.
   */
  channelID: string;

  /**
   * The name of the channel being played.
   */
  channelName: string;

  /**
   * The ID of the collection being played.
   */
  collectionID: string;

  /**
   * The timestamp of the content being played, in seconds.
   */
  currentTime: number;

  /**
   * The duration of the content being played, in seconds.
   */
  duration: number;

  /**
   * Whether the live stream or VOD has ended.
   */
  ended: boolean;

  /**
   * Whether the player is muted. This is independent of the volume setting.
   */
  muted: boolean;

  /**
   * The current playback status of the player.
   */
  playback: 'Buffering' | 'Ended' | 'Idle' | 'Playing' | 'Ready';

  /**
   * The group names of the video qualities available for the content being played.
   */
  qualitiesAvailable: string[];

  /**
   * The group name of the video quality currently being played.
   */
  quality: string;

  /**
   * The playback statistics of the player.
   */
  stats: {
    videoStats: PlaybackStats;
  };

  /**
   * The ID of the video being played.
   */
  videoID: string;

  /**
   * The volume level, a value between 0.0 and 1.0.
   */
  volume: number;
}

/**
 * The instance of the Twitch player created by {@link TwitchPlayerConstructor}, exposed by the
 * events of the `TwitchPlayer` component.
 *
 * These typings are unofficial and were made empirically, so some of them might not be accurate.
 */
export interface TwitchPlayerInstance extends EventTarget {
  /**
   * Subscribes a callback to one of the events exposed by {@link TwitchPlayerConstructor}. The
   * `TwitchPlayer` component already subscribes to every event, so you rarely need to call this yourself.
   * @param event
   * @param callback
   */
  // The payload depends on the event, so each caller narrows it at the call site.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addEventListener: (event: string, callback: (...args: any[]) => void) => void;

  /**
   * Disables display of Closed Captions.
   */
  disableCaptions: () => void;

  /**
   * Enables display of Closed Captions. Note captions will only display if they are included in the video content being played.
   * See the CAPTIONS JavaScript Event for more info.
   */
  enableCaptions: () => void;

  /**
   * Returns the channel’s name. Works only for live streams, not VODs.
   */
  getChannel: () => Optional<string>;

  /**
   * UNDOCUMENTED. Get the ID of the channel being played.
   */
  getChannelId: () => Optional<string>;

  /**
   * UNDOCUMENTED. Get the collection being played.
   */
  getCollection: () => Optional<string>;

  /**
   * Returns the current video’s timestamp, in seconds. Works only for VODs, not live streams.
   */
  getCurrentTime: () => number;

  /**
   * Returns the duration of the video, in seconds. Works only for VODs,not live streams.
   */
  getDuration: () => number;

  /**
   * Returns true if the live stream or VOD has ended; otherwise, false.
   */
  getEnded: () => boolean;

  /**
   * Returns true if the player is muted; otherwise, false.
   */
  getMuted: () => boolean;

  /**
   * Returns an object with statistics on the embedded video player and the current live stream or VOD.
   * See below for more info.
   */
  getPlaybackStats: () => PlaybackStats;

  /**
   * UNDOCUMENTED. Get the current state of the player.
   */
  getPlayerState: () => PlayerState;

  /**
   * Returns the available video qualities. For example, chunked (pass-through of the original source).
   */
  getQualities: () => PlayerQuality[];

  /**
   * Returns the current quality of video playback.
   */
  getQuality: () => string;

  /**
   * Returns the video ID. Works only for VODs, not live streams.
   */
  getVideo: () => Optional<string>;

  /**
   * Returns the volume level, a value between 0.0 and 1.0.
   */
  getVolume: () => number;

  /**
   * Returns true if the video is paused; otherwise, false. Buffering or seeking is considered playing.
   */
  isPaused: () => boolean;

  /**
   * Pauses the player.
   */
  pause: () => void;

  /**
   * Begins playing the specified video.
   */
  play: () => void;

  /**
   * Seeks to the specified timestamp (in seconds) in the video. Does not work for live streams.
   */
  seek: (timestamp: number) => void;

  /**
   * Sets the channel to be played.
   * @param channel
   */
  setChannel: (channel: string) => void;

  /**
   * UNDOCUMENTED. Set the ID of the channel to play.
   * @param channelId
   */
  setChannelId: (channelId: string) => void;

  /**
   * Sets the collection to be played.
   *
   * Optionally also specifies the video within the collection, from which to start playback.
   * If a video ID is not provided here or the specified video is not part of the collection
   * playback starts with the first video in the collection.
   * @param collection
   * @param videoId
   */
  setCollection: (collection: string, videoId?: string) => void;

  /**
   * If true, mutes the player; otherwise, unmutes it. This is independent of the volume setting.
   * @param isMuted
   */
  setMuted: (isMuted: boolean) => void;

  /**
   * Sets the quality of the video. quality should be a string value returned by getQualities.
   * @param quality
   */
  setQuality: (quality: string) => void;

  /**
   * Sets the video to be played to be played and starts playback at timestamp (in seconds).
   * @param video
   * @param timestamp
   */
  setVideo: (video: string, timestamp: number) => void;

  /**
   * Sets the volume to the specified volume level, a value between 0.0 and 1.0.
   * @param volumeLevel
   */
  setVolume: (volumeLevel: number) => void;
}

/**
 * The options accepted by {@link TwitchPlayerConstructor}. These are the Twitch option names, which
 * the `TwitchPlayer` component builds from its own props.
 */
export interface TwitchPlayerConstructorOptions {
  /**
   * Whether the player allows the content to be played in fullscreen mode.
   */
  allowfullscreen?: Optional<boolean>;

  /**
   * Whether the content should autoplay on load.
   */
  autoplay?: Optional<boolean>;

  /**
   * The name of the channel to play their stream.
   */
  channel?: Optional<string>;

  /**
   * The ID of the collection to play.
   */
  collection?: Optional<string>;

  /**
   * Whether the player controls should be displayed.
   */
  controls?: Optional<boolean>;

  /**
   * The height of the player. Percentage values can be used (i.e. `100%`).
   */
  height?: Optional<number | string>;

  /**
   * Whether the content should start muted when playing.
   */
  muted?: Optional<boolean>;

  /**
   * The hostnames of the sites that are embedding this player, one entry per host.
   */
  parent?: Optional<string[]>;

  /**
   * Whether the player plays inline for mobile iOS apps.
   */
  playsinline?: Optional<boolean>;

  /**
   * The timestamp from where the content should play, formatted like `XhYmZs`.
   */
  time?: Optional<string>;

  /**
   * The ID of the video to play.
   */
  video?: Optional<string>;

  /**
   * The width of the player. Percentage values can be used (i.e. `100%`).
   */
  width?: Optional<number | string>;
}

/**
 * The `Twitch.Player` constructor downloaded into the browser's `window` object by the Twitch player
 * script, along with the names of the events its instances emit.
 *
 * These typings are unofficial and were made empirically, so some of them might not be accurate.
 */
export interface TwitchPlayerConstructor {
  /**
   * Creates a player inside the element with the given ID, replacing its contents.
   * @param id
   * @param options
   */
  new (id: string, options: TwitchPlayerConstructorOptions): TwitchPlayerInstance;

  /**
   * Closed captions are found in the video content being played.
   * This event will be emitted once for each new batch of captions,
   * in sync with the corresponding video content.
   * The event payload is a string containing the caption content.
   */
  CAPTIONS: string;

  /**
   * Video or stream ends.
   */
  ENDED: string;

  /**
   * Loaded channel goes offline.
   */
  OFFLINE: string;

  /**
   * Loaded channel goes online.
   */
  ONLINE: string;

  /**
   * Player is paused. Buffering and seeking is not considered paused.
   */
  PAUSE: string;

  /**
   * Player just unpaused, will either start video playback or start buffering.
   */
  PLAY: string;

  /**
   * Player playback was blocked. Usually fired after an unmuted autoplay or unmuted programmatic call on play().
   */
  PLAYBACK_BLOCKED: string;

  /**
   * Player started video playback.
   */
  PLAYING: string;

  /**
   * Player is ready to accept function calls.
   */
  READY: string;

  /**
   * User has used the player controls to seek a VOD, the seek() method has been called,
   * or live playback has seeked to sync up after being paused.
   */
  SEEK: string;
}

/**
 * The instance of the Twitch embed created by {@link TwitchEmbedConstructor}, exposed by the events
 * of the `TwitchEmbed` component. It supports the whole {@link TwitchPlayerInstance} API on top of
 * its own members.
 *
 * These typings are unofficial and were made empirically, so some of them might not be accurate.
 */
export interface TwitchEmbedInstance extends TwitchPlayerInstance {
  /**
   * To provide additional functionality to our API, access specific components with getPlayer(),
   * which retrieves the current video player instance from the embed and provides full programmatic access to the video player API.
   */
  getPlayer: () => TwitchPlayerInstance;
}

/**
 * The options accepted by {@link TwitchEmbedConstructor}. These are the Twitch option names, which
 * the `TwitchEmbed` component builds from its own props.
 */
export interface TwitchEmbedConstructorOptions {
  /**
   * Whether the player allows the content to be played in fullscreen mode.
   */
  allowfullscreen?: Optional<boolean>;

  /**
   * Whether the content should autoplay on load.
   */
  autoplay?: Optional<boolean>;

  /**
   * The name of the channel to embed their stream.
   */
  channel?: Optional<string>;

  /**
   * The ID of the collection to embed.
   */
  collection?: Optional<string>;

  /**
   * Whether the player controls should be displayed.
   */
  controls?: Optional<boolean>;

  /**
   * The height of the embed. Percentage values can be used (i.e. `100%`).
   */
  height?: Optional<number | string>;

  /**
   * Whether the embed should include the live chat next to the video.
   */
  layout?: Optional<'video' | 'video-with-chat'>;

  /**
   * Whether the content should start muted when playing.
   */
  muted?: Optional<boolean>;

  /**
   * The hostnames of the sites that are embedding this player, one entry per host.
   */
  parent?: Optional<Nullable<string[]>>;

  /**
   * The theme the embed is displayed with.
   */
  theme?: Optional<'dark' | 'light'>;

  /**
   * The timestamp from where the content should play, formatted like `XhYmZs`.
   */
  time?: Optional<string>;

  /**
   * The ID of the video to embed.
   */
  video?: Optional<string>;

  /**
   * The width of the embed. Percentage values can be used (i.e. `100%`).
   */
  width?: Optional<number | string>;
}

/**
 * The `Twitch.Embed` constructor downloaded into the browser's `window` object by the Twitch embed
 * script, along with the names of the events its instances emit.
 *
 * These typings are unofficial and were made empirically, so some of them might not be accurate.
 */
export interface TwitchEmbedConstructor {
  /**
   * Creates an embed inside the element with the given ID, replacing its contents.
   * @param id
   * @param options
   */
  new (id: string, options: TwitchEmbedConstructorOptions): TwitchEmbedInstance;

  /**
   * UNDOCUMENTED. The embed instance has been authenticated with the user's stored credentials.
   * This callback receives an object with displayName, id and profileImageURL properties.
   */
  AUTHENTICATE: string;

  /**
   * UNDOCUMENTED. The video player has been paused.
   */
  VIDEO_PAUSE: string;

  /**
   * The video started playing. This callback receives an object with a sessionId property.
   */
  VIDEO_PLAY: string;

  /**
   * The video player is ready for API commands.
   */
  VIDEO_READY: string;
}

/**
 * The browser `window` once the Twitch embed or player script has loaded. Cast `window` to this type
 * to reach the constructors that the scripts install, keeping in mind that they are only there after
 * the corresponding script has finished loading.
 *
 * @example
 * ```ts
 * import type { TwitchWindow } from 'react-twitch-embed';
 *
 * const PlayerConstructor = (window as TwitchWindow).Twitch?.Player;
 * ```
 */
export interface TwitchWindow extends Window {
  /**
   * The namespace installed by the Twitch scripts, if any of them has loaded.
   */
  Twitch?: Optional<{
    /**
     * The embed constructor, installed by the Twitch embed script.
     */
    Embed?: Optional<TwitchEmbedConstructor>;

    /**
     * The player constructor, installed by the Twitch player script.
     */
    Player?: Optional<TwitchPlayerConstructor>;
  }>;
}

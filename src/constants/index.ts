export const URLS = {
  TWITCH_EMBED_URL: 'https://embed.twitch.tv/embed/v1.js',
  TWITCH_CHAT_URL: 'https://www.twitch.tv/embed',
  TWITCH_CLIP_URL: 'https://clips.twitch.tv/embed',
  TWITCH_PLAYER_URL: 'https://player.twitch.tv/js/embed/v1.js',
  TWITCH_PLAYER_NON_INTERACTIVE_URL: 'https://player.twitch.tv'
};

export const DEFAULTS = {
  CHAT: {
    HEIGHT: 550,
    WIDTH: 350
  },
  MEDIA: {
    HEIGHT: 480,
    WIDTH: 940
  },
  ID: {
    TWITCH_EMBED: 'twitch-embed',
    TWITCH_PLAYER: 'twitch-player'
  },
  TITLE: {
    TWITCH_CHAT: 'TwitchChat',
    TWITCH_CLIP: 'TwitchClip',
    TWITCH_PLAYER_NON_INTERACTIVE: 'TwitchPlayerNonInteractive'
  },
  ALLOW_FULLSCREEN: true,
  AUTOPLAY: true,
  WITH_CHAT: true,
  MUTED: false,
  DARK_MODE: true,
  TIME: '0h0m0s',
  HIDE_CONTROLS: false,
  INLINE: true
};

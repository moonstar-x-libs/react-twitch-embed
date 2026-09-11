import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import type { TwitchPlayerConstructor, TwitchWindow } from '../utils/types';
import TwitchPlayer from './TwitchPlayer';

const channel = 'channel';
const id = 'twitch-player';

jest.mock('../hooks/useScript', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({ loading: false, error: null })
}));

const setChannelMock = jest.fn();
const setCollectionMock = jest.fn();
const setVideoMock = jest.fn();
const addEventListenerMock = jest.fn<(event: string, listener: () => void) => void>();
// Declared as a function expression so that the component can call it with `new`.
const playerConstructorMock = jest.fn(() => ({
  setChannel: setChannelMock,
  setCollection: setCollectionMock,
  setVideo: setVideoMock,
  addEventListener: addEventListenerMock
}));

Object.assign(playerConstructorMock, {
  CAPTIONS: 'captions',
  ENDED: 'ended',
  PAUSE: 'pause',
  PLAY: 'play',
  PLAYBACK_BLOCKED: 'playbackBlocked',
  PLAYING: 'playing',
  OFFLINE: 'offline',
  ONLINE: 'online',
  READY: 'ready',
  SEEK: 'seek'
});

// eslint-disable-next-line unicorn/no-global-object-property-assignment
(window as TwitchWindow).Twitch = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  Player: playerConstructorMock as unknown as TwitchPlayerConstructor
};

describe('Components -> TwitchPlayer', () => {
  beforeEach(() => {
    playerConstructorMock.mockClear();
    setChannelMock.mockClear();
    setCollectionMock.mockClear();
    setVideoMock.mockClear();
    addEventListenerMock.mockClear();
  });

  it('should render the parent div component.', () => {
    render(<TwitchPlayer channel={channel} data-testid="twitch-player" id={id} />);
    expect(screen.getByTestId('twitch-player')).toBeInTheDocument();
  });

  it('should call setChannel when updating the channel prop.', () => {
    const { rerender } = render(<TwitchPlayer channel={channel} id={id} />);
    rerender(<TwitchPlayer channel="new_channel" id={id} />);
    expect(setChannelMock).toHaveBeenCalledWith('new_channel');
  });

  it('should call setCollection when updating the collection prop.', () => {
    const { rerender } = render(<TwitchPlayer collection={channel} id={id} />);
    rerender(<TwitchPlayer collection="new_collection" id={id} />);
    expect(setCollectionMock).toHaveBeenCalledWith('new_collection', undefined);
  });

  it('should call setCollection when updating the collection and video prop.', () => {
    const { rerender } = render(<TwitchPlayer collection={channel} id={id} />);
    rerender(<TwitchPlayer collection="new_collection" id={id} video="new_video" />);
    expect(setCollectionMock).toHaveBeenCalledWith('new_collection', 'new_video');
  });

  it('should call setVideo when updating the video prop.', () => {
    const { rerender } = render(<TwitchPlayer id={id} video={channel} />);
    rerender(<TwitchPlayer id={id} video="new_video" />);
    expect(setVideoMock).toHaveBeenCalledWith('new_video', 0);
  });

  it('should not recreate the player when the media changes.', () => {
    const { rerender } = render(<TwitchPlayer channel={channel} id={id} />);
    expect(playerConstructorMock).toHaveBeenCalledTimes(1);

    rerender(<TwitchPlayer channel="new_channel" id={id} />);
    expect(playerConstructorMock).toHaveBeenCalledTimes(1);
  });

  it('should not recreate the player when only inline handlers or styles change.', () => {
    const { rerender } = render(
      <TwitchPlayer channel={channel} id={id} parent={['localhost']} style={{ margin: 0 }} onReady={() => undefined} />
    );
    expect(playerConstructorMock).toHaveBeenCalledTimes(1);

    rerender(
      <TwitchPlayer channel={channel} id={id} parent={['localhost']} style={{ margin: 0 }} onReady={() => undefined} />
    );
    expect(playerConstructorMock).toHaveBeenCalledTimes(1);
  });

  it('should recreate the player when an option that the constructor owns changes.', () => {
    const { rerender } = render(<TwitchPlayer channel={channel} id={id} muted={false} />);
    expect(playerConstructorMock).toHaveBeenCalledTimes(1);

    rerender(<TwitchPlayer muted channel={channel} id={id} />);
    expect(playerConstructorMock).toHaveBeenCalledTimes(2);
  });

  it('should call the latest handler even when it changes identity between renders.', () => {
    const first = jest.fn<() => void>();
    const second = jest.fn<() => void>();

    const { rerender } = render(<TwitchPlayer channel={channel} id={id} onReady={first} />);
    rerender(<TwitchPlayer channel={channel} id={id} onReady={second} />);

    const readyListener = addEventListenerMock.mock.calls.find(([event]) => event === 'ready')?.[1];
    expect(readyListener).toBeDefined();
    readyListener?.();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalled();
  });
});

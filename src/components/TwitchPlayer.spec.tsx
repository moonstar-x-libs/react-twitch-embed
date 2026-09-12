import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import useScript from '../hooks/useScript';
import type { TwitchPlayerConstructor, TwitchWindow } from '../utils/types';
import { TwitchPlayer } from './TwitchPlayer';

const channel = 'channel';
const id = 'twitch-player';

jest.mock('../hooks/useScript', () => ({
  __esModule: true,
  default: jest.fn()
}));

const useScriptMock = jest.mocked(useScript);

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

(window as TwitchWindow).Twitch = {
  Player: playerConstructorMock as unknown as TwitchPlayerConstructor
};

describe('Components -> TwitchPlayer', () => {
  beforeEach(() => {
    useScriptMock.mockReturnValue({ loading: false, error: null });
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

  it('should render nothing while the script is still loading.', () => {
    useScriptMock.mockReturnValue({ loading: true, error: null });

    const { container } = render(<TwitchPlayer channel={channel} id={id} />);

    expect(container).toBeEmptyDOMElement();
    expect(playerConstructorMock).not.toHaveBeenCalled();
  });

  it('should log the error and not create the player when the script fails to load.', () => {
    const error = new Error('There was an error loading the script.');
    const spyForConsoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    useScriptMock.mockReturnValue({ loading: false, error });

    render(<TwitchPlayer channel={channel} data-testid="twitch-player" id={id} />);

    expect(spyForConsoleError).toHaveBeenCalledWith(error);
    expect(playerConstructorMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('twitch-player')).toBeInTheDocument();

    spyForConsoleError.mockRestore();
  });

  it('should not create the player when the Twitch namespace is not installed.', () => {
    const twitch = (window as TwitchWindow).Twitch;
    (window as TwitchWindow).Twitch = undefined;

    render(<TwitchPlayer channel={channel} data-testid="twitch-player" id={id} />);

    expect(playerConstructorMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('twitch-player')).toBeInTheDocument();

    (window as TwitchWindow).Twitch = twitch;
  });

  it('should not create the player when the player constructor is not installed.', () => {
    const twitch = (window as TwitchWindow).Twitch;
    (window as TwitchWindow).Twitch = { Player: undefined };

    render(<TwitchPlayer channel={channel} data-testid="twitch-player" id={id} />);

    expect(playerConstructorMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('twitch-player')).toBeInTheDocument();

    (window as TwitchWindow).Twitch = twitch;
  });
});

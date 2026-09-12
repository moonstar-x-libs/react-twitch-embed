import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import useScript from '../hooks/useScript';
import type { TwitchEmbedConstructor, TwitchEmbedConstructorOptions, TwitchWindow } from '../utils/types';
import { TwitchEmbed } from './TwitchEmbed';

const channel = 'channel';
const id = 'twitch-embed';

jest.mock('../hooks/useScript', () => ({
  __esModule: true,
  default: jest.fn()
}));

const useScriptMock = jest.mocked(useScript);

const setChannelMock = jest.fn();
const setCollectionMock = jest.fn();
const setVideoMock = jest.fn();
const addEventListenerMock = jest.fn();
const playerMock = {
  setChannel: setChannelMock,
  setCollection: setCollectionMock,
  setVideo: setVideoMock
};
// Declared as a function expression so that the component can call it with `new`.
const embedConstructorMock = jest.fn((_id: string, _options: TwitchEmbedConstructorOptions) => ({
  getPlayer: (): typeof playerMock => playerMock,
  addEventListener: addEventListenerMock
}));

(window as TwitchWindow).Twitch = {
  Embed: embedConstructorMock as unknown as TwitchEmbedConstructor
};

describe('Components -> TwitchEmbed', () => {
  beforeEach(() => {
    useScriptMock.mockReturnValue({ loading: false, error: null });
    embedConstructorMock.mockClear();
    setChannelMock.mockClear();
    setCollectionMock.mockClear();
    setVideoMock.mockClear();
  });

  it('should render the parent div component.', () => {
    render(<TwitchEmbed channel={channel} data-testid="twitch-embed" id={id} />);
    expect(screen.getByTestId('twitch-embed')).toBeInTheDocument();
  });

  it('should call setChannel when updating the channel prop.', () => {
    const { rerender } = render(<TwitchEmbed channel={channel} id={id} />);
    rerender(<TwitchEmbed channel="new_channel" id={id} />);
    expect(setChannelMock).toHaveBeenCalledWith('new_channel');
  });

  it('should call setCollection when updating the collection prop.', () => {
    const { rerender } = render(<TwitchEmbed collection={channel} id={id} />);
    rerender(<TwitchEmbed collection="new_collection" id={id} />);
    expect(setCollectionMock).toHaveBeenCalledWith('new_collection', undefined);
  });

  it('should call setCollection when updating the collection and video prop.', () => {
    const { rerender } = render(<TwitchEmbed collection={channel} id={id} />);
    rerender(<TwitchEmbed collection="new_collection" id={id} video="new_video" />);
    expect(setCollectionMock).toHaveBeenCalledWith('new_collection', 'new_video');
  });

  it('should call setVideo when updating the video prop.', () => {
    const { rerender } = render(<TwitchEmbed id={id} video={channel} />);
    rerender(<TwitchEmbed id={id} video="new_video" />);
    expect(setVideoMock).toHaveBeenCalledWith('new_video', 0);
  });

  it('should not recreate the embed when the media changes.', () => {
    const { rerender } = render(<TwitchEmbed channel={channel} id={id} />);
    expect(embedConstructorMock).toHaveBeenCalledTimes(1);

    rerender(<TwitchEmbed channel="new_channel" id={id} />);
    expect(embedConstructorMock).toHaveBeenCalledTimes(1);
  });

  it('should not recreate the embed when only inline handlers or styles change.', () => {
    const { rerender } = render(
      <TwitchEmbed channel={channel} id={id} parent={['localhost']} style={{ margin: 0 }} onVideoReady={() => undefined} />
    );
    expect(embedConstructorMock).toHaveBeenCalledTimes(1);

    rerender(
      <TwitchEmbed channel={channel} id={id} parent={['localhost']} style={{ margin: 0 }} onVideoReady={() => undefined} />
    );
    expect(embedConstructorMock).toHaveBeenCalledTimes(1);
  });

  it('should recreate the embed when an option that the constructor owns changes.', () => {
    const { rerender } = render(<TwitchEmbed withChat channel={channel} id={id} />);
    expect(embedConstructorMock).toHaveBeenCalledTimes(1);

    rerender(<TwitchEmbed channel={channel} id={id} withChat={false} />);
    expect(embedConstructorMock).toHaveBeenCalledTimes(2);
  });

  it('should construct the embed with the theme that the darkMode prop selects.', () => {
    const { rerender } = render(<TwitchEmbed darkMode channel={channel} id={id} />);
    expect(embedConstructorMock).toHaveBeenCalledWith(id, expect.objectContaining({ theme: 'dark' }));

    rerender(<TwitchEmbed channel={channel} darkMode={false} id={id} />);
    expect(embedConstructorMock).toHaveBeenCalledWith(id, expect.objectContaining({ theme: 'light' }));
  });

  it('should render nothing while the script is still loading.', () => {
    useScriptMock.mockReturnValue({ loading: true, error: null });

    const { container } = render(<TwitchEmbed channel={channel} id={id} />);

    expect(container).toBeEmptyDOMElement();
    expect(embedConstructorMock).not.toHaveBeenCalled();
  });

  it('should log the error and not create the embed when the script fails to load.', () => {
    const error = new Error('There was an error loading the script.');
    const spyForConsoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    useScriptMock.mockReturnValue({ loading: false, error });

    render(<TwitchEmbed channel={channel} data-testid="twitch-embed" id={id} />);

    expect(spyForConsoleError).toHaveBeenCalledWith(error);
    expect(embedConstructorMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('twitch-embed')).toBeInTheDocument();

    spyForConsoleError.mockRestore();
  });

  it('should not create the embed when the Twitch namespace is not installed.', () => {
    const twitch = (window as TwitchWindow).Twitch;
    (window as TwitchWindow).Twitch = undefined;

    render(<TwitchEmbed channel={channel} data-testid="twitch-embed" id={id} />);

    expect(embedConstructorMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('twitch-embed')).toBeInTheDocument();

    (window as TwitchWindow).Twitch = twitch;
  });

  it('should not create the embed when the embed constructor is not installed.', () => {
    const twitch = (window as TwitchWindow).Twitch;
    (window as TwitchWindow).Twitch = { Embed: undefined };

    render(<TwitchEmbed channel={channel} data-testid="twitch-embed" id={id} />);

    expect(embedConstructorMock).not.toHaveBeenCalled();
    expect(screen.getByTestId('twitch-embed')).toBeInTheDocument();

    (window as TwitchWindow).Twitch = twitch;
  });
});

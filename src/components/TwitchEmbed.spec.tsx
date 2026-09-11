import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import type { TwitchEmbedConstructor, TwitchWindow } from '../utils/types';
import TwitchEmbed from './TwitchEmbed';

const channel = 'channel';
const id = 'twitch-embed';

jest.mock('../hooks/useScript', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({ loading: false, error: null })
}));

const setChannelMock = jest.fn();
const setCollectionMock = jest.fn();
const setVideoMock = jest.fn();
const addEventListenerMock = jest.fn();
// Declared as a function expression so that the component can call it with `new`.
const embedConstructorMock = jest.fn(() => ({
  getPlayer: () => ({
    setChannel: setChannelMock,
    setCollection: setCollectionMock,
    setVideo: setVideoMock
  }),
  addEventListener: addEventListenerMock
}));

// eslint-disable-next-line unicorn/no-global-object-property-assignment
(window as TwitchWindow).Twitch = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  Embed: embedConstructorMock as unknown as TwitchEmbedConstructor
};

describe('Components -> TwitchEmbed', () => {
  beforeEach(() => {
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
});

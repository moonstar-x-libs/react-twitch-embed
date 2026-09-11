import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import type { TwitchPlayerInstance } from '../../src/utils/types';
import withVideoControls from './withVideoControls';

const playMock = jest.fn();
const pauseMock = jest.fn();
const setVolumeMock = jest.fn();

const MockComponent = ({ onReady }: { onReady: (player: TwitchPlayerInstance) => void }): null => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  onReady({
    play: playMock,
    pause: pauseMock,
    setVolume: setVolumeMock
  } as unknown as TwitchPlayerInstance);
  return null;
};

describe('Stories -> Helpers -> withVideoControls()', () => {
  const TestComponent = withVideoControls(MockComponent, 'video', 'onReady');

  beforeEach(() => {
    playMock.mockClear();
    pauseMock.mockClear();
    setVolumeMock.mockClear();
  });

  it('should render controls.', () => {
    render(<TestComponent />);

    expect(screen.getByText(/Play/u)).toBeInTheDocument();
    expect(screen.getByText(/Pause/u)).toBeInTheDocument();
    expect(screen.getByLabelText(/Volume/u)).toBeInTheDocument();
  });

  it('should call the pause player method if Pause button is clicked.', () => {
    render(<TestComponent />);
    const pauseButton = screen.getByText(/Pause/u);

    fireEvent.click(pauseButton);
    expect(pauseMock).toHaveBeenCalled();
  });

  it('should call the play player method if Play button is clicked.', () => {
    render(<TestComponent />);
    const playButton = screen.getByText(/Play/u);

    fireEvent.click(playButton);
    expect(playMock).toHaveBeenCalled();
  });

  it('should call the setVolume player method if range slider is changed.', () => {
    render(<TestComponent />);
    const rangeSlider = screen.getByLabelText(/Volume/u);

    fireEvent.change(rangeSlider, { target: { value: '0.1' } });

    expect(setVolumeMock).toHaveBeenCalledWith(0.1);
  });
});

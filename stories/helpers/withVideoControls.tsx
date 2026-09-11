import type { ChangeEvent, ComponentType, ReactElement } from 'react';
import { useRef } from 'react';
import type { TwitchPlayerInstance } from '../../src/utils/types';

const buttonStyle = {
  margin: '1rem',
  fontSize: '1.3em'
};

const withVideoControls = <P extends object>(
  Component: ComponentType<P>,
  video: string,
  readyEventName: string
) => (): ReactElement => {
  const playerRef = useRef<TwitchPlayerInstance>(null);

  const handlePlay = (): void => {
    playerRef.current?.play();
  };

  const handlePause = (): void => {
    playerRef.current?.pause();
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    playerRef.current?.setVolume(Number(event.currentTarget.value));
  };

  const handleReady = (instance: TwitchPlayerInstance): void => {
    playerRef.current = instance;
  };

  const mediaProps = {
    [readyEventName]: handleReady,
    video
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const props = mediaProps as P;

  return (
    <>
      <Component {...props} />
      <div style={{ margin: '1rem 3rem' }}>
        <div>
          <button style={buttonStyle} type="button" onClick={handlePlay}>Play</button>
          <button style={buttonStyle} type="button" onClick={handlePause}>Pause</button>
        </div>
        <div>
          <label htmlFor="volume-slider">Volume</label>
          <input
            defaultValue={0.5}
            id="volume-slider"
            max={1}
            min={0}
            step={0.05}
            type="range"
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </>
  );
};

export default withVideoControls;

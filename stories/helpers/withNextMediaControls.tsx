import type { ComponentType, ReactElement } from 'react';
import { useState } from 'react';

const buttonStyle = {
  margin: '1rem',
  fontSize: '1.3em'
};

const withNextMediaControls = <P extends object>(
  Component: ComponentType<P>,
  propName: keyof P & string,
  media: readonly string[]
) => (): ReactElement => {
  const [index, setIndex] = useState<number>(0);
  const value = media[index] ?? '';

  const mediaProps: Record<string, string> = { [propName]: value };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const props = mediaProps as P;

  const handlePrevious = (): void => {
    setIndex((current) => (current - 1 + media.length) % media.length);
  };

  const handleNext = (): void => {
    setIndex((current) => (current + 1) % media.length);
  };

  return (
    <>
      <Component {...props} />
      <div style={{ margin: '1rem 3rem' }}>
        <button style={buttonStyle} type="button" onClick={handlePrevious}>Previous</button>
        <span style={buttonStyle}>
          Current
          {propName}
          :
          {value}
        </span>
        <button style={buttonStyle} type="button" onClick={handleNext}>Next</button>
      </div>
    </>
  );
};

export default withNextMediaControls;

import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import TwitchClip from './TwitchClip';

const props = {
  clip: 'clip',
  parent: 'localhost'
};

describe('Components -> TwitchClip', () => {
  it('should render with a provided title.', () => {
    const title = 'SuperClip';
    render(<TwitchClip title={title} {...props} />);
    expect(screen.getByTitle(title)).toBeInTheDocument();
  });

  it('should render with a default title.', () => {
    render(<TwitchClip {...props} />);
    expect(screen.getByTitle('TwitchClip')).toBeInTheDocument();
  });
});

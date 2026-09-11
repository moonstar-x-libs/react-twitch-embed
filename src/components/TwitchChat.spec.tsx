import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { TwitchChat } from './TwitchChat';

const props = {
  channel: 'channel',
  parent: 'localhost'
};

describe('Components -> TwitchChat', () => {
  it('should render with a provided title.', () => {
    const title = 'SuperChat';
    render(<TwitchChat title={title} {...props} />);
    expect(screen.getByTitle(title)).toBeInTheDocument();
  });

  it('should render with a default title.', () => {
    render(<TwitchChat {...props} />);
    expect(screen.getByTitle('TwitchChat')).toBeInTheDocument();
  });
});

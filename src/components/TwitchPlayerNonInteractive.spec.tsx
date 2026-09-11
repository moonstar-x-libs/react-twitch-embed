import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { TwitchPlayerNonInteractive } from './TwitchPlayerNonInteractive';

const props = {
  channel: 'channel'
};

describe('Components -> TwitchPlayerNonInteractive', () => {
  it('should render with a provided title.', () => {
    const title = 'SuperPlayer';
    render(<TwitchPlayerNonInteractive title={title} {...props} />);
    expect(screen.getByTitle(title)).toBeInTheDocument();
  });

  it('should render with a default title.', () => {
    render(<TwitchPlayerNonInteractive {...props} />);
    expect(screen.getByTitle('TwitchPlayerNonInteractive')).toBeInTheDocument();
  });
});

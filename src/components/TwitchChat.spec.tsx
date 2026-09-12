import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import useHostname from '../hooks/useHostname';
import { TwitchChat } from './TwitchChat';

const props = {
  channel: 'channel',
  parent: 'localhost'
};

jest.mock('../hooks/useHostname', () => ({
  __esModule: true,
  default: jest.fn()
}));

const useHostnameMock = jest.mocked(useHostname);

describe('Components -> TwitchChat', () => {
  beforeEach(() => {
    useHostnameMock.mockReturnValue('localhost');
  });

  it('should render with a provided title.', () => {
    const title = 'SuperChat';
    render(<TwitchChat title={title} {...props} />);
    expect(screen.getByTitle(title)).toBeInTheDocument();
  });

  it('should render with a default title.', () => {
    render(<TwitchChat {...props} />);
    expect(screen.getByTitle('TwitchChat')).toBeInTheDocument();
  });

  it('should render nothing when there is no hostname and no parent is provided.', () => {
    useHostnameMock.mockReturnValue(undefined);

    const { container } = render(<TwitchChat channel={props.channel} />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTitle('TwitchChat')).not.toBeInTheDocument();
  });

  it('should render when there is no hostname but a parent is provided.', () => {
    useHostnameMock.mockReturnValue(undefined);

    render(<TwitchChat {...props} />);

    expect(screen.getByTitle('TwitchChat')).toBeInTheDocument();
  });
});

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import useHostname from '../hooks/useHostname';
import { TwitchClip } from './TwitchClip';

const props = {
  clip: 'clip',
  parent: 'localhost'
};

jest.mock('../hooks/useHostname', () => ({
  __esModule: true,
  default: jest.fn()
}));

const useHostnameMock = jest.mocked(useHostname);

describe('Components -> TwitchClip', () => {
  beforeEach(() => {
    useHostnameMock.mockReturnValue('localhost');
  });

  it('should render with a provided title.', () => {
    const title = 'SuperClip';
    render(<TwitchClip title={title} {...props} />);
    expect(screen.getByTitle(title)).toBeInTheDocument();
  });

  it('should render with a default title.', () => {
    render(<TwitchClip {...props} />);
    expect(screen.getByTitle('TwitchClip')).toBeInTheDocument();
  });

  it('should render nothing when there is no hostname and no parent is provided.', () => {
    useHostnameMock.mockReturnValue(undefined);

    const { container } = render(<TwitchClip clip={props.clip} />);

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTitle('TwitchClip')).not.toBeInTheDocument();
  });

  it('should render when there is no hostname but a parent is provided.', () => {
    useHostnameMock.mockReturnValue(undefined);

    render(<TwitchClip {...props} />);

    expect(screen.getByTitle('TwitchClip')).toBeInTheDocument();
  });
});

import { describe, expect, it } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import withAutoplayWarning from './withAutoplayWarning';

const MockComponent = ({ text }: { text: string }): ReactElement => (
  <div>
    {text}
  </div>
);

describe('Stories -> Helpers -> withAutoplayWarning()', () => {
  const TestComponent = withAutoplayWarning(MockComponent);

  it('should render the wrapped component with its props.', () => {
    render(<TestComponent text="hello" />);
    expect(screen.getByText(/^hello$/u)).toBeInTheDocument();
  });

  it('should render the autoplay warning.', () => {
    render(<TestComponent text="hello" />);

    expect(screen.getByText(/Autoplay might not work here/u)).toBeInTheDocument();
    expect(screen.getByText(/Isolated Mode/u)).toBeInTheDocument();
  });

  it('should render a link to the Twitch embed requirements.', () => {
    render(<TestComponent text="hello" />);
    const link = screen.getByRole('link', { name: /requirements/u });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://dev.twitch.tv/docs/embed/#embedded-experiences-requirements');
  });
});

import { describe, expect, it } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import withNextMediaControls from './withNextMediaControls';

const MockComponent = ({ text }: { text: string }): ReactElement => (
  <div>
    {text}
  </div>
);
const propName = 'text';
const values = ['hi', 'hello', 'whats up'];

describe('Stories -> Helpers -> withNextMediaControls()', () => {
  const TestComponent = withNextMediaControls(MockComponent, propName, values);

  it('should render button controls.', () => {
    render(<TestComponent />);
    expect(screen.getByText(/Previous/u)).toBeInTheDocument();
    expect(screen.getByText(/Next/u)).toBeInTheDocument();
  });

  it('should render current value.', () => {
    render(<TestComponent />);
    expect(screen.getByText(/^hi$/u)).toBeInTheDocument();
  });

  it('should update to the next and previous values when Next and Previous buttons are clicked.', () => {
    render(<TestComponent />);
    const nextButton = screen.getByText(/Next/u);
    const previousButton = screen.getByText(/Previous/u);

    fireEvent.click(nextButton);
    expect(screen.getByText(/^hello$/u)).toBeInTheDocument();

    fireEvent.click(previousButton);
    expect(screen.getByText(/^hi$/u)).toBeInTheDocument();
  });

  it('should update to the last value when Previous button is clicked and the current value is the first one.', () => {
    render(<TestComponent />);
    const previousButton = screen.getByText(/Previous/u);
    fireEvent.click(previousButton);
    expect(screen.getByText(/^whats up$/u)).toBeInTheDocument();
  });

  it('should render an empty value when there is no media to show.', () => {
    const EmptyComponent = withNextMediaControls(MockComponent, propName, []);
    render(<EmptyComponent />);

    expect(screen.getByText(new RegExp(`Current${propName}:$`, 'u'))).toBeInTheDocument();
  });

  it('should update to the first value when Next button is clicked and the current value is the last one.', () => {
    render(<TestComponent />);
    const nextButton = screen.getByText(/Next/u);

    for (const _ of values) {
      fireEvent.click(nextButton);
    }

    expect(screen.getByText(/^hi$/u)).toBeInTheDocument();
  });
});

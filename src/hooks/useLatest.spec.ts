import { describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { useEffect } from 'react';
import useLatest from './useLatest';

describe('Hooks -> useLatest', () => {
  it('should hold the initial value right after mounting.', () => {
    const { result } = renderHook(() => useLatest('first'));
    expect(result.current.current).toBe('first');
  });

  it('should hold the new value after a rerender.', () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 'first' }
    });

    rerender({ value: 'second' });

    expect(result.current.current).toBe('second');
  });

  it('should keep the same ref object across rerenders.', () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 'first' }
    });
    const ref = result.current;

    rerender({ value: 'second' });

    expect(result.current).toBe(ref);
  });

  it('should update the ref on every rerender, even when the value does not change.', () => {
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: 'same' }
    });

    result.current.current = 'tampered';
    rerender({ value: 'same' });

    expect(result.current.current).toBe('same');
  });

  it('should work with function values.', () => {
    const first = jest.fn();
    const second = jest.fn();
    const { result, rerender } = renderHook(({ value }) => useLatest(value), {
      initialProps: { value: first }
    });

    rerender({ value: second });
    result.current.current();

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalled();
  });

  it('should hold undefined when undefined is passed.', () => {
    const { result } = renderHook(() => useLatest(undefined));
    expect(result.current.current).toBeUndefined();
  });

  it('should be updated before effects declared after it run.', () => {
    const seen: string[] = [];

    const useUnderTest = ({ value }: { value: string }): void => {
      const ref = useLatest(value);
      useEffect(() => {
        seen.push(ref.current);
      });
    };

    const { rerender } = renderHook(useUnderTest, { initialProps: { value: 'first' } });

    rerender({ value: 'second' });

    expect(seen).toEqual(['first', 'second']);
  });
});

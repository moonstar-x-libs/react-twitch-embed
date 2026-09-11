import { describe, expect, it } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import useParents from './useParents';

describe('Hooks -> useParents', () => {
  it('should return undefined when no parent is given.', () => {
    const { result } = renderHook(() => useParents(undefined));
    expect(result.current).toBeUndefined();
  });

  it('should wrap a single host in an array.', () => {
    const { result } = renderHook(() => useParents('localhost'));
    expect(result.current).toEqual(['localhost']);
  });

  it('should keep every host of an array.', () => {
    const { result } = renderHook(() => useParents(['host1', 'host2']));
    expect(result.current).toEqual(['host1', 'host2']);
  });

  it('should stay referentially stable when an equal array literal is passed again.', () => {
    const { result, rerender } = renderHook(({ parent }) => useParents(parent), {
      initialProps: { parent: ['host1', 'host2'] }
    });
    const first = result.current;

    rerender({ parent: ['host1', 'host2'] });

    expect(result.current).toBe(first);
  });

  it('should return a new array when the hosts change.', () => {
    const { result, rerender } = renderHook(({ parent }) => useParents(parent), {
      initialProps: { parent: ['host1'] }
    });
    const first = result.current;

    rerender({ parent: ['host2'] });

    expect(result.current).not.toBe(first);
    expect(result.current).toEqual(['host2']);
  });
});

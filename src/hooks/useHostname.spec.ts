import { describe, expect, it } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import useHostname from './useHostname';

const hostname = 'localhost';

describe('Hooks -> useHostname', () => {
  it('should return the hostname.', () => {
    const { result } = renderHook(() => useHostname());
    expect(result.current).toBe(hostname);
  });
});

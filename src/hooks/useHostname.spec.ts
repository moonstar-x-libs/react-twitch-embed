/**
 * jsdom locks `window.location` down as non-configurable, so the hostname under
 * test has to come from the environment URL rather than a redefined property.
 *
 * @jest-environment-options {"url": "https://example.com"}
 */

import { renderHook } from '@testing-library/react';
import useHostname from './useHostname';

const hostname = 'example.com';

describe('Hooks -> useHostname', () => {
  it('should return the hostname.', () => {
    const { result } = renderHook(() => useHostname());
    expect(result.current).toBe(hostname);
  });
});

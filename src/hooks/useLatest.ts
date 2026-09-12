import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

/**
 * Keeps a ref pointing at the most recent value. Useful to read event handlers from inside an
 * effect without making that effect depend on their identity.
 *
 * Must be called before any effect that reads the ref so that the update runs first.
 */
const useLatest = <T>(value: T): RefObject<T> => {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref;
};

export default useLatest;

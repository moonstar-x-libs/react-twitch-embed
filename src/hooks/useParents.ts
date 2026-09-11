import { useMemo } from 'react';
import type { Parent } from '../utils/parent';

/**
 * Normalizes the `parent` prop into a referentially stable array so that passing an inline
 * array literal does not force the Twitch embed to be recreated on every render.
 */
const useParents = (parent?: Parent): string[] | undefined => {
  // Hostnames cannot contain commas, so a joined string is a safe value-based key for the memo.
  const key = Array.isArray(parent) ? parent.join(',') : parent;

  return useMemo(() => key === undefined ? undefined : key.split(','), [key]);
};

export default useParents;

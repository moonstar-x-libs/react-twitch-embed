/**
 * Compares two objects by their own enumerable keys using strict equality on each value.
 */
export const isShallowEqual = (o1: Record<string, unknown>, o2: Record<string, unknown>): boolean => {
  const keys = new Set([...Object.keys(o1), ...Object.keys(o2)]);

  for (const key of keys) {
    if (o1[key] !== o2[key]) {
      return false;
    }
  }

  return true;
};

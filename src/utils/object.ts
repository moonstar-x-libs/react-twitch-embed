/**
 * Compares two objects by their own enumerable keys using strict equality on each value.
 */
export const isShallowEqual = <T extends object>(o1: T, o2: T): boolean => {
  const values1 = new Map<string, unknown>(Object.entries(o1));
  const values2 = new Map<string, unknown>(Object.entries(o2));
  const keys = new Set([...values1.keys(), ...values2.keys()]);

  for (const key of keys) {
    if (values1.get(key) !== values2.get(key)) {
      return false;
    }
  }

  return true;
};

import { describe, expect, it } from '@jest/globals';
import { isShallowEqual } from './object';

describe('Utils -> object', () => {
  describe('shallowEqual()', () => {
    it('should return true for the same object.', () => {
      const object = { a: 1, b: 2, c: 3 };
      expect(isShallowEqual(object, object)).toBe(true);
    });

    it('should return true if all values are strictly equal.', () => {
      expect(isShallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
    });

    it('should return false if a value has changed.', () => {
      expect(isShallowEqual({ a: 1, b: 2 }, { a: 1, b: 3 })).toBe(false);
    });

    it('should return false if a key is only present in one of the objects.', () => {
      expect(isShallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
      expect(isShallowEqual({ a: 1, b: 2 }, { a: 1 })).toBe(false);
    });

    it('should compare nested values by reference.', () => {
      const nested = { deep: true };
      expect(isShallowEqual({ nested }, { nested })).toBe(true);
      expect(isShallowEqual({ nested: { deep: true } }, { nested: { deep: true } })).toBe(false);
    });

    it('should treat an undefined value and a missing key as equal.', () => {
      expect(isShallowEqual({ a: undefined }, {})).toBe(true);
    });
  });
});

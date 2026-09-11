import { describe, expect, it } from '@jest/globals';
import { appendParents, toParentList } from './parent';

describe('Utils -> parent', () => {
  describe('toParentList()', () => {
    it('should wrap a single host in an array.', () => {
      expect(toParentList('localhost')).toEqual(['localhost']);
    });

    it('should return the array as is.', () => {
      expect(toParentList(['host1', 'host2'])).toEqual(['host1', 'host2']);
    });

    it('should return undefined for an empty parent.', () => {
      expect(toParentList(undefined)).toBeUndefined();
      expect(toParentList('')).toBeUndefined();
    });
  });

  describe('appendParents()', () => {
    it('should append a single parent.', () => {
      const params = new URLSearchParams();
      appendParents(params, 'localhost');
      expect(params.getAll('parent')).toEqual(['localhost']);
    });

    it('should append every parent of an array.', () => {
      const params = new URLSearchParams();
      appendParents(params, ['host1', 'host2', 'host3']);
      expect(params.getAll('parent')).toEqual(['host1', 'host2', 'host3']);
    });
  });
});

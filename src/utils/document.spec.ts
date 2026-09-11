import { beforeEach, describe, expect, it } from '@jest/globals';
import { clearElementById } from './document';

const id = 'my-id';

describe('Utils -> document', () => {
  beforeEach(() => {
    // eslint-disable-next-line unicorn/no-unsafe-dom-html
    document.body.innerHTML = `<div id="${id}">Full of html</div>`;
  });

  describe('clearElementById()', () => {
    it('should clear the html content of the container if found.', () => {
      const container = document.querySelector(`#${id}`);

      // eslint-disable-next-line unicorn/prefer-dom-node-html-methods
      expect(container?.innerHTML).not.toHaveLength(0);
      clearElementById(id);
      // eslint-disable-next-line unicorn/prefer-dom-node-html-methods
      expect(container?.innerHTML).toHaveLength(0);
    });

    it('should do nothing if the container is not found.', () => {
      // eslint-disable-next-line max-nested-callbacks
      expect(() => clearElementById('not-there')).not.toThrow();
    });
  });
});

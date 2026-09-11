import type { Optional } from './types';

export type Parent = string | string[];

export const toParentList = (parent: Optional<Parent>): Optional<string[]> => {
  if (parent === undefined || parent === '') {
    return undefined;
  }

  return Array.isArray(parent) ? parent : [parent];
};

/**
 * Twitch expects one `parent` query parameter per embedding host.
 */
export const appendParents = (params: URLSearchParams, parent: Parent): void => {
  const parentList = toParentList(parent) ?? [];
  for (const host of parentList) {
    params.append('parent', host);
  }
};

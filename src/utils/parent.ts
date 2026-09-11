import type { Optional } from './types';

/**
 * The hostname, or hostnames, of the site that embeds the Twitch content. Twitch requires that every
 * embed declares it, so the components fall back to `window.location.hostname` when the `parent` prop
 * is not given. You only need to set it yourself if you run a particular setup with multiple domains.
 */
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

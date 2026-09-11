export type Parent = string | string[];

export const toParentList = (parent: Parent | undefined): string[] | undefined => {
  if (!parent) {
    return undefined;
  }

  return Array.isArray(parent) ? parent : [parent];
};

/**
 * Twitch expects one `parent` query parameter per embedding host.
 */
export const appendParents = (params: URLSearchParams, parent: Parent): void => {
  toParentList(parent)?.forEach((host) => params.append('parent', host));
};

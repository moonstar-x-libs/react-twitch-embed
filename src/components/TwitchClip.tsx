import type { ComponentProps, FC } from 'react';
import { DEFAULTS } from '../constants';
import useHostname from '../hooks/useHostname';
import type { Parent } from '../utils/parent';
import { generateUrl } from '../utils/TwitchClip';

export interface TwitchClipProps extends Omit<ComponentProps<'iframe'>, 'src'> {
  autoplay?: boolean | undefined;
  clip: string;
  height?: number | string | undefined;
  muted?: boolean | undefined;

  parent?: Parent | undefined;
  title?: string | undefined;
  width?: number | string | undefined;
}

const TwitchClip: FC<TwitchClipProps> = ({
  clip,
  parent,
  style,
  autoplay = DEFAULTS.AUTOPLAY,
  muted = DEFAULTS.MUTED,

  title = DEFAULTS.TITLE.TWITCH_CLIP,
  height = DEFAULTS.MEDIA.HEIGHT,
  width = DEFAULTS.MEDIA.WIDTH,
  ...props
}) => {
  const hostname = useHostname();
  const resolvedParent = parent ?? hostname;

  if (resolvedParent === undefined) {
    return null;
  }

  return (
    <iframe
      height={height}
      src={generateUrl(clip, resolvedParent, { autoplay, muted })}
      style={{ border: 'none', ...style }}
      title={title}
      width={width}
      {...props}
    />
  );
};

export default TwitchClip;

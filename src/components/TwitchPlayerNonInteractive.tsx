import type { ComponentProps, FC } from 'react';
import { DEFAULTS } from '../constants';
import useHostname from '../hooks/useHostname';
import type { Parent } from '../utils/parent';
import { generateUrl } from '../utils/TwitchPlayerNonInteractive';
import type { Optional } from '../utils/types';

export interface TwitchPlayerNonInteractiveProps extends Omit<ComponentProps<'iframe'>, 'src'> {
  autoplay?: Optional<boolean>;
  channel?: Optional<string>;
  collection?: Optional<string>;
  height?: Optional<number | string>;
  muted?: Optional<boolean>;
  parent?: Optional<Parent>;
  time?: Optional<string>;

  title?: Optional<string>;
  video?: Optional<string>;
  width?: Optional<number | string>;
}

const TwitchPlayerNonInteractive: FC<TwitchPlayerNonInteractiveProps> = ({
  parent,
  channel,
  video,
  collection,
  style,
  autoplay = DEFAULTS.AUTOPLAY,
  muted = DEFAULTS.MUTED,
  time = DEFAULTS.TIME,

  title = DEFAULTS.TITLE.TWITCH_PLAYER_NON_INTERACTIVE,
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
      src={generateUrl({ channel, video, collection }, resolvedParent, { autoplay, muted, time })}
      style={{ border: 'none', ...style }}
      title={title}
      width={width}
      {...props}
    />
  );
};

export default TwitchPlayerNonInteractive;

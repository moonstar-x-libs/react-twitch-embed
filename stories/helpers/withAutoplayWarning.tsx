import type { ComponentType, ReactElement } from 'react';

const withAutoplayWarning = <P extends object>(
  Component: ComponentType<P>
) => (props: P): ReactElement => (
  <>
    <Component {...props} />

    <div style={{ padding: '20px', width: '75%', background: '#fff3cd', color: '#664d03', borderRadius: '8px', borderColor: '#ffecb5', border: '1px', marginTop: '20px', fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
      <p>
        Autoplay might not work here. Twitch needs the embed to satisfy some minimal requirements.
      </p>
      <p>
        These requirements include style visibility, which Storybook violates in this case because of the way
        this component is rendered. Autoplay will work here if you use Isolated Mode.
      </p>
      <p>
        This functionality includes play buttons controlled from outside, as the
        {' '}
        <code>playerRef.play()</code>
        {' '}
        method is also affected.
      </p>
      <p>
        Otherwise, this component should autoplay on your own project as long as you follow the
        {' '}
        <a href="https://dev.twitch.tv/docs/embed/#embedded-experiences-requirements">requirements.</a>
      </p>
    </div>
  </>
);

export default withAutoplayWarning;

import { useEffect, useState } from 'react';

export interface ScriptState {
  error: Error | null;
  loading: boolean;
}

const LOADING_ATTRIBUTE = 'data-loading';

const initialState: ScriptState = {
  loading: true,
  error: null
};

const missingSourceState: ScriptState = {
  loading: false,
  error: new Error('No src provided to useScript.')
};

/**
 * Loads an external script once per `src` and reports its loading state. Scripts already present in
 * the document are reused instead of being appended again.
 */
const useScript = (source: string): ScriptState => {
  const [state, setState] = useState<ScriptState>(initialState);

  useEffect(() => {
    if (source === '') {
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CSS.escape(source)}"]`);

    if (existing?.getAttribute(LOADING_ATTRIBUTE) === 'false') {
      // Syncing with a script that some other instance already finished loading. Reading the DOM
      // during render instead would break hydration, so one extra render here is the cheaper trade.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ loading: false, error: null });
      return;
    }

    let script = existing;

    if (!script) {
      script = document.createElement('script');
      script.src = source;
      script.async = true;
      script.setAttribute(LOADING_ATTRIBUTE, 'true');
      document.body.append(script);
    }

    const settle = (error: Error | null): void => {
      script.setAttribute(LOADING_ATTRIBUTE, 'false');
      setState({ loading: false, error });
    };

    const handleLoad = (): void => settle(null);
    const handleError = (): void => settle(new Error(`There was an error loading the script for ${source}.`));

    script.addEventListener('load', handleLoad);
    script.addEventListener('error', handleError);

    return (): void => {
      script.removeEventListener('load', handleLoad);
      script.removeEventListener('error', handleError);
    };
  }, [source]);

  return source === '' ? missingSourceState : state;
};

export default useScript;

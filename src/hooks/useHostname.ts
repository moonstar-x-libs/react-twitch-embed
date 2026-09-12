import { useSyncExternalStore } from 'react';
import type { Optional } from '../utils/types';

// The hostname never changes for the lifetime of the document, so there is nothing to subscribe to.
const voidSubscribe = (): void => undefined;
const subscribe = (): VoidFunction => voidSubscribe;

const getSnapshot = (): Optional<string> => window.location.hostname;

// On the server there is no location, so consumers get `undefined` and can fall back to the `parent` prop.
const getServerSnapshot = (): Optional<string> => undefined;

const useHostname = (): Optional<string> => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export default useHostname;

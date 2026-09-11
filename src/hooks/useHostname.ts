import { useSyncExternalStore } from 'react';

// The hostname never changes for the lifetime of the document, so there is nothing to subscribe to.
const voidSubscribe = (): void => undefined;
const subscribe = (): VoidFunction => voidSubscribe;

const getSnapshot = (): string | undefined => window.location.hostname;

// On the server there is no location, so consumers get `undefined` and can fall back to the `parent` prop.
const getServerSnapshot = (): string | undefined => undefined;

const useHostname = (): string | undefined => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

export default useHostname;

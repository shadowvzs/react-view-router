import React from 'react';
import RouterStore from '@store/RouterStore';
import { IHistory } from '@type/core';

export const RouterCtx = React.createContext<RouterStore<object>>(null as unknown as RouterStore<object>);

interface RouterProviderProps<InjectedData extends object = object> {
    store?: RouterStore<InjectedData>;
    history?: IHistory;
    children: JSX.Element;
    injectedData?: InjectedData;
}

export function RouterProvider<InjectedData extends object = object>({ store, children, history, injectedData }: RouterProviderProps<InjectedData>) {

    if (!store && !history) {
        throw new Error('Provide or store instance or history instance for the RouterProvider');
    }

    if (!store) { store = new RouterStore(history as IHistory, injectedData); }
    React.useEffect(store.init);

    return (
        <RouterCtx.Provider value={store || new RouterStore<InjectedData>(history as IHistory, injectedData)}>
            {children}
        </RouterCtx.Provider>
    );
}
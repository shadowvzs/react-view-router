import React from 'react';
import RouterStore from '@store/RouterStore';
import { IHistory, IRouterStore } from '@type/core';
import BrowserHistory from '@store/BrowserHistory';

export const RouterCtx = React.createContext<RouterStore<object>>(null as unknown as RouterStore<object>);

interface RouterProviderProps<InjectedData extends object = object> {
    store?: RouterStore<InjectedData>;
    history?: IHistory;
    children: JSX.Element;
    injectedData?: InjectedData;
    getInstance?: (item: IRouterStore<InjectedData>) => void;
}

export function RouterProvider<InjectedData extends object = object>({
    store,
    children,
    history,
    injectedData,
    getInstance
}: RouterProviderProps<InjectedData>) {
    if (!store && !history) {
        throw new Error('Provide or store instance or history instance for the RouterProvider');
    }

    if (!history) { history = new BrowserHistory(); }
    if (!store) { store = new RouterStore(history, injectedData); }

    React.useEffect(() => {
        if (!store) { return; }
        if (getInstance) { getInstance(store); }
        return store.init();
    }, [store, getInstance]);

    return (
        <RouterCtx.Provider value={store || new RouterStore<InjectedData>(history, injectedData)}>
            {children}
        </RouterCtx.Provider>
    );
}

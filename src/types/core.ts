import React from 'react';

export type IViewStoreListItem = { v?: IViewStore; key: string; c?: React.FunctionComponent<unknown>; e?: JSX.Element };
export type CanUpdateResultObject = Record<'newViews' | 'updatedViews' | 'removedViews', IViewStoreListItem[]> & {
    map: Record<string, IsApplicableData>;
};
export type ICurrentViewMap = Record<string, { p: IUrlData } & Pick<IViewStoreListItem, 'c' | 'e' | 'v'>>;

export interface IHistory {
    path: string;

    back: () => void;
    forward: () => void;
    go: (index?: number) => void;
    length: number;
    push: (url: string, title?: string, state?: object) => void;
    replace: (url?: string, title?: string, state?: object) => void;
    state: object;
    navigate: (to: string, config?: { mode: 'push' | 'replace' }) => void;
    getPath: () => string;

    location: Location;
    currentData: IHistoryStackItem;
}

export type IHistoryStackItem = [state: object & { id: number }, title: string, url: string];

export type IViewStoreConstructor = new () => IViewStore;

export interface IRouteData {
    path: string;
    exact?: boolean;

    element?: JSX.Element;
    // eslint-disable-next-line
    Cmp?: React.FunctionComponent<CmpProps & any>;
    ViewStore?: IViewStoreConstructor;
}

export interface IUrlData {
    url: string;
    hash: string;
    params: Record<string, string | string[]>;
}

export type CmpProps<Props extends object = object> = IUrlData &
    Props & {
        store: IViewStore;
    };

export type IsApplicableResult = { isApplicable: boolean; urlData: IUrlData };

export interface IsApplicableData extends Pick<IRouteDataItem, 'ViewStore' | 'Cmp' | 'element'> {
    isApplicable: boolean;
    urlData: IUrlData;
    path: string;
    key: string;
}

export interface IRouteDataItem {
    path: string;
    element?: JSX.Element;
    Cmp?: React.FunctionComponent<unknown>;

    ViewStore?: IViewStoreConstructor;
    isApplicable: (url: string) => IsApplicableResult;
}

export interface IViewStore<InjectedData extends object = object> {
    Cmp: React.FunctionComponent<CmpProps>;
    children: JSX.Element | null;
    injectedData: InjectedData;
    router: IRouterStore<InjectedData>;

    canMount: (urlData: IUrlData) => Promise<boolean>;
    canUpdate: (urlData: IUrlData) => Promise<boolean>;
    canUnmount: () => Promise<boolean>;

    beforeMount: () => void;
    beforeUpdate: () => void;
    beforeUnmount: () => void;

    props: IUrlData;
    setProps: (urlData: IUrlData) => void;
    render: () => void;

    mount: (urlData: IUrlData) => void;
    update: (urlData: IUrlData) => void;
    unmount: () => void;
}

export interface IRouterStore<InjectedData> {
    history: IHistory;
    baseUrl: string;
    injectedData?: InjectedData;
    urlData: IUrlData;
    pathname: string;
    currentViews: ICurrentViewMap;

    // INTERNAL USAGE
    // set current path
    setPathname: (extendedPathname: string) => void;
    //get the Route element child based on "key"
    getChildren(key: string): JSX.Element | null;
    // init when component was mounted
    init: () => () => void;
    // get the Route key for check if the route is active or not
    getRouteKey: (data: Pick<IRouteData, 'path' | 'ViewStore' | 'Cmp' | 'element'>) => string;
    // internally used for <Link .../> elements
    onClickToLink: (ev: React.MouseEvent<HTMLAnchorElement>) => void;
    // RouteElement use it internally to register the new route, it is called only 1x (when <Route ...> is mounted into dom)
    registerRoute: (routeData: IRouteData) => void;
}

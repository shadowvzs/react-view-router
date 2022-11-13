import React from 'react';
import { action, makeObservable, observable, reaction, runInAction, toJS } from 'mobx';
import { extractDataFromUrl, urlDecomposer } from '@utils/url';
import ViewStore from './ViewStore';
import type {
    CanUpdateResultObject,
    ICurrentViewMap, IHistory, IRouteData, IRouteDataItem, IRouterStore,
    IsApplicableData, IsApplicableResult, IUrlData, IViewStoreListItem
} from '@type/core';

class RouterStore<InjectedData extends object = object> implements IRouterStore<InjectedData> {
    private _routeValidation = false;
    private _normalRoutes: IRouteDataItem[] = [];
    private _dynamicRoutes: IRouteDataItem[] = [];

    public history: IHistory;
    public baseUrl: string;
    public injectedData?: InjectedData;


    @observable
    public matchedUrls: string[] = [];

    @observable
    public urlData!: IUrlData;

    @observable
    public pathname!: string;

    @observable.shallow
    public currentViews: ICurrentViewMap = {};

    @action.bound
    public setPathname(extendedPathname: string) {
        if (extendedPathname === this.pathname) { return; }
        this.urlData = urlDecomposer(extendedPathname);

        const [pathname] = extendedPathname.split('?');
        const routeDataItemToApplicationData = (routeData: IRouteDataItem): IsApplicableData => {
            const { isApplicable, urlData } = routeData.isApplicable(pathname);
            return {
                isApplicable,
                urlData,
                path: routeData.path,
                ViewStore: routeData.ViewStore,
                Cmp: routeData.Cmp,
                element: routeData.element,
                key: this.getRouteKey(routeData)
            };
        };

        const normalResult = this._normalRoutes
            .map(routeDataItemToApplicationData)
            .filter((x: IsApplicableData) => x.isApplicable);

        const normalPaths = normalResult.map(x => x.path);
        const dynamicResult = this._dynamicRoutes
            .map(routeDataItemToApplicationData)
            .filter((x: IsApplicableData) => {
                if (!x.isApplicable) { return false; }

                // if this path was catched by the normal paths then dont use dynamic path
                const anyMatchWithNormalPath = normalPaths.some(y => extractDataFromUrl(y, x.path, true));
                return !anyMatchWithNormalPath;
            });

        this._routeValidation = true;
        this.canChangeView([...normalResult, ...dynamicResult])
            .then(x => {
                if (!x) { this.history.back(); return; }
                this.changeView(x);
                runInAction(() => this.pathname = pathname);
            })
            .catch(console.error)
            .finally(() => { this._routeValidation = false; });
    }

    constructor(history: IHistory, injectedData?: InjectedData) {
        this.baseUrl = '/';
        this.injectedData = injectedData;
        this.history = history;
        makeObservable(this);
        (window as unknown as { store: RouterStore<InjectedData> })['store'] = this;
    }

    public getRouteKey = (data: Pick<IRouteData, 'path' | 'ViewStore' | 'Cmp' | 'element'>): string => {
        return data.path + '|' + (data.ViewStore?.name || 'noV') + '|' + (data.Cmp?.name || 'noC') + '|' + (data.element ? 'el' : 'noEl');
    };

    @action.bound
    private changeView({ newViews, updatedViews, removedViews, map }: CanUpdateResultObject) {
        if (!newViews.length && !updatedViews.length && !removedViews.length) { return; }
        const newCurrentView = { ...this.currentViews };
        removedViews
            .forEach(x => {
                x.v?.unmount();
                Reflect.deleteProperty(newCurrentView, x.key);
            });
        updatedViews
            .forEach(x => {
                const props = map[x.key].urlData;
                x.v?.update(props);
                newCurrentView[x.key].p = props;
            });
        newViews
            .forEach(x => {
                const item = map[x.key];
                newCurrentView[x.key] = { v: x.v, p: item.urlData, e: item.element };
                if (x.v) {
                    x.v.router = this;
                    x.v.mount(item.urlData);
                }
            });

        this.currentViews = newCurrentView;
    }

    private async canChangeView(applicableResults: IsApplicableData[]): Promise<false | CanUpdateResultObject> {
        const oldKeys = Object.keys(this.currentViews);
        const newKeys = applicableResults.map(x => x.key);
        const map = applicableResults.reduce((t, c) => { t[c.key] = c; return t; }, {} as Record<string, IsApplicableData>);
        const removedViewKeys = oldKeys.filter(x => !newKeys.includes(x));
        const updatedViewKeys = newKeys.filter(x => oldKeys.includes(x));
        const addViewKeys = newKeys.filter(x => !oldKeys.includes(x));
        const removedViews: IViewStoreListItem[] = removedViewKeys.map(x => ({ v: this.currentViews[x].v, key: x }));
        const updatedViews: IViewStoreListItem[] = updatedViewKeys.map(x => ({ v: this.currentViews[x].v, key: x }));
        const newViews: IViewStoreListItem[] = addViewKeys.map(x => {
            const result: IViewStoreListItem = { key: x };
            const data = map[x];
            // if user didn't setted view but Component yes the we use the default ViewStore
            if (!data.ViewStore && data.Cmp) { data.ViewStore = ViewStore; }
            if (data.ViewStore) {
                result.v = new data.ViewStore();
                if (this.injectedData) { result.v.injectedData = this.injectedData; }
                if (data.Cmp) { result.v.Cmp = data.Cmp; }
            }

            return result;
        });

        const canUnmount = (await Promise.all(removedViews.map(x => x.v?.canUnmount()).filter(Boolean))).every(Boolean);
        if (!canUnmount) { return false; }

        const canUpdateOrCreate = (await Promise.all([
            ...updatedViews.map(x => x.v?.canUpdate(map[x.key].urlData)).filter(Boolean),
            ...newViews.map(x => x.v?.canUpdate(map[x.key].urlData)).filter(Boolean),
        ])).every(Boolean);

        if (!canUpdateOrCreate) { return false; }

        return { newViews, updatedViews, removedViews, map };
    }

    public onClickToLink = (ev: React.MouseEvent<HTMLAnchorElement>) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (this._routeValidation) { return; }
        const href = ev.currentTarget.href;
        this.history.navigate(href);
        return false;
    };

    private getApplicableFn = (path: string, exact?: boolean): (url: string) => IsApplicableResult => {
        if (path.includes(':')) {
            return (url: string) => {
                const urlData = toJS(this.urlData);
                const matches = extractDataFromUrl(url, path, exact);
                if (!matches) {
                    return {
                        isApplicable: false,
                        urlData: { ...urlData }
                    };
                }
                return {
                    isApplicable: true,
                    urlData: { ...urlData, params: { ...urlData.params, ...matches, } as Record<string, string | string[]> }
                };
            };
        } else {
            path = path.toLowerCase();
            if (exact) {
                return (url: string) => ({ isApplicable: path === url.toLowerCase(), urlData: { ...toJS(this.urlData) } });
            } else {
                return (url: string) => ({ isApplicable: url.toLowerCase().startsWith(path), urlData: { ...toJS(this.urlData) } });
            }
        }
    };

    public registerRoute({ path, ViewStore, exact = true, Cmp, element }: IRouteData): void {
        if (!element && !Cmp && !ViewStore) {
            throw new Error('Route must have: element or Cmp or ViewStore!');
        }
        const category = (path.includes(':') ? '_dynamicRoutes' : '_normalRoutes');
        const alreadyExist = this[category].find(x => x.ViewStore === ViewStore && x.path === path);
        if (alreadyExist) { return; }
        this[category].push({
            path: path,
            Cmp: Cmp,
            element: element,
            ViewStore: ViewStore,
            isApplicable: this.getApplicableFn(path, exact)
        });
    }

    public getChildren(key: string): JSX.Element | null {
        const routeData = this.currentViews[key];
        if (!routeData) { return null; }
        return routeData.e || routeData.v?.children || null;
    }

    public init = () => {
        // mount
        const cb = reaction(
            () => this.history.path,
            (path: string) => { this.setPathname(path); },
            { fireImmediately: true }
        );

        // unmount
        return () => { cb(); };
    };
}

export default RouterStore;
import React from 'react';
import { action, observable } from 'mobx';
import type { CmpProps, IRouterStore, IUrlData, IViewStore } from '@type/core';

/* eslint-disable  @typescript-eslint/no-explicit-any */
class ViewStore<InjectedData extends object = object> implements IViewStore<InjectedData> {
    public Cmp!: React.FC<CmpProps<object>>;
    public injectedData: InjectedData;
    public router!: IRouterStore<InjectedData>;

    public props!: IUrlData;
    public setProps(props: IUrlData) { this.props = props; }

    @observable
    public children: JSX.Element | null = null;
    @action.bound
    public setChildren(children: JSX.Element | null) { this.children = children; }

    public canMount(_urlData: IUrlData) { return Promise.resolve(true); }
    public canUpdate(_urlData: IUrlData) { return Promise.resolve(true); }
    public canUnmount() { return Promise.resolve(true); }

    public beforeMount() { return undefined as void; }
    public beforeUpdate() { return undefined as void; }
    public beforeUnmount() { return undefined as void; }

    constructor() {
        this.injectedData = {} as InjectedData;
        this.canMount = this.canMount.bind(this);
        this.canUpdate = this.canUpdate.bind(this);
        this.canUnmount = this.canUnmount.bind(this);

        this.mount = this.mount.bind(this);
        this.update = this.update.bind(this);
        this.unmount = this.unmount.bind(this);
    }

    public mount(props: IUrlData) {
        this.setProps(props);
        this.beforeMount();
        this.render();
    }

    public update(props: IUrlData) {
        this.setProps(props);
        this.beforeUpdate();
        this.render();
    }

    public unmount() {
        this.beforeUnmount();
        this.setChildren(null);
    }

    public render(): void {
        this.setChildren(React.createElement(this.Cmp, { store: this, ...this.props } as CmpProps));
    }
}

export default ViewStore;
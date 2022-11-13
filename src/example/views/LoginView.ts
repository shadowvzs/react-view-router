import React from 'react';
import { action, makeObservable, observable, runInAction } from 'mobx';

import ViewStore from '@store/ViewStore';
import type { ILoginView } from '../types/views';

class LoginView extends ViewStore implements ILoginView {

    static lockTheView = true;

    @observable
    public lockTheView = true;
    @action.bound
    public toggleLockView() { this.lockTheView = !this.lockTheView; }

    constructor() {
        super();
        makeObservable(this);
    }

    // test the route/component lock
    public canUnmount(): Promise<boolean> {
        return Promise.resolve(!this.lockTheView);
    }

    public onLogin = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        alert('onSubmit');
        return false;
    };

    // make persist settings
    public beforeMount(): void {
        runInAction(() => this.lockTheView = LoginView.lockTheView);
    }

    public beforeUnmount(): void {
        LoginView.lockTheView = this.lockTheView;
    }
}

export default LoginView;
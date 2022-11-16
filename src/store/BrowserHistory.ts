import { action, runInAction } from 'mobx';
import { computed, makeObservable, observable } from 'mobx';
import type { IHistoryStackItem, IHistory } from '@type/core';

class BrowserHistory implements IHistory {
    @observable.shallow
    private _stack: IHistoryStackItem[] = [];
    private _max = 0;

    // private _index = -1;
    private __index = -1;
    public get _index() {
        return this.__index;
    }
    public set _index(n: number) {
        this.__index = n;
    }

    private _history = window.history;

    @observable
    public path = '';

    @action.bound
    private _setStack(_stack: IHistoryStackItem[]) {
        this._stack = [..._stack];
        this.path = this.getPath();
    }

    constructor() {
        makeObservable(this);

        if (document.readyState === 'complete') {
            this._eventRegistration();
        } else {
            document.addEventListener('DOMContentLoaded', this._eventRegistration);
        }
        this.push(this.location.pathname, '', { id: this._max });
    }

    public getPath() {
        return this.location.pathname + this.location.search + this.location.hash;
    }

    public get location(): Location {
        return window.location;
    }

    public back = () => {
        if (this._index < 1 || !this._stack[this._index - 1]) {
            return;
        }
        this._index--;
        this._history.back();
        this._history.replaceState(...this.currentData);
        this._setStack(this._stack);
    };

    public forward = () => {
        if (this._stack.length <= this._index + 1) {
            return;
        }
        this._index++;
        this._history.forward();
        this._history.replaceState(...this.currentData);
        this._setStack(this._stack);
    };

    public go = (delta = 0) => {
        const cloneStack = [...this._stack];
        if (delta === 0) {
            const currentData = this.currentData;
            // const idx = cloneStack.findIndex(x => x[0].id === currentData[0].id);
            // console.log('idx', idx);
            // console.log('splice', cloneStack.splice(idx + 1), cloneStack);
            this.push(currentData[2], currentData[1], currentData[0]);
            this._setStack(cloneStack);
        } else if (delta === -1) {
            this.back();
        } else if (delta === 1) {
            this.forward();
        }
    };

    @action.bound
    public push(url: string, title = '', state: object = {}) {
        if (this.compareCurrentState(url, title, state)) {
            return;
        }
        this._index++;
        this._max++;
        const currentState = { ...state, id: this._max };
        const stackClone = [...this._stack];
        stackClone.splice(this._index, 0, [currentState, title, url]);
        if (title) {
            document.title = title;
        }
        this._history.pushState(...stackClone[this._index]);
        this._setStack(stackClone);
    }

    @action.bound
    public replace(url?: string, title?: string, state?: object) {
        const oldDate = this._stack[this._index];
        if (state) {
            oldDate[0] = { ...oldDate[0], ...state };
        }
        if (title !== oldDate[1] && title !== undefined) {
            oldDate[1] = title || '';
        }
        if (url !== oldDate[2] && url !== undefined) {
            oldDate[2] = url;
        }
        this._stack[this._index] = [...oldDate];
        this._history.replaceState(...oldDate);
        this._setStack(this._stack);
    }

    public navigate = (to: string, config?: { mode: 'push' | 'replace' }) => {
        this[config?.mode || 'push'](to);
    };

    private _eventRegistration = () => {
        document.removeEventListener('DOMContentLoaded', this._eventRegistration);
        window.addEventListener('popstate', () => {
            const id = (this._history.state as { id: number }).id;
            const index = this._stack.findIndex((x) => x[0].id === id);
            // if we want to get the direction :)
            // const oldId = this.state.id;
            // console.log((id > oldId) ? 'foward' : 'back');
            runInAction(() => {
                this._index = index;
                this._setStack(this._stack);
            });
        });
    };

    private compareCurrentState(url: string, title = '', state: object = {}): boolean {
        return JSON.stringify(this.currentData) === JSON.stringify([{ ...state, index: this._index }, title, url]);
    }

    @computed
    public get length() {
        return this._stack.length;
    }

    @computed
    public get state(): IHistoryStackItem[0] {
        return this._stack[this._index]?.[0] || {};
    }

    @computed
    public get currentData(): IHistoryStackItem {
        return this._stack[this._index];
    }
}

export default BrowserHistory;

import React from 'react';
import type { CmpProps, IViewStore } from '@type/core';
import type { ViewStoreInjectedData } from './core';
import type { Book } from './model';

export interface IBookListView extends IViewStore<ViewStoreInjectedData> {
    books: Book[];
    loading: boolean;
}

export interface ILoginView extends IViewStore {
    lockTheView: boolean;
    toggleLockView: () => void;

    onLogin: (event: React.FormEvent<HTMLFormElement>) => void;
}

export interface ISignUpView extends IViewStore {
    Cmp: React.FC<CmpProps>;
    onSignUp: (event: React.FormEvent<HTMLFormElement>) => void;
}

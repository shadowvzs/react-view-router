import React from 'react';

import { RouterProvider } from '@context/RouterContext';
import Link from '@components/Link';
import Route from '@components/Route';
import BrowserHistory from '@store/BrowserHistory';
import LoginView from './views/LoginView';
import SignUpView from './views/SignUpView';
import BookListView from './views/BookListView';
import LoginCmp from './components/LoginCmp';
import SignUpCmp from './components/SignUpCmp';
import BookListCmp from './components/BookListCmp';
import type { ViewStoreInjectedData } from './types/core';

const App = () => {
    const data = React.useMemo<ViewStoreInjectedData>(
        () => ({
            globalConfig: { baseApiUrl: '' },
            appService: { serviceMap: {} },
            notifyService: (type, message) => {
                console.info(type, message);
            },
        }),
        [],
    );

    return (
        <RouterProvider<ViewStoreInjectedData> history={new BrowserHistory()} injectedData={data}>
            <ul>
                <li>
                    <Link data-testid='toHome' to='/'>
                        /
                    </Link>
                </li>
                <li>
                    <Link data-testid='toLogin' to='/login'>
                        /login
                    </Link>
                </li>
                <li>
                    <Link data-testid='toSignUp' to='/signup'>
                        /signup
                    </Link>
                </li>
                <li>
                    <Link data-testid='toBooksList' to='/books/drama/bestseller?top=12#2'>
                        /pista/222
                    </Link>
                </li>
                <Route path='/' element={<div data-testid='HomeCmp'>Home</div>} />
                <Route path='/login' ViewStore={LoginView} Cmp={LoginCmp} />
                <Route path='/signup' ViewStore={SignUpView} Cmp={SignUpCmp} />
                <Route path='/books/:genre/:category' ViewStore={BookListView} Cmp={BookListCmp} />
                <Route
                    path='/books/drama'
                    exact={false}
                    element={
                        <div data-testid='BooksDramaListCmp'>
                            show this if route starts with &apos;/books/drama&apos; (exact is false)
                        </div>
                    }
                />
            </ul>
        </RouterProvider>
    );
};

export default App;

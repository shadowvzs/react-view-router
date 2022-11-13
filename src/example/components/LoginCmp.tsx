import React from 'react';
import { observer } from 'mobx-react-lite';
import type { ILoginView } from '../types/views';

const LoginCmp = observer((props: { store: ILoginView }): JSX.Element => {
    const { store } = props;

    return (
        <div>
            <h4>Login</h4>
            <label>
                <input type='checkbox' onChange={store.toggleLockView} checked={store.lockTheView} />
                <span>Lock the login cmp (cannot go to other route)</span>
            </label>
            <form onSubmit={store.onLogin}>
                <div>
                    <input placeholder='username' type='text' />
                </div>
                <div>
                    <input placeholder='password' type='password' />
                </div>
                <button>Submit</button>
            </form>
        </div>
    );
});

export default LoginCmp;
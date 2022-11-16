import React from 'react';
import type { ISignUpView } from '../types/views';

const SignUpCmp = (props: { store: ISignUpView }): JSX.Element => {
    const { store } = props;
    return (
        <div data-testid='SignUpCmp'>
            <h4>Sign Up</h4>
            <form onSubmit={store.onSignUp}>
                <div>
                    <input placeholder='username' type='text' />
                </div>
                <div>
                    <input placeholder='email' type='text' />
                </div>
                <div>
                    <input placeholder='password' type='password' />
                </div>
                <div>
                    <input type='checkbox' /> Agree
                </div>
                <button>Submit</button>
            </form>
        </div>
    );
};

export default SignUpCmp;

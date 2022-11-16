import React from 'react';
import ViewStore from '@store/ViewStore';
import type { ISignUpView } from '../types/views';

class SignUpView extends ViewStore implements ISignUpView {
    public onSignUp = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        alert('onSubmit');
        return false;
    };
}

export default SignUpView;

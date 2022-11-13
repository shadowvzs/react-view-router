import { RouterCtx } from '@context/RouterContext';
import React from 'react';

interface LinkProps extends Omit<React.HTMLAttributes<HTMLAnchorElement>, 'href'> {
    to: string;
}

const Link = ({ to, ...rest }: LinkProps) => {
    const store = React.useContext(RouterCtx);
    return (
        <a href={to} {...rest} onClick={store.onClickToLink} />
    );
};

export default Link;
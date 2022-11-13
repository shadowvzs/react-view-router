import React from 'react';
import { observer } from 'mobx-react-lite';
import { RouterCtx } from '@context/RouterContext';
import useConstant from '@utils/useConstant';
import type { IRouteData } from '@type/core';

const Route = observer((props: IRouteData) => {
    const store = React.useContext(RouterCtx);
    useConstant(() => store.registerRoute(props));
    const key = store.getRouteKey(props);
    if (store.currentViews[key]) { return store.getChildren(key); }
    return null;
});

export default Route;
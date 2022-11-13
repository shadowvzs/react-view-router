# react-view-router
Router for ReactJS with MobX, TypeScript

### Why?

- Modular: 
  - RouterStore/History instance can instantiate outside then pass to Provider, so we can navigate without hooks from viewStore/components
  - At RouterProvider component we can provide some **injectedData** (example global state/services/repositories/global config etc), each viewStore will get it automatically
  - Different perspective of routes, you can use same url multiple times (but **Viewstore** or **Cmp** prop must be different), can be nested as well
- Code split: introduced the ViewStore, which is similar like the conntroller for the angular and contain the logic, lifecycle hooks, component became dummy as possible
  - ViewStore life cycle hooks: 
     - beforeMount - run 1x, can please here an initial data fetch
     - beforeUpdate - called everytime if route data was changed (example: you are in detail view and **id** in url was changed)
     - beforeUnmount - called before the unmounting the component
     
     - canMount - return a boolean promise about if component can be mounted (if not then url will be not changed)
     - canUpdate - return a boolean promise about if component can be updated (if not then url will be not changed)
     - canUnmount - return a boolean promise about if component can be unmounted (if not then url will be not changed)

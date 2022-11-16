# react-view-router
Router for ReactJS with MobX, TypeScript

## Why?
- Current routers doesn't fitted to my needs, they allow to mount an JSX.Element but doesn't help to separate the logic/components, doesn't help too much in testing and always need write our own route guard if needed (which should be enough often ex.: auth),

## Goal
- more testable component, if we split the logic the components then we can test just the logic or component, not just together
- more cleaner components (separated business logic & dummy component)
- support both common element based route and the ViewStore way, dynamic, normal, nested paths
- can expose/instantiate outside the router/history instance and automatically inject into the ViewStore the history
- easy injection for ViewStore (RouterProvider), which make easier to inject auth/services/configs into the viewStore and not need hooks into components
- support mounting multiple component/viewstore into the app with same router if needed
- very easy way to guard the component (lifecycles should be used for that)

## ViewStores
  - ### LifeCycles: 
     *methods which help to move some logic from component into ViewStore*
     - beforeMount - run 1x, can please here an initial data fetch
     - beforeUpdate - called everytime if route data was changed (example: you are in detail view and **id** in url was changed)
     - beforeUnmount - called before the unmounting the component
     
  - ### Guards:
     *method args: url data, returns Pomise<boolean>, if returns false then route will be not changed)*
     - canMount - can be mounted - good place for auth check/guard
     - canUpdate - can be updated - good place for discard modals for edit views
     - canUnmount - can be unmounted - good place for discard modals for edit views when leave the component

Injectable data:
```typescript
// this based on project where it is use, so just an example
export type ViewStoreInjectedData = {
    globalConfig: { baseApiUrl: string; };
    serviceMap: Record<string, unknown>;
    notifyService: (type: 'error' | 'success', message: string) => void;
};

const data = {
    globalConfig: { baseApiUrl: '' },
    serviceMap: { 
        bookService: { 
            getBooks: () => {} 
        }
    },
    notifyService: (type, message) => { console.info(type, message); },
};
```

Provider:
```tsx
 <RouterProvider<ViewStoreInjectedData> history={new BrowserHistory()} injectedData={data}>
    {/* children will be here */}
 </RouterProvider>
 ```

Routes:
```tsx
    <Route path='/login' ViewStore={LoginView} Cmp={LoginCmp} />
    <Route path='/signup' ViewStore={SignUpView} Cmp={SignUpCmp} />
    <Route path='/books/:genre/:category' ViewStore={BookListView} Cmp={BookListCmp} />
    <Route path='/books/drama' exact={false} element={<div>show this if route starts with "/books/drama" (exact is false)</div>} />
```

Links:
```tsx
  <ul>
      <li><Link to='/'>/</Link></li>
      <li><Link to='/login'>/login</Link></li>
      <li><Link to='/signup'>/signup</Link></li>
      <li><Link to='/books/drama/bestseller?top=12#2'>/pista/222</Link></li>
  </ul>
```

## Examples

<details>
  <summary>Click here for Simple ViewStore + Component</summary>
  
    Simple view
```tsx
class SignUpView extends ViewStore implements ISignUpView {
    public onSignUp = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        alert('onSubmit');
        return false;
    };
}
```

  Simple component
```tsx
const SignUpCmp = (props: { store: ISignUpView }): JSX.Element => {
    const { store } = props;
    return (
        <div>
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
```
</details>

<details>
  <summary>Click here for Mode advanced ViewStore + Component</summary>
    
More advanced ViewStore

```tsx
class BookListView extends ViewStore<ViewStoreInjectedData> implements IBookListView {

    @observable
    public books: Book[] = [];
    @action.bound
    public setBooks(books: Book[]) { this.books = books; }

    @observable
    public loading = false;
    @action.bound
    public setLoading(loading: boolean) { this.loading = loading; }

    constructor() {
        super();
        this.update = this.update.bind(this);
        makeObservable(this);
    }

    // called before the mount
    public beforeMount() { this.loadFromDatabase().catch(console.error); }

    // called at every update
    public beforeUpdate() { this.loadFromDatabase().catch(console.error); }

    // lets override the default update
    public update(urlData: IUrlData) {
        const oldStateWithoutHash = { ...this.props, hash: undefined };
        const newStateWithoutHash = { ...urlData, hash: undefined };

        // if there more difference then the hash, then we update normally
        if (JSON.stringify(oldStateWithoutHash) !== JSON.stringify(newStateWithoutHash)) {
            super.update(urlData);
        } else {
            // but only if the hash changed then we not reload the list
            this.setProps(urlData);
            this.render();
        }
    }

    private loadFromDatabase = async () => {
        this.setLoading(true);
        this.injectedData.notifyService('success', 'loading started');
        try {
            // wait for some random time
            await delayPromise(Math.random() * 1000 + 500);
            // generate some dummy datam, normally the injectData should contain the services for data loading
            const books = new Array(Math.round(Math.random() * 7) + 3).fill(1).map((_, idx) => ({
                id: String(idx + 1),
                title: `Book Nr #${idx + 1}`
            }));
            this.setBooks(books);
        } catch (error: unknown) {
            console.error(error);
        } finally {
            this.injectedData.notifyService('success', 'loading ended');
            this.setLoading(false);
        }
        return false;
    };
}

```

and component for the view
```tsx
interface BookListCmpProps {
    store: IBookListView;
    params: { genre: string; category: string; top: string; };
    hash?: string;
}

const BookListCmp = observer((props: BookListCmpProps): JSX.Element => {
    const { store, params, hash } = props;
    const { genre, category, top } = params;

    return (
        <div>
            <h4>Book List {top && `- top(${top})`}</h4>
            <p>Genre: {genre}</p>
            <p>Category: {category}</p>
            <ul>
                {store.loading && <h4>Loading....</h4>}
                {!store.loading && store.books.map(book => (
                    <li key={book.id} style={book.id === hash ? { backgroundColor: 'cyan' } : {}}>
                        <Link to={`/books/${genre}/${category}?top=${top || 10}#${book.id}`}>{book.title}</Link>
                    </li>
                ))}
            </ul>

            <nav>
                History
                <ul>
                    <li><Link to={`/books/history/best-seller`}>Best Seller</Link></li>
                    <li><Link to={`/books/history/recommended`}>Recommended</Link></li>
                    <li><Link to={`/books/history/cheap`}>Cheap</Link></li>
                    <li><Link to={`/books/history/ForEvents`}>For Events</Link></li>
                </ul>
            </nav>
        </div >
    );
});
```

</details>


Credit to Igor Gaponovfor the npm guide
https://betterprogramming.pub/how-to-create-and-publish-react-typescript-npm-package-with-demo-and-automated-build-80c40ec28aca#b9e9
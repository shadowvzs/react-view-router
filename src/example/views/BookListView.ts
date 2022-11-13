import { action, makeObservable, observable } from 'mobx';
import ViewStore from '@store/ViewStore';
import type { IUrlData } from '@type/core';
import type { ViewStoreInjectedData } from '../types/core';
import type { Book } from '../types/model';
import type { IBookListView } from '../types/views';

const delayPromise = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay));

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
    public beforeMount() {
        this.loadFromDatabase().catch(console.error);
    }

    // called at every update
    public beforeUpdate() {
        this.loadFromDatabase().catch(console.error);
    }

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
            // generate some dummy data
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

export default BookListView;
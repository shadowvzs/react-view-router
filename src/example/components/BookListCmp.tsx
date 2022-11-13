import React from 'react';
import { observer } from 'mobx-react-lite';

import Link from '@components/Link';
import { IBookListView } from '../types/views';

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

export default BookListCmp;
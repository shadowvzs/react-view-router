import React from 'react';
import { act } from 'react-dom/test-utils';
import { describe, expect, test } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import App from '@example/index';

/**
 * Mock, all of those must be on the top level
 */

/**
 * till here
 */

describe('Filter function', () => {
    let renderUtils: ReturnType<typeof render>;

    beforeEach(async () => {
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await act(() => {
            renderUtils = render(<App />);
        });
    });

    test('go to Home', async () => {
        const link = await renderUtils.findByTestId('toHome');
        await fireEvent.click(link);
        const el = await renderUtils.findByTestId('HomeCmp');
        expect(el).toBeTruthy();
    });

    test('go to Login', async () => {
        const link = await renderUtils.findByTestId('toLogin');
        await fireEvent.click(link);
        const el = await renderUtils.findByTestId('LoginCmp');
        expect(el).toBeTruthy();
    });

    test('go to Login [locked]', async () => {
        const link = await renderUtils.findByTestId('toSignUp');
        await fireEvent.click(link);
        const el = await renderUtils.findByTestId('LoginCmp');
        expect(el).toBeTruthy();
    });

    test('go to Login [unlocked]', async () => {
        let link = await renderUtils.findByTestId('toLogin');
        await fireEvent.click(link);
        const checkbox = await renderUtils.findByTestId('LockBox');
        await fireEvent.click(checkbox);
        link = await renderUtils.findByTestId('toSignUp');
        await fireEvent.click(link);
        const el = await renderUtils.findByTestId('SignUpCmp');
        expect(el).toBeTruthy();
    });

    // LockBox
    test('go to SignUp', async () => {
        const link = await renderUtils.findByTestId('toSignUp');
        await fireEvent.click(link);
        const el = await renderUtils.findByTestId('SignUpCmp');
        expect(el).toBeTruthy();
    });

    test('go to BookList', async () => {
        const link = await renderUtils.findByTestId('toBooksList');
        await fireEvent.click(link);
        const el1 = await renderUtils.findByTestId('BookListCmp');
        const el2 = await renderUtils.findByTestId('BooksDramaListCmp');
        expect(el1 && el2).toBeTruthy();
    });
});

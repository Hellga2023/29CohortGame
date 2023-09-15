import React, { Route, BrowserRouter, Routes } from 'react-router-dom';
import { create } from 'react-test-renderer';

import { Provider } from 'react-redux';

import Button from '@/app/components/common/button/button';
import { store } from '@/app/store/store';
import Signin from './signin';

describe('signIn page tests', () => {
    test('Button snapshot test', () => {
        const tree = create(<Button click={() => ''}>Hello, Jest!</Button>).toJSON();

        expect(tree).toMatchSnapshot();
    });

    test('Signin page snapshot test', () => {
        const tree = create(
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Signin />} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });
});

export {};

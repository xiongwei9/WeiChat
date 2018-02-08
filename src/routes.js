import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import { view as Header } from './components/header';
import { view as Footer } from './components/footer'; 

const Routes = () => (
    <BrowserRouter>
        <div>
            <Route path='/' component={Header} />
            <Route path='/' component={Footer} />
        </div>
    </BrowserRouter>
);

export default Routes;
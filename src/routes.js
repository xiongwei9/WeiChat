import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { view as Login } from './components/auth/';
import { view as Header } from './components/header/';
import { view as Footer } from './components/footer/';
import { view as Home } from './components/home/';

const Routes = () => (
    <BrowserRouter>
        {/* <div>
            <Route path='/' component={Login} />
            <Route path='/' component={Header} />
            <Route path='/' component={Footer} />
        </div> */}
        <Switch>
            <Route path='/' component={Home} />
            <Route path='/login' component={Login} />
        </Switch>
    </BrowserRouter>
);

export default Routes;
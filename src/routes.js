import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { view as Login } from './components/auth/';
import { view as Header } from './components/header/';
import { view as Footer } from './components/footer/';
import { view as Home } from './components/home/';
import { view as Chat } from './components/chat/';

const Routes = () => (
    <BrowserRouter>
        {/* <div>
            <Route path='/' component={Login} />
            <Route path='/' component={Header} />
            <Route path='/' component={Footer} />
        </div> */}
        <Switch>
            <Route path='/chat/:uid' component={Chat} />
            <Route path='/' component={Home} />
            <Route path='/login' component={Login} />
        </Switch>
    </BrowserRouter>
);

export default Routes;
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { view as Login } from './components/auth/';
import { view as Header } from './components/header/';
import { view as Footer } from './components/footer/'; 

const Routes = () => (
    <BrowserRouter>
        {/* <div>
            <Route path='/' component={Login} />
            <Route path='/' component={Header} />
            <Route path='/' component={Footer} />
        </div> */}
        <Switch>
            <Route path='/chat' component={Header} />
            <Route path='/' component={Login} />
        </Switch>
    </BrowserRouter>
);

export default Routes;
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { view as Login } from './components/auth/';
import { view as Header } from './components/header/';
import { view as Footer } from './components/footer/';
import { view as Home } from './components/home/';
import { view as Chat } from './components/chat/';
import { view as Add } from './components/addFriend/';
import { view as User } from './components/user/';

const Routes = () => (
    <BrowserRouter>
        {/* <div>
            <Route path='/' component={Login} />
            <Route path='/' component={Header} />
            <Route path='/' component={Footer} />
        </div> */}
        <Switch>
            <Route path='/chat/:uid' component={Chat} />
            <Route path='/user/:uid' component={User} />
            <Route path='/home/add' component={Add} />
            <Route path='/home' component={Home} />
            <Route path='/' component={Login} />
        </Switch>
    </BrowserRouter>
);

export default Routes;
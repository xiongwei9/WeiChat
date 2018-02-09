import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './login';
import Register from './register';

const Page = () => (
    <Switch>
        <Route path='/register' component={Register} />
        <Route path='/' component={Login} />
    </Switch>
);

export default Page;
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { connect } from 'react-redux';

import { view as Login } from './components/auth/';
import { view as Header } from './components/header/';
import { view as Footer } from './components/footer/';
import { view as Home } from './components/home/';
import { view as Chat } from './components/chat/';
import { view as Add } from './components/addFriend/';
import { view as User } from './components/user/';
import { view as Video } from './components/video';
import { viewOld as VideoOld } from './components/video';

const Routes = (props) => (
    <BrowserRouter>
        <Switch>
            {/* <VideoOld /> */}
            { props.video.uid ? <Video to={props.video.uid} /> : null }
            {/* <Route path='/video/:uid' component={Video} /> */}
            <Route path='/chat/:uid' component={Chat} />
            <Route path='/user/:uid' component={User} />
            <Route path='/home/add' component={Add} />
            <Route path='/home' component={Home} />
            <Route path='/' component={Login} />
        </Switch>
    </BrowserRouter>
);

const mapStateToProps = (state, ownProps) => ({
    video: state.video,
    uid: state.auth.uid,
});

export default connect(mapStateToProps, null)(Routes);
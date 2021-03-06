import React from 'react';
import { connect } from 'react-redux';

import { FRAG_MESSAGE, FRAG_CONTACT, FRAG_MINE } from '../actionTypes';

import Message from './message';
import Contact from './contact';
import Mine from './mine';
import BottomNav from './bottomNav';
import TopNav from './topNav';
import { view as Header } from '../../header/';

import './home.scss';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const fragment = this.props.fragment
        const fragContent = fragment === FRAG_MESSAGE ? <Message /> : fragment === FRAG_CONTACT ? <Contact /> : fragment === FRAG_MINE ? <Mine /> : null;
        return (
            <div className='home'>
                {/* <TopNav /> */}
                <Header title='主页' moreText='+' moreLink='/home/add' />
                {fragContent}
                <BottomNav />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    fragment: state.home.fragment,
});

export default connect(mapStateToProps, null)(Home);
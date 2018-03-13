import React from 'react';

import BottomNav from './bottomNav';

import './home.scss';

class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='home'>

                <BottomNav />
            </div>
        );
    }
}

export default Home;
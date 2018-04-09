import React from 'react';
import { Link } from 'react-router-dom';

class TopNav extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="home-top-nav">
                <h2>主页</h2>
                <Link to="/home/add">+</Link>
            </div>
        );
    }
}

export default TopNav;
import React from 'react';
import { Link } from 'react-router-dom';

import './header.scss';

const Header = (props) => {
    let backBtn = null;
    if (props.goBack) {
        backBtn = <a className='back' onClick={props.goBack}>&lt;</a>;
    }
    let moreBtn = null;
    if (props.moreText && props.moreLink) {
        moreBtn = <Link to={props.moreLink}>{props.moreText}</Link>;
    }

    return (
        <header className='header'>
            {backBtn}
            <h2 >{props.title}</h2>
            {moreBtn}
        </header>
    );
};

export default Header;
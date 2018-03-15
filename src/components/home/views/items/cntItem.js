import React from 'react';
import { Link } from 'react-router-dom';

const CntItem = (props) => {
    const link = `/user/${props.uid}`;
    return (
        <li>
            <Link to={link}>
                <em>{props.name}</em>
                {/* <span>  {props.desc}</span> */}
            </Link>
        </li>
    );
};

export default CntItem;
import React from 'react';
import { Link } from 'react-router-dom';

const MsgItem = (props) => {
    const { name, uid } = props;
    const lastMsg = props.list[props.list.length - 1];
    const link = `/chat/${uid}`;
    return (
        <li>
            <Link to={link}>
                <em>{name}</em>
                <p>{lastMsg.mid ? `${name}：` : ''}{lastMsg.data}</p>
            </Link>
        </li>
    );
};

export default MsgItem;
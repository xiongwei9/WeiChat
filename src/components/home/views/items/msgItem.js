import React from 'react';
import { Link } from 'react-router-dom';

const MsgItem = (props) => {
    const { name, uid } = props;
    const lastMsg = props.list[props.list.length - 1];
    const link = `/chat/${uid}`;
    
    let data = lastMsg.data;
    if (lastMsg.msgType === 1) {
        if (/\.(jpeg|jpg|png|gif)$/.test(data)) {
            data = `[图片]`;
        } else {
            data = `[文件]`;
        }
    }
    
    return (
        <li>
            <Link to={link}>
                <em>{name}</em>
                <p>{data}</p>
            </Link>
        </li>
    );
};

export default MsgItem;
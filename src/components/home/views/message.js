import React from 'react';
import { connect } from 'react-redux';

import MsgItem from './items/msgItem';

class Message extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const noListTips = <p className='no-list-tips'>你还没有聊天记录，去找人聊天吧！</p>
        const list = this.props.message.length > 0 ? this.props.message.map((value) => <MsgItem key={value.uid} {...value} />) : noListTips;

        return (
            <ul className='msg-list'>
                {/* MsgItem list */}
                {list}
            </ul>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    message: state.home.message,
});

export default connect(mapStateToProps, null)(Message);
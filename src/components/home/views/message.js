import React from 'react';
import { connect } from 'react-redux';

import MsgItem from './items/msgItem';

class Message extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul className='msg-list'>
                {/* MsgItem list */}
                {this.props.message.map((value) => <MsgItem key={value.uid} {...value} />)}
            </ul>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    message: state.home.message,
});

export default connect(mapStateToProps, null)(Message);
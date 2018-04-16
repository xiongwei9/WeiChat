import React from 'react';
import { connect } from 'react-redux';

import { actions as socketActions } from '../../../lib/socketStoreEnhancer/';

class BottomBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onInputChange(e) {
        this.setState({
            text: e.target.value,
        });
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.sendMsg({
            fromUid: this.props.uid,
            uid: this.props.to,
            msg: this.state.text,
        });
        this.setState({
            text: '',
        });
    }

    render() {

        return (
            <div className='bottom-bar'>
                <form action='#' onSubmit={this.onSubmit}>
                    <input type='text' name='text' value={this.state.text} placeholder='请输入...' onChange={this.onInputChange} />
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    uid: state.auth.uid,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    sendMsg(data) {
        dispatch(socketActions.chatMsg(data));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
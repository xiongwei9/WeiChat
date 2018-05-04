import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { actions as socketActions } from '../../../lib/socketStoreEnhancer/';

import { view as Header } from '../../header/';
import './style.scss';

class User extends React.Component {
    constructor(props) {
        super(props);

        this.videoReqClick = this.videoReqClick.bind(this);
    }

    videoReqClick(e) {
        e.preventDefault();
        this.props.videoDuel({
            fromUid: this.props.uid,
            uid: this.props.user.uid,
        });
    }

    render() {
        const link = `/chat/${this.props.user.uid}`;
        const videoList = `/video/${this.props.user.uid}`;
        return (
            <div className="user">
                <Header title='详细资料' goBack={this.props.history.goBack}/>
                <div className='content'>
                    <h1>{this.props.user.name}</h1>
                    <h2>账号：{this.props.user.uid}</h2>
                    <p>描述：{this.props.user.descs}</p>

                    <div className="btns">
                        <Link to={link} className="send-msg" replace>发消息</Link>
                        {/* <Link to={videoList} className="send-msg" replace>视频通话</Link> */}
                        <a className='send-msg' onClick={this.videoReqClick}>视频通话</a>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    user: state.home.contact.filter(v => v.uid === ownProps.match.params.uid)[0],
    uid: state.auth.uid,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    videoDuel(data) {
        dispatch(socketActions.videoDuel(data));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(User);
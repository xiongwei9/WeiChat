import React from 'react';
import { connect } from 'react-redux';

import { view as Header } from '../../header/';
import BottomBar from './bottomBar';

import './style.scss';

class Chat extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let list = null;
        if (this.props.chatMsg) {
            list = this.props.chatMsg.list.map((v) => {
                let content = null;
                switch (v.msgType) {
                    case 1:
                        if (/\.(jpg|jpeg|png|gif)$/.test(v.data)) {
                            content = <img className='msg-img' src={v.data} />;
                            setTimeout(() => {
                                window.scrollTo(0, this.chatListDOM.scrollHeight + 960);
                            }, 120);
                        } else {
                            const name = v.data.match(/\/[0-9]*\.(.*)$/)[1];
                            content = <a className='msg-file' href={v.data}>文件：{name}</a>;
                        }
                        break;
                    case 0:
                    default:
                        content = <p className='msg-content'>{v.data}</p>;
                }
                return (
                    <li key={v.time} className={v.mid ? 'friend' : 'me'}>
                        {/* <span className='username'>{(v.mid ? `${this.props.chatMsg.name}` : '你')}</span> */}
                        {/* <p className='msg-content'>{v.data}</p> */}
                        {content}
                    </li>
                );
            });
        }
        return (
            <div className='chat'>
                <Header title={this.props.friend.name} goBack={this.props.history.goBack} />
                <ul className='chat-list' ref={list => this.chatListDOM = list}>
                    {list}
                </ul>
                <BottomBar to={this.props.match.params.uid} />
            </div>
        );
    }

    componentDidMount() {
        window.scrollTo(0, this.chatListDOM.scrollHeight + 960);
    }
    componentDidUpdate() {
        window.scrollTo(0, this.chatListDOM.scrollHeight + 960);
    }
}

const mapStateToProps = (state, ownProps) => ({
    // 可以把ownProps.match.params.uid取出来缓存到一个局部变量里，避免每次查找这么长的对象链
    // 这里为了简洁的语法，牺牲效率
    chatMsg: state.home.message.filter((v) => v.uid === ownProps.match.params.uid)[0],
    friend: state.home.contact.filter((v) => v.uid === ownProps.match.params.uid)[0],
});

export default connect(mapStateToProps, null)(Chat);
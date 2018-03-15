import React from 'react';
import { connect } from 'react-redux';

class Chat extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ul>
                {this.props.chatMsg.list.map((v) => {
                    return (
                        <li key={v.time}>{(v.mid ? `${this.props.chatMsg.name}：` : '你：') + v.data}</li>
                    );
                })}
            </ul>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    // 可以把ownProps.match.params.uid取出来缓存到一个局部变量里，避免每次查找这么长的对象链
    // 这里为了简洁的语法，牺牲效率
    chatMsg: state.home.message.filter((v) => v.uid === ownProps.match.params.uid)[0],
});

export default connect(mapStateToProps, null)(Chat);
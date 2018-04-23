import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import './style.scss';

class User extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const link = `/chat/${this.props.user.uid}`;
        return (
            <div className="user">
                <h1>{this.props.user.name}</h1>
                <h2>账号：{this.props.user.uid}</h2>
                <p>描述：{this.props.user.descs}</p>

                <Link to={link} className="send-msg" replace>发消息</Link>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    user: state.home.contact.filter(v => v.uid === ownProps.match.params.uid)[0],
});

// const mapDispatchToProps = (dispatch, ownProps) => ({
//     addFriend(data) {
//         dispatch(socketActions.addFriend({
//             ...data,
//         }));
//     },
// });

export default connect(mapStateToProps, null)(User);
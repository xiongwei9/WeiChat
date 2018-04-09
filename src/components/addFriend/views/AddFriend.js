import React from 'react';
import { connect } from 'react-redux';

import { addFriend } from '../../../lib/socketStoreEnhancer/actions';

import './index.scss';

class AddFriend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: '',
            userList: [],
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.onClickUserList = this.onClickUserList.bind(this);
    }

    onInputChange(e) {
        const uid = e.target.value.trim();
        this.setState({
            uid,
        });
        this.search(uid);
    }

    search(uid) {
        if (!uid) {
            this.setState({
                userList: [],
            });
            return;
        }
        fetch('/api/searchUser', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `uid=${uid}`,
        }).then((res) => {
            if (res.status !== 200) {
                return;
            }
            return res.json();
        }).then((data) => {
            if (data.ret) {
                return;
            }
            this.setState({
                userList: data.data,
            });
        });
    }

    onClickUserList(e) {
        // const history = this.props.history;
        this.props.mAddFriend({
            fromUid: this.props.uid,
            uid: e.target.dataset['uid'],
            msg: '',
        });
    }

    render() {
        const lis = this.state.userList.map((v) => (
            <li key={v.uid} onClick={this.onClickUserList} data-uid={v.uid}>
                {v.name}<span>{v.uid}</span>
            </li>
        ));

        return (
            <div className="add-friend">
                <p>添加新朋友</p>
                <div className="list">
                    <input type="text" placeholder="输入新朋友的账号" onChange={this.onInputChange} value={this.state.uid}/>
                    <ul>
                        {lis}
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    uid: state.auth.uid,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    mAddFriend(data) {
        dispatch(addFriend({
            ...data,
        }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddFriend);
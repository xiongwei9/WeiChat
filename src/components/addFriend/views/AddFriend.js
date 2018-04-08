import React from 'react';

class AddFriend extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uid: '',
        };
        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange(e) {
        const uid = e.target.value.trim();
        this.setState({
            uid,
        });
        this.search(uid);
    }

    search(uid) {
        console.log(uid);
        if (!uid) {
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
            console.log(data);
        });
    }

    render() {
        return (
            <div class="add-friend">
                <p>添加朋友</p>
                <input type="text" placeholder="输入新好友的账号" onChange={this.onInputChange} value={this.state.uid}/>
                <ul>

                </ul>
            </div>
        );
    }
}

export default AddFriend;
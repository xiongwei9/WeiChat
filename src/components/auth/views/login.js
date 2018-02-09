import React from 'react';
import { Link } from 'react-router-dom';

import './login.scss';

import { view as Modal } from '../../modal/';

const Toast = Modal.Toast;

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            showModal: false,
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    onInputChange(e) {
        const key = e.target.className;
        this.setState({
            [key]: e.target.value,
        });
    }

    onLogin(e) {
        e.preventDefault();
        const { username, password } = this.state;

        this.handleToast(true);
        // if (!username) {
        //     alert(`请输入用户名`);
        //     return;
        // }
        // if (!password) {
        //     alert(`请输入密码`);
        //     return;
        // }

        // fetch('/api/login', {
        //     method: 'get'
        // }).then((res) => {
        //     if (res.status !== 200) {
        //         console.log('fetch error');
        //         return;
        //     }
        //     res.json().then((data) => {
        //         console.log(data.data);
        //     });
        // });
        
    }

    handleToast(showModal) {
        this.setState({
            showModal,
        });
    }

    render() {
        // 这里的Toast仍有BUG，在快速多次点击时，会搞乱定时器和state
        const tips = this.state.showModal ? (
            <Toast close={() => this.handleToast(false)}>Hello</Toast>
        ) : null;

        return (
            <div className='login'>
                {tips}
                <form action='#' type='post' onSubmit={this.onLogin}>
                    <input className='username' type='text' value={this.state.username} onChange={this.onInputChange} placeholder='用户名' />
                    <input className='password' type='password' value={this.state.password} onChange={this.onInputChange} placeholder='密码' />
                   
                    <input type='submit' className='btn submit' value='登录' />
                    <Link to='/register' className='btn reg'>注册</Link>
                </form>
            </div>
        );
    }
}

export default Login;
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import './login.scss';

import { loginRequest } from '../actions';
import { view as Modal } from '../../modal/';

const Toast = Modal.Toast;

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
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

        if (!username) {
            Toast.info(`请输入用户名`);
            return;
        }
        if (!password) {
            Toast.info(`请输入密码`);
            return;
        }

        this.props.onLogin(username, password);
    }

    componentWillReceiveProps(nextProps) {
        // 登录成功
        if (nextProps.logined) {
            this.props.history.push('/chat');
        }
    }

    render() {
        return (
            <div className='login'>
                <form action='#' onSubmit={this.onLogin}>
                    <input className='username' type='text' value={this.state.username} onChange={this.onInputChange} placeholder='用户名' />
                    <input className='password' type='password' value={this.state.password} onChange={this.onInputChange} placeholder='密码' />
                   
                    <input type='submit' className='btn submit' value='登录' />
                    <Link to='/register' className='btn reg'>注册</Link>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    logined: state.auth.logined,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onLogin(username, password) {
        dispatch(loginRequest(username, password));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
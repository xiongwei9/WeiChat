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
            uid: '',
            password: '',
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    onInputChange(e) {
        const key = e.target.name;
        this.setState({
            [key]: e.target.value,
        });
    }

    onLogin(e) {
        e.preventDefault();
        const { uid, password } = this.state;

        if (!uid) {
            Toast.info(`请输入用户名`);
            return;
        }
        if (!password) {
            Toast.info(`请输入密码`);
            return;
        }

        this.props.onLogin(uid, password);
    }

    componentWillReceiveProps(nextProps) {
        // 登录成功
        if (nextProps.logined) {
            this.props.history.replace('/home');
        }
    }

    render() {
        return (
            <div className='login'>
                <form action='#' onSubmit={this.onLogin}>
                    <input name='uid' type='text' value={this.state.uid} onChange={this.onInputChange} placeholder='用户名' />
                    <input name='password' type='password' value={this.state.password} onChange={this.onInputChange} placeholder='密码' />
                   
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
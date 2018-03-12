import React from 'react';

import { view as Modal } from '../../modal/';

const Toast = Modal.Toast;

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            password: '',
            passwordCfm: '',
            desc: '',
        };

        this.onRegister = this.onRegister.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }

    onInputChange(e) {
        const target = e.target;

        this.setState({
            [target.name]: target.value,
        });
    }

    onRegister(e) {
        e.preventDefault();
        const { name, password, passwordCfm, desc } = this.state;
        const history = this.props.history;

        if (!name || !password || !passwordCfm) {
            Toast.info(`昵称与密码不能为空！`);
            return;
        }
        if (password !== passwordCfm) {
            Toast.info(`两次密码不相同，请重新输入！`);
            return;
        }

        fetch('/api/register', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `name=${name}&password=${password}&desc=${desc}`,
        }).then((resObj) => {
            if (resObj.status !== 200) {
                throw new Error(resObj.statusText);
            }
            return resObj.json();
        }).then((data) => {
            if (data.ret !== 0) {
                throw new Error(data.msg);
            }
            Toast.info(`注册成功！`);
            history.push('/');
        }).catch((error) => {
            Toast.info(error);
        });
    }

    render() {
        const { name, password, passwordCfm, desc } = this.state;
        const pswNotCfm = password === passwordCfm ? '' : 'error';

        return (
            <div className='register'>
                <form action='#' onSubmit={this.onRegister}>
                    <input type='text' name='name' value={name} placeholder='昵称' onChange={this.onInputChange} maxLength='16' />
                    <input type='password' name='password' value={password} placeholder='密码' onChange={this.onInputChange} maxLength='16' />
                    <input type='password' name='passwordCfm' value={passwordCfm} className={pswNotCfm} placeholder='密码确认' onChange={this.onInputChange} maxLength='16' />
                    <input type='text' name='desc' value={desc} placeholder='个人简介' onChange={this.onInputChange} maxLength='32' />
                    <input type='submit' className='btn submit' value='注册' />
                </form>
            </div>
        );
    }
}

export default Register;
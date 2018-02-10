import React from 'react';


class Register extends React.Component {
    constructor(props) {
        super(props);

        this.onRegister = this.onRegister.bind(this);
    }

    onRegister() {

    }

    render() {
        return (
            <div className='register'>
                <form action='#' onSubmit={this.onRegister}>
                    <img src='https://avatars3.githubusercontent.com/u/19465270?s=460&v=4'/>
                    <input type='text' value='' placeholder='昵称' />
                    <input type='text' value='' placeholder='个人简介' />
                    <input type='submit' value='注册' />
                </form>
            </div>
        );
    }
}

export default Register;
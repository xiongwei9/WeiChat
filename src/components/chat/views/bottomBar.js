import React from 'react';
import { connect } from 'react-redux';

class BottomBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
        };
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onInputChange(e) {
        this.setState({
            text: e.target.value,
        });
    }

    onSubmit(e) {
        e.preventDefault();
        alert(this.state.text);
    }

    render() {

        return (
            <div className='bottom-bar'>
                <form action='#' onSubmit={this.onSubmit}>
                    <input type='text' name='text' value={this.state.text} placeholder='请输入...' onChange={this.onInputChange} />
                </form>
            </div>
        );
    }
}

export default BottomBar;
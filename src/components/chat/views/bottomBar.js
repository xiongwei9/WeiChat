import React from 'react';
import { connect } from 'react-redux';

import { view as modal } from '../../modal/';
import { actions as socketActions } from '../../../lib/socketStoreEnhancer/';

const Toast = modal.Toast;

class BottomBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            showMore: false,
        };
        this.onMoreBtnClick = this.onMoreBtnClick.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onMoreBtnClick(e) {
        this.setState((prevState) => ({
            showMore: !prevState.showMore,
        }));
    }

    onInputChange(e) {
        this.setState({
            text: e.target.value,
        });
    }

    onFileChange(e) {
        const target = e.target;
        const file = target.files[0];
        if (file.size > 10 * 1024 * 1024) {
            Toast.info('文件不能大于10MB');
            return;
        }
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = (e) => {
            this.props.sendFile({
                fromUid: this.props.uid,
                uid: this.props.to,
                fileData: e.target.result,
                fileName: file.name,
                fileType: file.type,
            });
            this.fileInputForm.reset();
        };
    }

    onSubmit(e) {
        e.preventDefault();
        this.props.sendMsg({
            fromUid: this.props.uid,
            uid: this.props.to,
            msg: this.state.text,
        });
        this.setState({
            text: '',
        });
    }

    render() {
        const moreClass = 'more' + (this.state.showMore ? ' show' : '');

        return (
            <React.Fragment>
                <div className='bottom-bar'>
                    <form action='#' onSubmit={this.onSubmit}>
                        <input type='text' name='text' value={this.state.text} placeholder='请输入...' onChange={this.onInputChange} />
                        <button type='button' onClick={this.onMoreBtnClick}>+</button>
                    </form>
                </div>
                <div className={moreClass} onClick={this.onMoreBtnClick}>
                    <a className='more-item'>
                        file
                        <form ref={input => this.fileInputForm = input}>
                            <input type='file' onChange={this.onFileChange} ref={input => this.fileInput = input} />
                        </form>
                    </a>
                    <input className='more-item' type='button' onClick={null} value='video' />
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    uid: state.auth.uid,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    sendMsg(data) {
        dispatch(socketActions.chatMsg(data));
    },
    sendFile(data) {
        dispatch(socketActions.chatFile(data));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(BottomBar);
import React from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';
import { FRAG_MESSAGE, FRAG_CONTACT, FRAG_MINE } from '../actionTypes';

class BottomNav extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { fragment } = this.props;
        const msgClass = fragment == FRAG_MESSAGE ? 'selected' : '';
        const cntClass = fragment == FRAG_CONTACT ? 'selected' : '';
        const minClass = fragment == FRAG_MINE ? 'selected' : '';
        return (
            <ul className='home-bottom-nav'>
            {/* 使用这种onClick方法，对效率有损耗。最好是定义一个事件处理方法，三个li都统一引用它 */}
                <li className={msgClass} onClick={() => this.props.onNavChange(FRAG_MESSAGE)}>消息</li>
                <li className={cntClass} onClick={() => this.props.onNavChange(FRAG_CONTACT)}>通讯录</li>
                <li className={minClass} onClick={() => this.props.onNavChange(FRAG_MINE)}>我的</li>
            </ul>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    fragment: state.home.fragment,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    onNavChange(frag) {
        dispatch(actions.fragChange(frag));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(BottomNav);
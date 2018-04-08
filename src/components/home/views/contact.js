import React from 'react';
import { connect } from 'react-redux';

import CntItem from './items/cntItem';

class Contact extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const noListTips = <p className='no-list-tips'>你还没有联系人，请搜索并添加吧！</p>;
        const list = this.props.contact.length > 0 ? this.props.contact.map((value, index) => <CntItem key={value.uid} {...value} />) : noListTips;

        return (
            <ul className='contact-list'>
                {list}
            </ul>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    contact: state.home.contact,
});

export default connect(mapStateToProps, null)(Contact);
import React from 'react';
import { connect } from 'react-redux';

import CntItem from './items/cntItem';

class Contact extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const list = this.props.contact.map((value, index) => <CntItem key={value.uid} {...value} />);

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
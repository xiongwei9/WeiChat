import React from 'react';
import { connect } from 'react-redux';

class Mine extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className='mine'>
                <h1>{this.props.user.name}</h1>
                <h2>账号：{this.props.user.uid}</h2>
                <p>描述：{this.props.user.descs}</p>

                {/* <Link to={link} className="send-msg" replace>发消息</Link> */}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    user: {
        name: state.auth.name,
        uid: state.auth.uid,
        descs: state.auth.descs,
    },
});

export default connect(mapStateToProps, null)(Mine);
import React from 'react';
import ReactDOM from 'react-dom';

import './modal.scss';

class Modal extends React.Component {
    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.modalRoot = document.getElementById('modal-root');
        if (props.className) {
            const classList = props.className.split(/\s+/);
            this.el.classList.add(...classList);
        }
    }

    componentDidMount() {
        this.modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        this.modalRoot.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el
        );
    }
}

export default Modal;
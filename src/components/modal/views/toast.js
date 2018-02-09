import React from 'react';

import Modal from './modal';

class Toast extends Modal {
    constructor(props) {
        super(props);
        this.el.classList.add('toast');
    }

    componentDidMount() {
        super.componentDidMount();

        const close = this.props.close;
        this.timeoutId = setTimeout(() => {
            close();
        }, 3000);
        console.log(this.timeoutId);
    }

    componentWillUnmount() {
        console.log(this.timeoutId);
        clearTimeout(this.timeoutId);

        super.componentWillUnmount();
    }

    render() {
        return super.render();
    }
}

export default Toast;
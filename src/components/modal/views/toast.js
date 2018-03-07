import React from 'react';
import ReactDOM from 'react-dom';

import Modal from './modal';

/**
 * 使用：
 * 引入Toast，然后直接调用Toast.info('xxx')
 * 
 * 用hack方法实现了一个Toast，很low
 * 用ReactDOM.createPortal()创建了一个传送门
 * 但又用了ReactDOM.render()为Modal组件提供挂载环境
 * 第一次使用前面的方法，不知所措
 * 最好的情况应该是只用ReactDOM.createPortal()而对外API不变
 */

let timeoutId = null;

const Toast = {
    info: (msg) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }

        const modalRoot = document.getElementById('modal-root');
        ReactDOM.render(
            <React.Fragment>
                <Modal className='toast show'>{msg.toString()}</Modal>
            </React.Fragment>,
            modalRoot
        );
        timeoutId = setTimeout(() => {
            ReactDOM.render(
                null,
                modalRoot
            );
        }, 3000);
    },
};

export default Toast;
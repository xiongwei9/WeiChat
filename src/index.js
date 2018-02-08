import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader';

// import App from './App';
import Routes from './routes';
import store from './Store';

import './index.scss';

const render = Component => {
    ReactDOM.render(
        <AppContainer>
            <Provider store={store}>
                <Component />
            </Provider>
        </AppContainer>,
        document.getElementById('root')
    );
};

render(Routes);

if (module.hot) {
    module.hot.accept();
}
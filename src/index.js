import React from 'react';
import ReactDOM from 'react-dom';
import WebFont from 'webfontloader';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

WebFont.load({
    google: {
        families: ['Source+Sans+Pro:400,400i,600,600i'],
    },
});

ReactDOM.render(<App />, document.querySelector('[data-c="import-mapper"]'));
registerServiceWorker();

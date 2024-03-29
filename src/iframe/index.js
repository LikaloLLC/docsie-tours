import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

const render = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
};

render();

export default render;

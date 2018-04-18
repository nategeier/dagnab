import React from 'react';
import ReactDOM from 'react-dom';
import Accounts from './components/Accounts';
import 'babel-polyfill';

const Index = () => {
  return (
    <div>
      <Accounts />
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById('index'));

import React from 'react';
import IndexRouter from './router/IndexRouter';
import { Provider } from 'react-redux';
import './App.css';
import store from './redux/store';

function App(props) {
  // Provider组件使所有组件共享store数据
  return (
    <Provider store={store}>
      <IndexRouter />
    </Provider>
  );
}

export default App;
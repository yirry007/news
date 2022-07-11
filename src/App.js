import React from 'react';
import IndexRouter from './router/IndexRouter';
import { Provider } from 'react-redux';
import './App.css';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'

function App(props) {
  // Provider组件使所有组件共享store数据
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter />
      </PersistGate>
    </Provider>
  );
}

export default App;
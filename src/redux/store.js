import { legacy_createStore, combineReducers } from 'redux';
import { collapsedReducer } from './reducers/CollapseReducer';
import { loadingReducer } from './reducers/LoadingReducer';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'rookie',
    storage,
    blacklist: ['loadingReducer']
}

const reducer = combineReducers({
    collapsedReducer,
    loadingReducer,
});

//reducer进行持久化处理
const persistedReducer = persistReducer(persistConfig, reducer)

const store = legacy_createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };
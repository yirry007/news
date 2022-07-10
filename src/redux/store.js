import { legacy_createStore, combineReducers } from 'redux';
import { collapsedReducer } from './reducers/CollapseReducer';

const reducer = combineReducers({
    collapsedReducer
});
const store = legacy_createStore(reducer);

export default store;
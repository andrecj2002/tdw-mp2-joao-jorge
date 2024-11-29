import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Alteração aqui
import rootReducer from './index';

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
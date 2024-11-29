// reducers/index.js
import { combineReducers } from 'redux';
import weaponReducer from './weaponReducer';

const rootReducer = combineReducers({
  weapons: weaponReducer,
});

export default rootReducer;
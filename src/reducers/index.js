import engineReducer from './engine';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  engine: engineReducer,
});

export default rootReducer;

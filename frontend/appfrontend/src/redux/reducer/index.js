import { combineReducers } from 'redux';
import registerReducer from './registerReducer';
import profileReducer from './profileReducer';
import {POST_LOGIN_REQUEST} from '../actions/actionTypes'
//root reducers to combine all reducers in one reducer
// see : https://redux.js.org/usage/structuring-reducers/using-combinereducers

const appReducer = combineReducers({
  // Your reducers will go here
  data: registerReducer,
  profile: profileReducer,
});




const rootReducer = (state, action) => {
  // if (action.type === POST_LOGIN_REQUEST) {
  //   state = undefined; // Reset the state
  // }
  return appReducer(state, action);
};

export default rootReducer;

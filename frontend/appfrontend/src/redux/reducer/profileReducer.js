import * as actionType from '../actions/actionTypes';
import { error } from 'loglevel';

const initialState = {
    profile: [],
    loading: false,
    error: null,
  };


const profileReducer = (state = initialState, action) => {
    switch (action.type) {
      case actionType.POST_DATA_REQUEST:
        return { ...state,loading: true ,error:null};
      case actionType.POST_DATA_SUCCESS:
        return { ...state, loading: false, profile: action.payload , error:null };
      case actionType.POST_DATA_FAILURE:
        return { ...state, loading: false, error: action.payload };
      case actionType.FETCH_PROFILE_REQUEST:
        return { ...state,loading: true ,error:null};
      case actionType.FETCH_PROFILE_SUCCESS:
        return { ...state, loading: false, profile: action.payload , error:null };
      case actionType.FETCH_PROFILE_FALIURE:
        return { ...state, loading: false, error: action.payload };
      case actionType.POST_LOGIN_REQUEST:
        return { ...state,loading: true ,error:null};
      case actionType.POST_LOGIN_SUCCESS:
        return { ...state, loading: false, profile: action.payload , error:null };
      case actionType.POST_LOGIN_FALIURE:
        return { ...state, loading: false, error: action.payload };
      case actionType.PUT_PROFILE_REQUEST:
        return { ...state,loading: true ,error:null};
      case actionType.PUT_PROFILE_SUCCESS:
        return { ...state, loading: false, profile: action.payload , error:null };
      case actionType.PUT_PROFILE_FALIURE:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  

  
  export default profileReducer;
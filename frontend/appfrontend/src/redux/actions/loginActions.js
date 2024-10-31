import * as actionTypes from './actionTypes';
import {loginUser} from '../../api/loginApi';
import * as log from 'loglevel';
import {parseJwt} from '../../utilities/helpers'


export const postLoginRequest = () => {
    return {
      type: actionTypes.POST_LOGIN_REQUEST,
    };
  };
  
  export const postLoginSuccess = (data) => {
    console.log(data[0]);
    return {
      type: actionTypes.POST_LOGIN_SUCCESS,
      payload: data[0],
    };
  };
  
  export const postLoginFailure = (error) => {
    return {
      type: actionTypes.POST_LOGIN_FALIURE,
      payload: error,
    };
  };


  export const loginaUser = (body) => async (dispatch) => {
    
    try {
      dispatch(postLoginRequest());
      const response = await loginUser(body)
      const dataParsed=parseJwt(response.data['access'])
      dispatch(postLoginSuccess([dataParsed,response.data['refresh']]));
      const { access, refresh } = response.data;
    
    
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    } catch (error) {
        if (error) { // Check for non-200 status code
            throw new Error(`Login failed: ${error.message || 'Bad request'}`); // Throw error
          }
        dispatch(postLoginFailure(error.message));
    }
  };
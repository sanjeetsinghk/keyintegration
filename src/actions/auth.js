import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    SET_MESSAGE,
  } from "./types";
  
import AuthService from "../services/auth.service";
import userService from "../services/user.service";
import { CITY_SUCEES, COUNTRY_SUCEES, STATE_SUCEES } from "./commonTypes";
  
  export const register = (username, email, password) => (dispatch) => {
    return AuthService.register(username, email, password).then(
      (response) => {
        dispatch({
          type: REGISTER_SUCCESS,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: response.data.message,
        });
  
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: REGISTER_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
  };
  
  export const login = (username, password) => (dispatch) => {
    return AuthService.login(username, password).then(
      async (data) => {
       
        const [countries, states, cities] = await Promise.all([
          userService.getAllCountries(),
          userService.getAllStates(),
          userService.getAllCities()
        ]);
        console.log(countries);
        console.log(states);
        console.log(cities);
        dispatch(
          {
            type: LOGIN_SUCCESS,
            payload: { user: data },
          });
          dispatch({  
            type: COUNTRY_SUCEES,
            payload: { country: countries.data },
          });
          dispatch({  
            type: STATE_SUCEES,
            payload: { state: states.data },
          });
          dispatch({  
            type: CITY_SUCEES,
            payload: { city: cities.data },
          });
        return Promise.resolve();
      },
      (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
  
        dispatch({
          type: LOGIN_FAIL,
        });
  
        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });
  
        return Promise.reject();
      }
    );
  };
  
  export const logout = () => (dispatch) => {
    AuthService.logout();
  
    dispatch({
      type: LOGOUT,
    });
  };
  
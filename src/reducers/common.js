import { CITY_FAIL, CITY_SUCEES, COUNTRY_FAIL, COUNTRY_SUCEES, STATE_FAIL, STATE_SUCEES } from "../actions/commonTypes";


const initialState = {
    country:[],
    state:[],
    city:[]
};

export default function (state = initialState, action) {
  const { type, payload } = action;
console.log(type);
console.log(payload);
  switch (type) {
    case COUNTRY_SUCEES:
      return {...state, country: payload.country };
    case COUNTRY_FAIL:
      return {...state, country: [] };
    case STATE_SUCEES:
        return { ...state,state: payload.state };
    case STATE_FAIL:
        return {...state, state: [] };
    case CITY_SUCEES:
        return {...state, city: payload.city };
    case CITY_FAIL:
        return {...state, city: [] };
    default:
      return state;
  }
}
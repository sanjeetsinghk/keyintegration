import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_BASE_API_URL;



const GetJSonData = () => {
  return axios.get(API_URL + "JsonConverter/GetJSonData", { headers: authHeader() });
};

export default { 
  GetJSonData,
};
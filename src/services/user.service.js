import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_BASE_API_URL;



const GetJSonData = () => {
  return axios.get(API_URL + "JsonConverter/GetJSonData", { headers: authHeader() });
};
const SaveJsonResponse = (data) => {
 // data=JSON.stringify(data);
  console.log(data)
  return axios.post(API_URL + "JsonConverter/SaveJsonResponse",
  data, 
   { 
    headers:
    {
      'Content-Type': 'application/json'
    }
   });
};
export default { 
  GetJSonData,
  SaveJsonResponse
};
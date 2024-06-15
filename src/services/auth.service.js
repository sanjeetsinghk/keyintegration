import axios from "axios";
const API_URL = process.env.REACT_APP_BASE_API_URL;

const register = (username, email, password) => {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
    });
  };
  
  const login = (email, password) => {
    return axios
      .post(API_URL + "/auth/login", {
        email:email,
        password:password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
  
        return response.data;
      });
  };
  
  const logout = () => {
    localStorage.removeItem("user");
  };
  
  export default {
    register,
    login,
    logout,
  };
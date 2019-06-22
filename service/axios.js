const axios = require("axios");
import { ifLogined, setCookie } from "../assets/utils";

axios.defaults.withCredentials = true;
axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    if (ifLogined && !isLoginOrSing(config.url)) {
      setCookie();
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function(response) {
    // Do something with response data
    if (response.status === 200) {
      return response.data;
    }
    return response;
  },
  function(error) {
    // Do something with response error
    return Promise.reject(error);
  }
);

function isLoginOrSing(url) {
  return /login|register$/.test(url);
}

export default axios;

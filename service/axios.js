const axios = require("axios");
import { ifLogined, setCookie, removeCookieAndStorage } from "../assets/utils";
import Box from "../components/progress";

axios.defaults.withCredentials = true;
axios.defaults.timeout = 15 * 1000;
axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    if (ifLogined && !isLoginOrSing(config.url)) {
      setCookie();
    }
    Box && Box.start();
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
    Box && Box.done();

    // Do something with response data
    if (response.status === 200) {
      if (response.data && response.data.errorCode === 7) {
        setTimeout(() => {
          gotoLogin();
        }, 5 * 1000);
      }
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

function gotoLogin() {
  try {
    removeCookieAndStorage();
    window.location.href = "/login";
  } catch (e) {}
}

export default axios;

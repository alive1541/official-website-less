import axios from "./axios";
import { baseApi, xxBussinessApi } from "./config.js";
import { getCookie } from "../assets/utils";
import configureStore from "../store/store";
import { getLanguage } from "../assets/utils";

const store = configureStore();

function getLan() {
  try {
    return (
      localStorage.getItem("language") ||
      store.getState().language ||
      getLanguage()
    );
  } catch (e) {}
}

export async function login(params) {
  return axios.get(baseApi + "/login", {
    params,
    headers: {
      language: getLan()
    }
  });
}

export async function sign(params) {
  return axios.post(baseApi + "/official/register", params, {
    headers: {
      language: getLan()
    }
  });
}

export async function getHistoryData(params) {
  return axios.get(baseApi + "/historical_arbitrage_opportunities", {
    params,
    headers: {
      language: getLan()
    }
  });
}
//获取实时机会 已登录
export async function getCurrentDataLogined(params) {
  return axios.get(baseApi + "/customer/realtime_arbitrage_opportunities", {
    params,
    headers: {
      token: getCookie(),
      language: getLan()
    }
  });
}
//获取实时机会 未登录
export async function getCurrentData(params) {
  return axios.get(baseApi + "/realtime_arbitrage_opportunities", {
    params,
    headers: {
      language: getLan()
    }
  });
}

export async function msgSubmit(params) {
  return axios.post(baseApi + "/official/msg_submit", params, {
    headers: {
      language: getLan()
    }
  });
}

//修改关注的比赛
export async function changeFocusChance(params) {
  return axios.post(baseApi + "/customer/change_focus_chance", params, {
    headers: {
      token: getCookie(),
      language: getLan()
    }
  });
}

//修改关注的网站
export async function changeFocusWebsite(params) {
  return axios.post(baseApi + "/customer/change_focus_website", params, {
    headers: {
      token: getCookie(),
      language: getLan()
    }
  });
}

//用户收藏的网站
export async function getFocusList(params) {
  return axios.get(baseApi + "/customer/focus_list", {
    params,
    headers: {
      token: getCookie(),
      language: getLan()
    }
  });
}

//实时比赛信息
export async function realtimeGameInfoList(params) {
  return axios.get(baseApi + "/customer/realtime_game_info_list", {
    params,
    headers: {
      token: getCookie(),
      language: getLan()
    }
  });
}

//用户试用
export async function activeVip(params) {
  return axios.post(baseApi + "/customer/active_vip", params, {
    headers: {
      token: getCookie(),
      language: getLan()
    }
  });
}

//获取vip过期时间
export async function getUserInfo(params) {
  return axios.get(baseApi + "/customer/user_info", {
    params,
    headers: {
      token: getCookie(),
      language: getLan()
    }
  });
}

export async function websiteBalance(params = { order_name: "Website_code" }) {
  return axios.get(xxBussinessApi + "/customer/websiteBalance", {
    params,
    headers: {
      token: getCookie(),
      language: getLan()
    }
  });
}

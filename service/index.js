import axios from "./axios";
import { baseApi } from "./config.js";
import { getCookie } from "../assets/utils";

export async function login(params) {
  return axios.get(baseApi + "/login", {
    params
  });
}

export async function sign(params) {
  return axios.post(baseApi + "/official/register", params);
}

export async function getHistoryData(params) {
  return axios.get(baseApi + "/historical_arbitrage_opportunities", {
    params
  });
}
//获取实时机会 已登录
export async function getCurrentDataLogined(params) {
  return axios.get(baseApi + "/customer/realtime_arbitrage_opportunities", {
    params,
    headers: {
      token: getCookie()
    }
  });
}
//获取实时机会 未登录
export async function getCurrentData(params) {
  return axios.get(baseApi + "/realtime_arbitrage_opportunities", {
    params
  });
}

export async function msgSubmit(params) {
  return axios.post(baseApi + "/official/msg_submit", params);
}

//修改关注的比赛
export async function changeFocusChance(params) {
  return axios.post(baseApi + "/customer/change_focus_chance", params, {
    headers: {
      token: getCookie()
    }
  });
}

//修改关注的网站
export async function changeFocusWebsite(params) {
  return axios.post(baseApi + "/customer/change_focus_website", params, {
    headers: {
      token: getCookie()
    }
  });
}

//用户收藏的网站
export async function getFocusList(params) {
  return axios.get(baseApi + "/customer/focus_list", {
    params,
    headers: {
      token: getCookie()
    }
  });
}

//实时比赛信息
export async function realtimeGameInfoList(params) {
  return axios.get(baseApi + "/customer/realtime_game_info_list", {
    params,
    headers: {
      token: getCookie()
    }
  });
}

export async function activeVip(params) {
  return axios.post(baseApi + "/customer/active_vip", params, {
    headers: {
      token: getCookie()
    }
  });
}

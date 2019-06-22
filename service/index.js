import axios from "./axios";
import { baseApi } from "./config.js";

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

export async function getCurrentData(params) {
  return axios.get(baseApi + "/realtime_arbitrage_opportunities", {
    params
  });
}

export async function msgSubmit(params) {
  return axios.post(baseApi + "/official/msg_submit", params);
}

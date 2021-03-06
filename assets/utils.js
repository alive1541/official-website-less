import Cookies from "js-cookie";
import enUs from "../intl/en_US.js";
import zhCn from "../intl/zh_CN.js";
import id from "../intl/id.js";
import objectAssign from "object-assign";

export function ifLogined() {
  return Cookies.get("token") !== undefined;
}

export function removeCookieAndStorage() {
  Cookies.remove("token");
  // localStorage.clear();
  localStorage.removeItem("expireDate");
  localStorage.removeItem("isNewUser");
}

export function setCookie(value, options) {
  //30天
  let seconds = 30 * 24 * 60 * 60 * 1000;
  let expires = new Date(new Date() * 1 + seconds);
  if (value) {
    return Cookies.set("token", value, options || { expires });
  }
  if (Cookies.get("token")) {
    value = Cookies.get("token");
    return Cookies.set("token", value, options || { expires });
  }
}

export function getCookie(key = "token") {
  return Cookies.get("token");
}

export function setTableKey(data) {
  if (!Array.isArray(data.list)) {
    return data.map((item, index) => {
      item.key = index.toString();
      return item;
    });
  }
  data.list = data.list.map((item, index) => {
    item.key = index.toString();
    return item;
  });
  return data;
}

// 获取语言
export function getLanguage() {
  try {
    let defaultLang = navigator.language || navigator.userLanguage; // 常规浏览器语言和IE浏览器
    if (defaultLang === "zh-CN") {
      defaultLang = "zh";
    }
    return defaultLang;
  } catch (e) {
    return "en";
  }
}

// // 修改html.lang显示
// export function changeHtmlLang(lang) {
//   return (document.getElementById("lang").lang = lang);
// }

// // 设置语言
// export function setLanguage(lang) {
//   const defaultLang = localStorage.setItem("lang", lang);
//   return defaultLang;
// }

// 匹配语言
export function chooseLocale(lan) {
  switch (lan) {
    case "en":
      // changeHtmlLang(getLanguage());
      return { ...enUs };
    case "zh":
      // changeHtmlLang(getLanguage());
      return { ...zhCn };
    case "id":
      return { ...id };
    default:
      // changeHtmlLang(getLanguage());
      return { ...zhCn };
  }
}

export function getLanguageFromStorage() {
  try {
    return localStorage.getItem("language") || getLanguage();
  } catch (e) {
    return "en";
  }
}

export function getClientWidth() {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
}

export function getDeviceInfo() {
  //只统计移动端数据
  // 添加uuid os
  // var data = tytlnative.getDeviceInfo(); return '{"uuid": "xxxx","os": "android"}'
  if (window.tytlnative) {
    const { uuid, os } = JSON.parse(window.tytlnative.getDeviceInfo());
    if (uuid && os) {
      return {
        uuid,
        os
      };
    }
  }
}
export function assignDeviceInfo(params) {
  const deviceInfo = getDeviceInfo();
  if (deviceInfo) {
    return objectAssign(params, deviceInfo);
  }
  return params;
}

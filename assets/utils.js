import Cookies from "js-cookie";

export function ifLogined() {
  return Cookies.get("token") !== undefined;
}

export function removeCookie() {
  return Cookies.remove("token");
}

export function setCookie(value, options) {
  let seconds = 60;
  let expires = new Date(new Date() * 1 + seconds * 1000);
  value = value || Cookies.get("token");
  return Cookies.set("token", value, options || { expires });
}

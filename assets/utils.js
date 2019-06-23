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
  if (value) {
    return Cookies.set("token", value, options || { expires });
  }
  if (Cookies.get("token")) {
    value = Cookies.get("token");
    return Cookies.set("token", value, options || { expires });
  }
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

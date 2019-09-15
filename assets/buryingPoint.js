import { baseApi } from "../service/config";
import axios from "axios";
import dayjs from "dayjs";

export const commonPoint = (type = "common", desc = "未添加描述", element) => {
  try {
    const params = {
      page: location.pathname.slice(1),
      bhv_type: type,
      bhv_datetime: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      desc
    };
    //只统计移动端数据
    // 添加uuid os
    // var data = tytlnative.getImei();
    params.uuid = 111;
    const os = getNaviator();
    if (os) {
      params.os = os;
    }
    //获取ip
    if (returnCitySN) {
      params.ip = returnCitySN.cip;
    }
    //增加element
    if (element) {
      params.element = element;
    }
    axios.post(baseApi + "/device/upload_action_info", params);
  } catch (e) {
    // console.log(e);
  }
};

function getNaviator() {
  const u = navigator.userAgent;

  const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端

  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

  if (isAndroid) {
    return "android";
  }

  if (isiOS) {
    return "ios";
  }

  return false;
}

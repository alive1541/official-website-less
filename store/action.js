import * as types from "./types";

export function changeLanguage(lan) {
  return {
    type: types.CHANGE_LANGUAGE,
    lan
  };
}

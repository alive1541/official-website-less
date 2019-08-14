import { CHANGE_LANGUAGE } from "./types";
import { combineReducers } from "redux";

function setStorage(lan) {
  try {
    localStorage.setItem("language", lan);
  } catch (e) {}
}

export function language(state = "", action) {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      setStorage(action.value);
      return action.value;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  language
});

export default rootReducer;

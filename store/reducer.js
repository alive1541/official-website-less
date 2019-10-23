import { CHANGE_LANGUAGE, CHANGE_CHANNEL_ID } from "./types";
import { combineReducers } from "redux";

const defaultState = {
  channelId: undefined
};

export function store(state = defaultState, action) {
  switch (action.type) {
    case CHANGE_CHANNEL_ID:
      return {
        ...state,
        channelId: action.value
      };
    default:
      return state;
  }
}

export function language(state = "id", action) {
  switch (action.type) {
    case CHANGE_LANGUAGE:
      return action.value;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  language,
  store
});

export default rootReducer;

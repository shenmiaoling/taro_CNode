// import * as globalService from "./globalService";
import Taro from "@tarojs/taro";

export default {
  namespace: "global",
  state: {
    init: false,
    isLogin: false,
    accessToken: null,
  },

  effects: {
    *login(_, { call, put }) {
      let { payload } = _;
      //   let resp = yield call(globalService.userLogin, { code: payload });
      //   yield put({ type: "fetchLocation" });
      //   yield put({ type: "initDone" });
      //   yield put({
      //     type: "saveToken",
      //     payload: {
      //       accessToken: resp.data.accessToken,
      //     },
      //   });
    },
  },

  reducers: {
    initDone(state, { payload }) {
      state.init = true;
    },
    saveToken(state, { payload }) {
      state.accessToken = payload.accessToken;
    },
  },
  subscriptions: {},
};

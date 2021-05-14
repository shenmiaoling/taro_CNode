import * as loginApi from "./service";
import { connectSocket } from "@tarojs/taro";

export default {
  namespace: "login",
  state: {
    user: {
      loading: false,
      topics: [],
    },
  },

  effects: {
    *getUserInfo(_, { call, put, select }) {
      yield put({ type: "loadUser" });
      let { payload } = _;
      let userInfo = yield call(loginApi.verificationToken, {
        accessToken: payload.accessToken,
      });
      console.log("userInfo:", userInfo);
      //   yield put({
      //     type: "loadTokenSuccess",
      //     payload: {
      //       topics: topics.concat(topicList.data),
      //     },
      //   });
    },
  },

  reducers: {
    loadUser(state, { payload }) {
      state.user.loading = true;
    },
    loadTokenSuccess(state, { payload }) {
      state.user.loading = false;
      //   state.user.info = payload.topics;
    },
  },
};

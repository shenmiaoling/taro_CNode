import * as indexApi from "./service";
import Taro, { getCurrentInstance } from "@tarojs/taro";
// import { Index } from "./index";
function getCategoryId(category, defaultId) {
  let _category = category || [];
  let hasId = false;
  if (defaultId) {
    _category.forEach(function (item) {
      if (item.id === defaultId) {
        hasId = true;
      }
    });
  }

  if (hasId) {
    return defaultId;
  }

  return _category.length > 0 ? category[0]["id"] : null;
}
const initGoodsList = {
  curPageSize: null,
  list: [],
  pageNum: 1,
  pageSize: 10,
  totalPages: 1,
  totalRows: 1,
};

export default {
  namespace: "index",
  state: {
    home: {
      loading: false,
      pageSize: 20,
      topics: [],
    },
    user: {
      loading: false,
      info: {},
      error: "",
      ifLogin: false,
      collectTopics: [],
    },
    currentTab: 0,
  },

  effects: {
    *setTabbar(_, { call, put, select }) {
      let { payload } = _;
      yield put({ type: "setCurrentBar", payload: payload });
    },
    *getTopics(_, { call, put, select }) {
      yield put({ type: "loadHome" });
      let { payload } = _;
      const { topics, pageSize } = yield select((state) => state.index.home);

      let topicList = yield call(indexApi.getTopics, {
        page: payload.page,
        tab: payload.tab,
        limit: pageSize,
      });
      yield put({
        type: "loadTopicSuccess",
        payload: {
          topics: topics.concat(topicList.data),
        },
      });
    },
    *getUserInfo(_, { call, put, select }) {
      try {
        yield put({ type: "loadUser" });
        let { payload } = _;
        let userInfo = yield call(indexApi.verificationToken, {
          accesstoken: payload.accessToken,
        });

        yield put({
          type: "loadUserSuccess",
          payload: {
            userInfo: userInfo,
            accessToken: payload.accessToken,
          },
        });
        var collectTopics = yield call(indexApi.getTopicCollect, {
          loginname: userInfo.loginname,
        });
        yield put({
          type: "loadCollectTopics",
          payload: {
            collectTopics: collectTopics.data,
          },
        });
      } catch (error) {
        console.log("fail");
        yield put({ type: "loadUserFail", payload: { error } });
      }
    },
  },

  reducers: {
    setCurrentBar(state, { payload }) {
      state.currentTab = payload;
    },
    clearTopics(state, { payload }) {
      state.home.topics = [];
    },
    loadHome(state, { payload }) {
      state.home.loading = true;
    },
    loadTopicSuccess(state, { payload }) {
      state.home.loading = false;
      state.home.topics = payload.topics;
    },
    loadUser(state, { payload }) {
      state.user.loading = true;
    },
    loadUserSuccess(state, { payload }) {
      state.user.loading = false;
      state.user.info = payload.userInfo;
      state.user.ifLogin = true;
      Taro.setStorage({
        key: "accessToken",
        data: payload.accessToken,
      });
      if (state.currentTab === 1) {
        Taro.atMessage({
          message: "登录成功",
          type: "success",
        });
      }
    },
    loadUserFail(state, { payload }) {
      state.user.loading = false;
      state.user.error = payload.error;
      state.user.ifLogin = false;
      if (state.currentTab === 1) {
        Taro.atMessage({
          message: "token 无效",
          type: "error",
        });
      }
      Taro.clearStorage();
    },
    loadCollectTopics(state, { payload }) {
      state.user.collectTopics = payload.collectTopics;
    },
  },
};

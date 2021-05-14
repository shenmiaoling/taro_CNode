import * as topicApi from "./service";

export default {
  namespace: "topic",
  state: {
    topic: {
      loading: false,
      detail: {},
      collectActive: false,
    },
  },

  effects: {
    *getTopicDetail(_, { call, put, select }) {
      yield put({ type: "loadTopicInfo" });
      let { payload } = _;
      let topicDetail = yield call(topicApi.getTopicDetail, {
        id: payload.id,
      });
      yield put({
        type: "loadTopicSuccess",
        payload: {
          topicDetail: topicDetail.data,
        },
      });
    },
    *getTopicDetail(_, { call, put, select }) {
      yield put({ type: "loadTopicInfo" });
      let { payload } = _;
      let topicDetail = yield call(topicApi.getTopicDetail, {
        id: payload.id,
      });
      yield put({
        type: "loadTopicSuccess",
        payload: {
          topicDetail: topicDetail.data,
        },
      });
    },
    *collectTopic(_, { call, put, select }) {
      yield put({ type: "loadColllect" });
      let { payload } = _;
      let topicDetail = yield call(topicApi.collectTopic, {
        id: payload.id,
      });
      yield put({
        type: "loadColllectSuccess",
      });
    },
  },

  reducers: {
    loadTopicInfo(state, { payload }) {
      state.topic.loading = true;
    },
    loadTopicSuccess(state, { payload }) {
      state.topic.loading = false;
      state.topic.detail = payload.topicDetail;
    },
    loadColllect(state, { payload }) {
      state.topic.collectActive = true;
    },
    loadColllectSuccess(state, { payload }) {
      state.topic.collectActive = false;
    },
  },
};

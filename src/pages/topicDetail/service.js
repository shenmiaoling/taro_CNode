import Request from "@request";

// 获取主题详情
export const getTopicDetail = (param) => {
  return Request({
    url: `/topic/${param.id}`,
    method: "GET",
  });
};

export const collectTopic = (data) => {
  let { accessToken, ...param } = data;
  return Request({
    url: "/topic_collect/collect",
    method: "POST",
    params: param,
    headers: {
      Authorization: accessToken,
    },
  });
};

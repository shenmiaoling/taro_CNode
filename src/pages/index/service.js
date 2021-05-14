import Request from "@request";

export const getTopics = (param) => {
  return Request({
    url: "/topics",
    method: "GET",
    params: param,
  });
};

export const verificationToken = (param) => {
  let { ...restData } = param;
  return Request({
    url: "/accesstoken",
    method: "POST",
    params: restData,
  });
};

export const getTopicCollect = (param) => {
  return Request({
    url: `/topic_collect/${param.loginname}`,
    method: "GET",
  });
};

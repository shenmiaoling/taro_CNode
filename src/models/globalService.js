import Request from "../utils/request";

export const userLogin = (data) => {
  return Request({
    method: "GET",
    url: "/wxuser/login",
    params: data,
  });
};

export const userInfoLogin = (data) => {
  let { accessToken, ...params } = data;
  return Request({
    method: "POST",
    url: "/wxuser/login-token",
    data: params,
    headers: {
      Authorization: accessToken,
      // "content-type":'application/json'
    },
  });
};

export const getLocation = (map) => {
  return new Promise((resolve, reject) => {
    map.getRegeo({
      success: function (data) {
        //成功回调
        resolve(data);
      },
      fail: function (info) {
        //失败回调
        reject(info);
      },
    });
  });
};

export const uploadLocation = (data) => {
  let { accessToken, address} = data;
  return Request({
    method: "POST",
    url: `/user-location/update?address=${address}`,
    headers: {
      Authorization: accessToken,
      // "content-type":'application/json'
    },
  });
};

export const fetchLocation=(data)=>{
  let { accessToken } = data;
  return Request({
    method: "get",
    url: "/user-location/get",
    headers: {
      Authorization: accessToken,
      // "content-type":'application/json'
    },
  });
}
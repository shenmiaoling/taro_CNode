import axios from "taro-axios";
import Taro from "@tarojs/taro";

const baseURL = "https://cnodejs.org/api/v1";
const service = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 60 * 1000 * 5,
});
// service.interceptors.request.use((config) => {
//   var accessToken = Taro.getStorageInfo("accessToken");
//   console.log("accesssToken:", accessToken);
//   if (accessToken) {
//     config.headers["Authorization"] = accessToken;
//   }
//   return config;
// });
service.interceptors.response.use(
  (resp) => {
    if (resp.status !== 200) {
      return Promise.reject("出错了");
    }
    return resp.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;

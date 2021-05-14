import React, { useState, useCallback, useEffect } from "react";
import { useReady, useShareAppMessage, getCurrentInstance } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useSelector } from "react-redux";
import Home from "../components/home";
import User from "../components/user";
import deafaultHome from "../../images/home.png";
import homeActive from "../../images/home_active.png";
import defaultUser from "../../images/user.png";
import userActive from "../../images/user_active.png";
import "./index.scss";
import { AtButton, AtTabBar, AtMessage } from "taro-ui";
import { getDispatch } from "@utils/dva";
const dispatch = getDispatch();
function Index() {
  const [currentTab, setCurrentTab] = useState(1);
  const [shareInfo] = useState({ id: 2 });
  const [value, setValue] = useState("");
  const { index } = useSelector((store) => store);
  // useShareAppMessage((res) => {
  //   return {
  //     title: "自定义转发标题",
  //     path: "/pages/user/user?id=123",
  //     imageUrl:
  //       "https://cdn.pixabay.com/photo/2018/02/26/16/30/eggs-3183410__340.jpg",
  //     desc: "测试分享描述",
  //     success(res) {
  //       console.log("转发成功:" + JSON.stringify(res));
  //     },
  //     fail(res) {
  //       // 转发失败
  //       console.log("转发失败:" + JSON.stringify(res));
  //     },
  //     complete(res) {
  //       console.log("complete:", res);
  //     },
  //   };
  // });
  useEffect((options) => {
    if (index.currentTab === 0) {
      Taro.setNavigationBarTitle({
        title: "首页",
      });
    } else {
      Taro.setNavigationBarTitle({
        title: "我的",
      });
    }
  });
  useReady(() => {
    Taro.getStorage({ key: "accessToken" })
      .then((res) => {
        dispatch({
          type: "index/getUserInfo",
          payload: { accessToken: res.data },
        });
      })
      .catch((err) => {
        // console.log(err);
      });
  });
  function selectTab(value) {
    dispatch({
      type: "index/setTabbar",
      payload: value,
    });
  }

  return (
    <View className="index">
      <AtMessage />
      {/* <AtButton id="share" dataName="shareBtn" openType="share">
        转发
      </AtButton> */}
      {index.currentTab === 0 ? <Home /> : <User />}
      <AtTabBar
        fixed
        onClick={selectTab}
        current={index.currentTab}
        selectedColor="#80bd01"
        tabList={[
          { title: "首页", image: deafaultHome, selectedImage: homeActive },
          { title: "我的", image: defaultUser, selectedImage: userActive },
        ]}
      ></AtTabBar>
    </View>
  );
}
export default Index;

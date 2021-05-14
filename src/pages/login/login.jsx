import React, { useState, useCallback, useEffect } from "react";
import { useReady, useShareAppMessage, getCurrentInstance } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton, AtTabBar } from "taro-ui";
function Login() {
  const [currentTab, setCurrentTab] = useState(0);
  const [shareInfo] = useState({ id: 2 });
  const [value, setValue] = useState("");
  useReady(() => {
    let tab = getCurrentInstance().router.params;
    console.log("params:", tab);
  });
  return <View className="index">登录界面</View>;
}
export default Login;

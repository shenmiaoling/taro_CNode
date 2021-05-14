import React, { useState, useCallback, useEffect } from "react";
import { useReady, useShareAppMessage, getCurrentInstance } from "@tarojs/taro";
import { View, Text, WebView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { AtButton, AtTabBar } from "taro-ui";
function User() {
  const [currentTab, setCurrentTab] = useState(0);
  const [shareInfo] = useState({ id: 2 });
  const [value, setValue] = useState("");
  useReady(() => {
    let params = getCurrentInstance().router.params;
    setValue(params.url);
  });
  return (
    <View className="index">
      <WebView src={value}></WebView>
    </View>
  );
}
export default User;

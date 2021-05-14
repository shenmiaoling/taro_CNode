import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Image, Input } from "@tarojs/components";
import Taro, { useReady, useDidShow } from "@tarojs/taro";
import "./index.scss";
import { getDispatch } from "@utils/dva";
import {
  AtButton,
  AtInput,
  AtToast,
  AtMessage,
  AtAvatar,
  AtAccordion,
  AtList,
  AtListItem,
} from "taro-ui";
import { useSelector } from "react-redux";
import logo from "../../../images/logo.svg";
const dispatch = getDispatch();

function User() {
  var { user } = useSelector((store) => store.index);
  const [token, setToken] = useState("");
  const [open, setOpen] = useState(false);
  useReady(() => {
    // dispatch({
    //   type: "index/getTopicCollect",
    //   // payload: { login: pageNum, tab: currentTag },
    // });
  });
  const onInput = (e) => {
    setToken(e);
  };

  const handleLogin = () => {
    if (token) {
      dispatch({
        type: "index/getUserInfo",
        payload: { accessToken: token },
      });
    } else {
      Taro.atMessage({
        message: "token 不能为空",
        type: "warning",
      });
    }
  };
  const handleClick = (value) => {
    setOpen(value);
  };
  const handleTopicDetail = (item) => {
    const id = item.currentTarget.dataset.id;
    Taro.navigateTo({
      url: `/pages/topicDetail/topicDetail?id=${id}`,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data);
        },
        someEvent: function (data) {
          console.log(data);
        },
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
      },
    });
  };
  return (
    <View>
      <AtToast
        isOpened={user.loading}
        text="登录中..."
        icon="loading-2"
        status="loading"
      ></AtToast>
      <AtMessage />
      {user.ifLogin ? (
        <View className="user">
          <View className="avatar-bg">
            <View className="user-info">
              <Image src={user.info.avatar_url} className="avatar" />
              <View>
                <Text className="username">{user.info.loginname}</Text>
              </View>
            </View>
          </View>
          <View>
            <AtAccordion open={open} onClick={handleClick} title="收藏的主题">
              <AtList hasBorder={false}>
                {user.collectTopics.map((item, index) => {
                  return (
                    <View
                      key={index}
                      data-id={item.id}
                      onClick={handleTopicDetail}
                    >
                      <AtListItem
                        title={item.title}
                        arrow="right"
                        thumb={item.author.avatar_url}
                      />
                    </View>
                  );
                })}
              </AtList>
            </AtAccordion>
          </View>
        </View>
      ) : (
        <View className="login">
          <Image src={logo} className="logo" />
          <View className="input-content">
            <AtInput
              className="token-input"
              name="token"
              placeholder="请输入accessToken"
              value={token}
              onChange={onInput}
            />
          </View>
          <AtButton type="primary" onClick={handleLogin}>
            登录
          </AtButton>
        </View>
      )}
    </View>
  );
}
export default User;

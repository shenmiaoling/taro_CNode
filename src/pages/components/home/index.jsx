import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Image } from "@tarojs/components";
import Taro, { useReady, useReachBottom, usePageScroll } from "@tarojs/taro";
import { getDispatch } from "@utils/dva";
import "./index.scss";
import {
  AtButton,
  AtTabBar,
  AtAvatar,
  AtFab,
  AtToast,
  AtTabs,
  AtTabsPane,
} from "taro-ui";
import avatar from "../../../images/default.jpg";
import eye from "../../../images/eye.png";
import message from "../../../images/message.png";
import { AtIcon } from "taro-ui";
import { axios } from "taro-axios";
import { useSelector } from "react-redux";
import { getDateDiff } from "@utils/utils.js";
const dispatch = getDispatch();
function Home() {
  const [currentTab, setCurrentTab] = useState(0);
  const [currentTag, setCurrentTag] = useState("all");
  const [pageNum, setPageNum] = useState(1);
  const [value, setValue] = useState("");
  const [floorStatus, setFloorStatus] = useState(false);
  var { home } = useSelector((store) => store.index);
  useReady(() => {
    dispatch({
      type: "index/getTopics",
      payload: { page: pageNum, tab: currentTag },
    });
  });
  useReachBottom(() => {
    setPageNum(pageNum + 1);
    dispatch({
      type: "index/getTopics",
      payload: { page: pageNum + 1, tab: currentTag },
    });
  });
  usePageScroll((res) => {
    if (res.scrollTop > 100) {
      setFloorStatus(true);
    } else {
      setFloorStatus(false);
    }
  });
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: "首页",
    });
    Taro.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: "#ffffff",
    });
  });
  async function handlePay() {
    axios
      .get("http://192.168.8.166:8888/tt/wx-pay", {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiODIyYjE0M2E2N2U0ODFlYTU2MDU0MDFhOTY2ZDgwYyIsImlzcyI6InJtYW56enoiLCJqd3QtdXNlci1vcGVuSWQta2V5Ijoib1dQcGQ1ZUppek5ZRlBWdlhSS0xDMkUzMmQzNCIsImV4cCI6MTU5OTA5Njc3MiwiaWF0IjoxNTk2NTA0NzcyfQ.ynYs1MRjGzY08thPLYbyO_aY-lsqtOJ4EOcDknpwJ14",
        },
      })
      .then((res) => {
        let payInfo = res.data.data;
        Taro.requestPayment({
          timeStamp: payInfo.timeStamp,
          nonceStr: payInfo.nonceStr,
          package: payInfo.packageValue,
          signType: payInfo.signType,
          paySign: payInfo.paySign,
          success: function (res) {
            console.log("success:", res);
          },
          fail: function (res) {
            console.log("error:", res);
          },
        });
      });
  }
  const tab = (item) => {
    if (item.top) {
      return <View className="tag top-tag">置顶</View>;
    } else if (item.good) {
      return <View className="tag good-tag">精华</View>;
    } else {
      switch (item.tab) {
        case "share":
          return <View className="tag share-tag">分享</View>;
        case "ask":
          return <View className="tag ask-tag">问答</View>;
        case "job":
          return <View className="tag job-tag">招聘</View>;
        default:
          return null;
      }
    }
  };
  const selectTab = (value) => {
    dispatch({ type: "index/clearTopics" });
    setCurrentTab(value);
    switch (value) {
      case 0:
        setCurrentTag("all");
        dispatch({
          type: "index/getTopics",
          payload: { page: 1, tab: "all" },
        });
        break;
      case 1:
        setCurrentTag("good");
        dispatch({
          type: "index/getTopics",
          payload: { page: 1, tab: "good" },
        });
        break;
      case 2:
        setCurrentTag("share");
        dispatch({
          type: "index/getTopics",
          payload: { page: 1, tab: "share" },
        });
        break;
      case 3:
        setCurrentTag("ask");
        dispatch({
          type: "index/getTopics",
          payload: { page: 1, tab: "ask" },
        });
        break;
      case 4:
        setCurrentTag("job");
        dispatch({
          type: "index/getTopics",
          payload: { page: 1, tab: "job" },
        });
        break;
      default:
        break;
    }
  };
  const backTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  };
  const handleDetail = (item) => {
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
    <View className="home">
      <AtTabs
        current={currentTab}
        scroll
        tabList={[
          { title: "全部" },
          { title: "精华" },
          { title: "分享" },
          { title: "问答" },
          { title: "招聘" },
        ]}
        onClick={selectTab}
      ></AtTabs>
      {floorStatus && (
        <View className="arrow-up">
          <AtFab size="small" onClick={backTop}>
            <Text className="at-fab__icon at-icon at-icon-arrow-up"></Text>
          </AtFab>
        </View>
      )}

      <AtToast
        isOpened={home.loading}
        text="正在加载..."
        icon="loading-2"
        status="loading"
      ></AtToast>
      {home.topics.map((item, index) => {
        return (
          <View
            className="topic-item"
            key={index}
            data-id={item.id}
            onClick={handleDetail}
          >
            <View className="item-content">
              <View className="left-item">
                <AtAvatar
                  circle
                  size="small"
                  image={item.author.avatar_url}
                ></AtAvatar>
                {tab(item)}
                <Text className="title">{item.title}</Text>
              </View>
              <View className="right-item">
                {getDateDiff(item.last_reply_at)}
              </View>
            </View>
            <View className="bottom-item">
              <View className="icon-align">
                <View className="at-icon at-icon-eye topic-icon"></View>
                <Text className="read-count">{item.visit_count}</Text>
              </View>
              <View className="icon-align">
                <View className="at-icon at-icon-message coment-icon"></View>
                <Text className="coment-count">{item.reply_count}</Text>
              </View>
            </View>
          </View>
        );
      })}

      {/* <AtButton onClick={handlePay}>唤起支付</AtButton> */}
    </View>
  );
}
export default Home;

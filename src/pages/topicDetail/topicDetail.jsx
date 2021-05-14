import React, { useState, useEffect } from "react";
import { getDispatch } from "@utils/dva";
import Taro, {
  useReady,
  useShareAppMessage,
  getCurrentInstance,
  usePageScroll,
} from "@tarojs/taro";
import { View, Text, RichText, Button } from "@tarojs/components";
import "./topicDetail.scss";
import {
  AtButton,
  AtToast,
  AtDivider,
  AtAvatar,
  AtTag,
  AtFab,
  AtActivityIndicator,
} from "taro-ui";
import { useSelector } from "react-redux";
import { formatTime } from "@utils/utils.js";
import "@tarojs/taro/html.css";
const dispatch = getDispatch();
function User() {
  const [topicInfo, setTopicInfo] = useState();
  const [date, setDate] = useState("");
  const [markdownImg, setmarkdownImg] = useState([]);
  const [floorStatus, setfloorStatus] = useState(false);
  const { topic } = useSelector((store) => store.topic);

  useReady(() => {
    // getCurrentInstance().router.params.id;
    let ID = "5ee1ee83b703280f0bcb922a";
    dispatch({
      type: "topic/getTopicDetail",
      payload: { id: ID },
    });
    Taro.options.html.transformElement = (el) => {
      if (el.nodeName === "image") {
        setmarkdownImg(markdownImg.push("http:" + el.props.src));
        el.setAttribute("mode", "widthFix");
        el.addEventListener("tap", imageOnTap);
        el.setAttribute("data-url", el.props.src);
      }
      if (el.className === "a") {
        el.setAttribute("data-url", el.props.href);
        el.addEventListener("tap", linkOnTap);
      }
      return el;
    };
  });
  const test = false;
  usePageScroll((res) => {
    let scrollTop = res.scrollTop;
    if (scrollTop > 100) {
      setfloorStatus(true);
    } else {
      setfloorStatus(false);
    }
  });
  useEffect(() => {
    Taro.setNavigationBarColor({
      frontColor: "#000000",
      backgroundColor: "#ffffff",
    });
  });
  const imageOnTap = (e) => {
    Taro.previewImage({
      current: "http:" + e.target.dataset.url, // 当前显示图片的http链接
      urls: markdownImg, // 需要预览的图片http链接列表
    });
  };
  const linkOnTap = (e) => {
    Taro.navigateTo({
      url: `/pages/webview/webview?url=${e.target.dataset.url}`,
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
        res.eventChannel.emit("acceptDataFromOpenerPage", { data: "test" });
      },
    });
  };

  Taro.setNavigationBarTitle({
    title: topic.loading ? "" : `${topic.detail.title}`,
  });

  const backTop = () => {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    });
  };
  const cancelCollect = (e) => {
    console.log("cancelCollect:", e);
  };
  const collectTopic = (e) => {
    console.log("collect", e);
    dispatch({
      type: "topic/getTopicDetail",
      payload: { id: ID },
    });
    dispatch;
  };
  return (
    <View className="topic-detail at-article">
      <View
        className="load-content"
        style={{ display: topic.loading ? "block" : "none" }}
      >
        <AtActivityIndicator
          color="#6ba44e"
          mode="center"
          isOpened={topic.loading}
        ></AtActivityIndicator>
        {/* isOpened={topic.loading} */}
        {/* <AtToast
          isOpened
          text="正在加载..."
          icon="loading-2"
          status="loading"
        ></AtToast> */}
      </View>
      {topic.detail.is_collect ? (
        <Button
          data-id={topic.detail.id}
          className="default-btn collect-btn"
          onClick={cancelCollect}
        >
          取消收藏
        </Button>
      ) : (
        <Button
          data-id={topic.detail.id}
          className="default-btn active-btn"
          onClick={collectTopic}
        >
          收藏
        </Button>
      )}
      <View className="">
        <View className="at-article__h1">{topic.detail.title}</View>
        <View className="at-article__info">
          <Text className="list-icon">
            发布于：{formatTime(new Date(topic.detail.create_at))}
          </Text>
          <Text className="list-icon">
            作者：
            {JSON.stringify(topic.detail.author)
              ? topic.detail.author.loginname
              : ""}
          </Text>
          <Text className="list-icon">{topic.detail.visit_count}次浏览</Text>
          <Text className="list-icon" selectable>
            来自
            {(function () {
              switch (topic.detail.tab) {
                case "share":
                  return "分享";
                case "ask":
                  return "问答";
                case "job":
                  return "招聘";
                case "good":
                  return "精华";
                default:
                  return "其他";
              }
            })()}
          </Text>
        </View>
      </View>
      <View>
        {!topic.loading && (
          <View
            className="taro_html"
            dangerouslySetInnerHTML={{ __html: topic.detail.content }}
          ></View>
        )}
      </View>
      <AtDivider
        content={topic.detail.reply_count + " 回复"}
        fontColor="#444"
      />
      {topic.detail.replies &&
        topic.detail.replies.map((item, index) => {
          return (
            <View className="replies" key={index}>
              <View className="reply-user">
                <AtAvatar
                  image={item.author.avatar_url}
                  size="small"
                  className="avatar"
                ></AtAvatar>
                <Text>{item.author.loginname}</Text>
                <Text className="list-icon">{index + 1}楼</Text>
                <Text className="list-icon">
                  {formatTime(new Date(item.create_at))}
                </Text>
                {topic.detail.author.loginname === item.author.loginname && (
                  <AtTag size="small" active>
                    作者
                  </AtTag>
                )}
              </View>
              <View
                className="taro_html"
                dangerouslySetInnerHTML={{ __html: item.content }}
              ></View>
              {/* <RichText nodes={item.content} className="content" /> */}
            </View>
          );
        })}
      {floorStatus && (
        <View className="arrow-up">
          <AtFab size="small" onClick={backTop}>
            <Text className="at-fab__icon at-icon at-icon-arrow-up"></Text>
          </AtFab>
        </View>
      )}
    </View>
  );
}
export default User;

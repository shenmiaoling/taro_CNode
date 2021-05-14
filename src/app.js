import React, { Component } from "react";
import { createApp, getDispatch } from "./utils/dva";
import { Provider } from "react-redux";
import "./app.scss";
import "taro-ui/dist/style/index.scss";
import models from "./models/index";
const dvaApp = createApp({
  initialState: {},
  models: models,
});

const store = dvaApp.getStore();

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  // this.props.children 是将要会渲染的页面
  render() {
    return <Provider store={store}>{this.props.children}</Provider>;
  }
}

export default App;

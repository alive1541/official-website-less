import React, { Component } from "react";
import { Spin } from "antd";
import ReactDOM from "react-dom";

class Main extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
  }
  start() {
    // 开始显示
    this.setState({
      show: true
    });
  }
  done() {
    // 结束隐藏
    this.setState({
      show: false
    });
  }

  render() {
    const { show } = this.state;
    const style = {
      position: "fixed",
      top: "25px",
      left: isMobile ? "95px" : "25px"
    };
    return <div style={style}>{show && <Spin size="large" />}</div>;
  }
}

function isBrowser() {
  return process.browser;
}

let Box;
let isMobile;
if (isBrowser()) {
  isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

  // 创建元素追加到body
  let div = window.document.createElement("div");
  let props = {};
  document.body.appendChild(div);

  Box = ReactDOM.render(React.createElement(Main, props), div);
}

export default Box;

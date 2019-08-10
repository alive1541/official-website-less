import React from "react";
import Link from "next/link";
import { Icon, Button, Popconfirm } from "antd";
import { ifLogined, removeCookie } from "../assets/utils";
import "./style/nav.less";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: this.props.isMobile ? false : true,
      secondMenuVisible: false
    };
  }

  handleMouseEnter = e => {
    // console.log("handleMouseEnter");

    this.setState({ secondMenuVisible: true });
  };
  handleMouseLeave = e => {
    // console.log("handleMouseLeave");
    this.setState({ secondMenuVisible: false });
  };
  handleClick = e => {
    e.stopPropagation();
    const { secondMenuVisible } = this.state;
    // console.log("handleClick");
    // console.log("e11", e.target.className);
    const className = e.target.className;
    // const pathname = location.pathname.slice(1);
    // const ifSelf = new RegExp(pathname).test(className);
    const ifSelf = this.isSelfRouter(className);
    //路由当前页面，自动关闭
    if (ifSelf) {
      if (this.props.isMobile) {
        this.setState({ menuVisible: false });
      } else {
        this.setState({ secondMenuVisible: false });
      }
    }
    const ifClickTopBar = /product-title/.test(className);
    if (this.props.isMobile && ifClickTopBar) {
      this.setState({ secondMenuVisible: !secondMenuVisible });
    }
  };
  isSelfRouter = className => {
    const pathname = this.props.pathName;
    if (pathname === undefined) {
      return false;
    }
    // const pathname = window.location.pathname.slice(1);
    return new RegExp(pathname).test(className);
  };
  handleIconClick = e => {
    const { menuVisible } = this.state;
    this.setState({ menuVisible: !menuVisible });
  };
  handleItemClassName = (classNames, others) => {
    const ifSelf = this.isSelfRouter(classNames);
    return ifSelf ? `menu-item active ${others}` : `menu-item ${others}`;
  };
  confirm = () => {
    removeCookie();
  };
  render() {
    const { menuVisible, secondMenuVisible } = this.state;
    const { isMobile } = this.props;
    const size = isMobile ? "small" : "default";
    console.log("1", isMobile);
    return (
      <nav>
        <div className="nav-wraper">
          <div className="logo" style={{ width: "100px" }}>
            <img src="/static/img/logo.png" />
          </div>
          {isMobile && (
            <div className="nav-icon-wrap" onClick={this.handleIconClick}>
              <Icon type="menu-fold" />
            </div>
          )}
          {menuVisible && (
            <div className="menu">
              <div
                className={this.handleItemClassName(["index"])}
                onClick={this.handleClick}
              >
                <Link href={{ pathname: "/index" }}>
                  <a className="index">产品介绍</a>
                </Link>
              </div>

              <div className="block" />

              <div
                className={this.handleItemClassName(["myBackStage"])}
                onClick={this.handleClick}
              >
                <Link href={{ pathname: "/myBackStage" }}>
                  <a className="index">我的后台</a>
                </Link>
              </div>

              {/** <div
                className="menu-item product"
                className={this.handleItemClassName(
                  ["subscribe", "orderService"],
                  "product"
                )}
                onClick={this.handleClick}
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
              >
                <div className="product-title">
                  产品介绍
                  {isMobile && (
                    <span className="product-icon">
                      <Icon type="down" />
                    </span>
                  )}
                </div>
                {secondMenuVisible && (
                  <div className="second-menu">
                    <div className="second-menu-item">
                      <Link
                        href={{
                          pathname: "/subscribe"
                        }}
                      >
                        <a className="subscribe">
                          {isMobile && "- "}套利机会订阅
                        </a>
                      </Link>
                    </div>
                    <div className="second-menu-item">
                      <Link
                        href={{
                          pathname: "/orderService"
                        }}
                      >
                        <a className="orderService">
                          {isMobile && "- "}套利下单服务
                        </a>
                      </Link>
                    </div>
                  </div>
                )}
              </div>**/}
              <div className="block" />
              <div
                className={this.handleItemClassName(["concatUs"])}
                onClick={this.handleClick}
              >
                <Link href={{ pathname: "/concatUs" }}>
                  <a className="concatUs">联系我们</a>
                </Link>
              </div>
            </div>
          )}
        </div>
        <div className="log">
          {ifLogined() && (
            <Popconfirm
              title="是否要退出登录状态?"
              onConfirm={this.confirm}
              okText="确认"
              cancelText="取消"
            >
              <a href="#" style={{ verticalAlign: "middle" }}>
                退出{!isMobile && "登录"}
              </a>
            </Popconfirm>
          )}
          {!ifLogined() && (
            <Button size={size} type="danger" ghost>
              <Link href={{ pathname: "/login" }}>
                <a>登录</a>
              </Link>
            </Button>
          )}

          <span className="spacing-x" />
          <Button size={size}>
            <Link href={{ pathname: "/sign" }}>
              <a>注册</a>
            </Link>
          </Button>
        </div>
      </nav>
    );
  }
}

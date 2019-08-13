import React from "react";
import Link from "next/link";
import { Icon, Button, Popconfirm, Select } from "antd";
import { ifLogined, removeCookie } from "../assets/utils";
import { FormattedMessage } from "react-intl";
import "./style/nav.less";
import { connect } from "react-redux";

const { Option } = Select;

class Nav extends React.Component {
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
  lanChange = value => {
    this.props.dispatch({ type: "CHANGE_LANGUAGE", value });
  };
  render() {
    const { menuVisible } = this.state;
    const { isMobile } = this.props;
    const size = isMobile ? "small" : "default";
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
                  <a className="index">
                    <FormattedMessage id="nav1" />
                  </a>
                </Link>
              </div>

              <div className="block" />

              <div
                className={this.handleItemClassName(["myBackStage"])}
                onClick={this.handleClick}
              >
                <Link href={{ pathname: "/myBackStage" }}>
                  <a className="index">
                    <FormattedMessage id="nav2" />
                  </a>
                </Link>
              </div>

              <div className="block" />
              <div
                className={this.handleItemClassName(["concatUs"])}
                onClick={this.handleClick}
              >
                <Link href={{ pathname: "/concatUs" }}>
                  <a className="concatUs">
                    <FormattedMessage id="nav3" />
                  </a>
                </Link>
              </div>
            </div>
          )}
          {!isMobile && (
            <div className="nav-lan">
              <Select
                style={{ width: "90px" }}
                defaultValue="zh"
                onChange={this.lanChange}
              >
                <Option value="zh">中文</Option>
                <Option value="en">English</Option>
                <Option value="id" title="Orang indonesia">
                  Orang indonesia
                </Option>
              </Select>
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
              <a
                href="#"
                style={{ verticalAlign: "middle" }}
                // style={{ maxWidth: "60px" }}
              >
                退出{!isMobile && <FormattedMessage id="nav5" />}
              </a>
            </Popconfirm>
          )}
          {!ifLogined() && (
            <Button
              size={size}
              type="danger"
              ghost
              // style={{ maxWidth: "60px" }}
            >
              <Link href={{ pathname: "/login" }}>
                <a>
                  <FormattedMessage id="nav5" />
                </a>
              </Link>
            </Button>
          )}

          <span className="spacing-x" />
          {!ifLogined() && (
            <Button size={size}>
              <Link href={{ pathname: "/sign" }}>
                <a>
                  <FormattedMessage id="nav4" />
                </a>
              </Link>
            </Button>
          )}
        </div>
      </nav>
    );
  }
}

export default connect(state => state)(Nav);

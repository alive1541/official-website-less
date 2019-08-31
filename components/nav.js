import React from "react";
import Link from "next/link";
import { Icon, Button, Popconfirm, Select } from "antd";
import {
  ifLogined,
  getCookie,
  removeCookieAndStorage,
  getLanguageFromStorage
} from "../assets/utils";
import { FormattedMessage, injectIntl } from "react-intl";
import "./style/nav.less";
import { connect } from "react-redux";
import Router from "next/router";

const { Option } = Select;

class Nav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: this.props.isMobile ? false : true,
      secondMenuVisible: false,
      language: getLanguageFromStorage()
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
    removeCookieAndStorage();
    //在index页面的?token会造成刷新不了
    // location.reload();
    window.location.href = `${location.origin}${location.pathname}`;
  };
  lanChange = value => {
    this.setState({ language: value });
    this.props.dispatch({ type: "CHANGE_LANGUAGE", value });
  };
  goXXbussiness = () => {
    try {
      const expireDate = JSON.parse(localStorage.getItem("expireDate"));
      const isNewUser = JSON.parse(localStorage.getItem("isNewUser"));
      //未注册过网站的(新用户)
      if (ifLogined() && isNewUser) {
        location.href = `http://123.56.11.198:8990/#/page/getMoney?token=${getCookie()}&language=${getLanguageFromStorage()}&isNewUser=true`;
        //注册过网站的
      } else if (ifLogined() && expireDate && expireDate.type === "atTime") {
        location.href = `http://123.56.11.198:8990/#/page/account?token=${getCookie()}&language=${getLanguageFromStorage()}`;
      } else {
        Router.push({
          pathname: "/myBackStage"
        });
      }
    } catch (e) {
      console.log(11111, e);
    }
  };
  render() {
    const { menuVisible, language } = this.state;
    const {
      isMobile,
      intl: { messages }
    } = this.props;
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
                {/* <Link
                  onClick={this.goXXbussiness}
                  // href={{ pathname: "/myBackStage" }}
                > */}
                <a className="myBackStage" onClick={this.goXXbussiness}>
                  <FormattedMessage id="nav2" />
                </a>
                {/* </Link> */}
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
              {isMobile && (
                <div
                  className={this.handleItemClassName(["loginner"])}
                  onClick={this.handleClick}
                >
                  {ifLogined() && (
                    <div>
                      {isMobile ? (
                        <a href="#" onClick={this.confirm} className="sign">
                          <sapn
                            className="log-inner"
                            title={<FormattedMessage id="nav7" />}
                          >
                            <FormattedMessage id="nav7" />
                          </sapn>
                        </a>
                      ) : (
                        <Popconfirm
                          title={messages["nav8"]}
                          onConfirm={this.confirm}
                          okText={messages["nav9"]}
                          cancelText={messages["nav10"]}
                        >
                          <a href="#" style={{ verticalAlign: "middle" }}>
                            <span className="log-inner">
                              <FormattedMessage id="nav7" />
                            </span>
                          </a>
                        </Popconfirm>
                      )}
                    </div>
                  )}
                  {!ifLogined() && (
                    <Link href={{ pathname: "/sign" }}>
                      <a>
                        <sapn
                          className="log-inner"
                          title={<FormattedMessage id="nav4" />}
                        >
                          <FormattedMessage id="nav4" />
                        </sapn>
                      </a>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
          {
            <div className="nav-lan">
              <Select
                dropdownStyle={{ zIndex: "9999999" }}
                value={language}
                onChange={this.lanChange}
              >
                <Option value="zh">中文</Option>
                <Option value="en">English</Option>
                <Option value="id">
                  <div className="nav-lan-item">indonesia</div>
                </Option>
              </Select>
            </div>
          }
        </div>
        {!isMobile && (
          <div className="log">
            {ifLogined() && (
              <Popconfirm
                title={messages["nav8"]}
                onConfirm={this.confirm}
                okText={messages["nav9"]}
                cancelText={messages["nav10"]}
              >
                <a href="#" style={{ verticalAlign: "middle" }}>
                  <span className="log-inner">
                    <FormattedMessage id="nav7" />
                    {/* {!isMobile && <FormattedMessage id="nav5" />} */}
                  </span>
                </a>
              </Popconfirm>
            )}
            {!ifLogined() && (
              <Button size={size} type="danger" ghost>
                <Link href={{ pathname: "/sign" }}>
                  <a>
                    <sapn
                      className="log-inner"
                      title={<FormattedMessage id="nav4" />}
                    >
                      <FormattedMessage id="nav4" />
                    </sapn>
                  </a>
                </Link>
              </Button>
            )}

            {/* <span className="spacing-x" /> */}
            {/* {!ifLogined() && (
  <Button size={size}>
    <Link href={{ pathname: "/sign" }}>
      <a>
        <sapn className="log-inner">
          <FormattedMessage id="nav4" />
        </sapn>
      </a>
    </Link>
  </Button>
)} */}
          </div>
        )}
      </nav>
    );
  }
}

export default connect(state => state)(injectIntl(Nav));

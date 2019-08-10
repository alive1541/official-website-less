import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import Link from "next/link";
import { Radio, Table, Button, message, Modal, Checkbox, Icon } from "antd";
import { getHistoryData, activeVip } from "../service";
import { ifLogined } from "../assets/utils";
import { getCookie } from "../assets/utils";

import "../style/myBackstage.less";

export default class Service extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
    if (isMobile) {
      initReactFastclick();
    }
    return { isMobile };
  }

  constructor(props) {
    super(props);
    this.state = {
      userState: 1,
      //atTime 未过期 ， overTime 过期  null 新用户
      expireDate: null
    };
  }

  componentDidMount() {
    this.checkStorage();
  }

  checkStorage() {
    try {
      const expireDate = JSON.parse(localStorage.getItem("expireDate"));
      if (expireDate && expireDate.type === "atTime") {
        this.refGo();
      }
      this.setState({ expireDate: expireDate });
    } catch (e) {
      message.error("JSON解析出错");
    }
  }

  refGo() {
    location.href = `http://123.56.11.198:8990/#/page/account?token=${getCookie()}`;
  }

  render() {
    const { isMobile } = this.props;
    const { expireDate } = this.state;
    const logined = ifLogined();
    return (
      <div>
        <Head />
        <Nav isMobile={isMobile} pathName="myBackStage" />
        <div className="backstage-wraper">
          {!logined && (
            <div className="backstage-info">
              您还没有登录，不能查看此页面，请点击登录，若您还没有账号，请点击注册按钮注册。
              <Button className="backstage-btn" type="primary">
                <Link href={{ pathname: "/login" }}>登陆</Link>
              </Button>
              <Button className="backstage-btn" type="primary">
                <Link href={{ pathname: "/sign" }}>注册</Link>
              </Button>
            </div>
          )}
          {logined && (
            <div className="backstage-flex">
              <div className="backstage-img">
                <img src="/static/img/phone.png" />
              </div>
              {expireDate === null && (
                <div className="backStage-phone-content">
                  <p className="backStage-phone-title">
                    新用户您好，您当前还不是会员，点击购买按钮成为会员，新用户首期0元哟
                  </p>
                  <div className="backstage-product-info">
                    <div className="backstage-product-info-item">
                      <p className="backstage-product-info-money">1个月起定</p>
                      <p className="backstage-product-info-money">89元/月</p>
                      <div className="backstage-product-info-try">
                        首月试用仅需0元
                      </div>
                      <Button type="primary">
                        <a href="/index#target">点击咨询</a>
                      </Button>
                    </div>
                    <div className="backstage-product-info-item">
                      <p className="backstage-product-info-money">12个月起定</p>
                      <p className="backstage-product-info-money">50元/月</p>
                      <div className="backstage-product-info-try">
                        首月试用仅需0元
                      </div>
                      <Button type="primary">
                        <a href="/index#target">点击咨询</a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {expireDate && expireDate.type === "overTime" && (
                <div className="backStage-phone-content">
                  <div className="backstage-product-info">
                    <div className="backstage-product-info-item-2">
                      <p className="backstage-product-info-money">1个月起定</p>
                      <p className="backstage-product-info-money">89元/月</p>
                      <div
                        className="backstage-product-info-try"
                        style={{ fontSize: "13px" }}
                      >
                        您的会员已于{expireDate.date}到期 您可以点击继续续费
                      </div>
                      <Button type="primary">
                        <a href="/index#target">点击续费</a>
                      </Button>
                    </div>
                    <div className="backstage-product-info-item-2">
                      <p className="backstage-product-info-money">12个月起定</p>
                      <p className="backstage-product-info-money">50元/月</p>
                      <div
                        className="backstage-product-info-try"
                        style={{ fontSize: "13px" }}
                      >
                        您的会员已于{expireDate.date}到期 您可以点击继续续费
                      </div>
                      <Button type="primary">
                        <a href="/index#target">点击续费</a>
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

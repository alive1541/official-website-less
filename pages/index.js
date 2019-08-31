import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import { Carousel, Button, Modal, message } from "antd";
import Link from "next/link";
import { activeVip, getUserInfo, websiteBalance } from "../service";
import {
  getCookie,
  setCookie,
  ifLogined,
  getLanguageFromStorage
} from "../assets/utils";
import Router from "next/router";
import intl from "../components/intl";
import { FormattedMessage } from "react-intl";
import root from "../components/root";
import qs from "qs";

import "../style/index.less";

class Index extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
    if (isMobile) {
      initReactFastclick();
    }
    return { isMobile };
  }

  href = `http://123.56.11.198:8990/#/page/getMoney?token=${getCookie()}&language=${getLanguageFromStorage()}&isNewUser=true`;

  state = {
    purchaseVisible: false,
    timerNum: 10,
    expireDate: null
  };

  componentDidMount() {
    this.handleTokenFromXXBussiness();
    if (ifLogined()) {
      this.getUserInfo();
    }
  }

  handleTokenFromXXBussiness() {
    const { token } = qs.parse(window.location.search.slice(1));
    // console.log(11, qs.parse(window.location.search));
    if (token) {
      setCookie(token);
    }
  }

  getUserInfo = async () => {
    const result = await getUserInfo();
    if (result.code === 2000) {
      this.handleDate(result.data.expire_date);
    } else {
      message.info(result.msg);
    }
  };

  getWebsiteBalance = async () => {
    const result = await websiteBalance();
    if (result.errorCode === 0) {
      const data = result.data;
      //data没有数据说明这个用户没有注册过网站，这类用户是新用户
      if (data.length === 0) {
        localStorage.setItem("isNewUser", "true");
      } else {
        localStorage.setItem("isNewUser", "false");
      }
    } else {
      message.info(result.msg);
    }
  };

  handleDate(date) {
    if (date) {
      const dateBar = new Date() - new Date(date);
      if (dateBar > 0) {
        const expireDate = { type: "overTime", date };
        this.setStorage(expireDate);
        this.setState({ expireDate });
      } else {
        const expireDate = {
          type: "atTime",
          date: Math.floor(-Number(dateBar) / 1000 / 60 / 60 / 24)
        };
        this.setStorage(expireDate);
        this.setState({
          expireDate
        });
        //如果是会员没到期，请求额外信息
        this.getWebsiteBalance();
      }
    } else {
      this.setState({ expireDate: null });
    }
  }

  setStorage(expireDate) {
    localStorage.setItem("expireDate", JSON.stringify(expireDate));
  }

  purchase = () => {
    if (ifLogined()) {
      activeVip()
        .then(response => {
          if (response.code === 2000) {
            this.setState({ purchaseVisible: true });
            this.setTimer();
          } else {
            message.error(response.msg);
          }
        })
        .catch(e => {
          message.error(e);
        });
    } else {
      Router.push({
        pathname: "/login",
        query: { ifFromIndexPage: "true" }
      });
    }
  };

  setTimer = () => {
    const { timerNum } = this.state;
    if (timerNum <= 0) {
      return (window.location.href = this.href);
    }
    setTimeout(() => {
      this.setState({ timerNum: timerNum - 1 });
      this.setTimer();
    }, 1000);
  };

  render() {
    const { isMobile } = this.props;
    const { purchaseVisible, timerNum, expireDate } = this.state;
    return (
      <div>
        <Head title="体育套利" />
        <Nav isMobile={isMobile} pathName="index" />
        <div className="index-wraper">
          <h1>
            <FormattedMessage id="title1" />
          </h1>
          <p className="content">
            <FormattedMessage id="content1_1" />
          </p>
          <p className="content">
            <FormattedMessage id="content1_2" />
          </p>
          <p className="content">
            <FormattedMessage id="content1_3" />
          </p>
          <p className="content">
            <FormattedMessage id="content1_4" />
          </p>
          <h1>
            <FormattedMessage id="title2" />
          </h1>
          <p className="content">
            <FormattedMessage id="content2_1" />
            <Link href={{ pathname: "/subscribe" }}>
              <a>
                <u>
                  <FormattedMessage id="content2_2" />
                </u>
              </a>
            </Link>
            <span>
              <FormattedMessage id="content2_3" />
            </span>
          </p>

          <h1>
            <FormattedMessage id="title3" />
          </h1>
          <p className="content">
            <FormattedMessage id="content3_1" />
          </p>

          <h1>
            <FormattedMessage id="title4" />
          </h1>
          <div className="content">
            <div className="index-phone-content">
              <p>
                <FormattedMessage id="content4_1" />
              </p>
              <p>
                <FormattedMessage id="content4_2" />
              </p>
              <p>
                <FormattedMessage id="content4_3" />
              </p>
              <p>
                <FormattedMessage id="content4_4" />
              </p>
            </div>
            <div className="index-phone-img">
              <img src="/static/img/phone.png" />
            </div>
          </div>

          <h1>
            <FormattedMessage id="title5" />
          </h1>
          <div className="content">
            {!isMobile && (
              <div>
                <Carousel autoplay>
                  <div>
                    <div className="index-carousel">
                      <div className="index-carousel-content">
                        <FormattedMessage id="content5_1" />
                        <br />
                        <FormattedMessage id="content5_2" />
                      </div>
                      <div className="index-carousel-img-wraper">
                        <img src="/static/img/line-chart1.png" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="index-carousel">
                      <div className="index-carousel-content">
                        <FormattedMessage id="content5_3" />
                        <br />
                        <FormattedMessage id="content5_4" />
                      </div>
                      <div className="index-carousel-img-wraper">
                        <img src="/static/img/line-chart2.png" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="index-carousel">
                      <div className="index-carousel-content">
                        <FormattedMessage id="content5_5" />
                        <br />
                        <FormattedMessage id="content5_6" />
                      </div>
                      <div className="index-carousel-img-wraper">
                        <img src="/static/img/line-chart2.png" />
                      </div>
                    </div>
                  </div>
                </Carousel>
              </div>
            )}
            {isMobile && (
              <div className="index-carousel-wraper">
                <div>
                  <div className="index-carousel">
                    <div className="index-carousel-content">
                      <FormattedMessage id="content5_1" />
                      <br />
                      <FormattedMessage id="content5_2" />
                    </div>
                    <div className="index-carousel-img-wraper">
                      <img src="/static/img/line-chart1.png" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="index-carousel">
                    <div className="index-carousel-content">
                      <FormattedMessage id="content5_3" />
                      <br />
                      <FormattedMessage id="content5_4" />
                    </div>
                    <div className="index-carousel-img-wraper">
                      <img src="/static/img/line-chart2.png" />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="index-carousel">
                    <div className="index-carousel-content">
                      <FormattedMessage id="content5_5" />
                      <br />
                      <FormattedMessage id="content5_6" />
                    </div>
                    <div className="index-carousel-img-wraper">
                      <img src="/static/img/line-chart2.png" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <h1 id="target-id">
            <FormattedMessage id="title6" />
          </h1>
          {expireDate === null && (
            <p className="content">
              <FormattedMessage id="content6_1" />
            </p>
          )}

          <div className="content">
            <div className="index-product-info">
              <div className="index-product-info-item">
                <p className="index-product-info-money">
                  <FormattedMessage id="content6_2" />
                </p>
                <p className="index-product-info-money">
                  <FormattedMessage id="content6_3" />
                </p>
                <Info expireDate={expireDate} ctx={this} />
              </div>
              {/* <div className="index-product-info-item">
                <p className="index-product-info-money"><FormattedMessage id="content6_5" /></p>
                <p className="index-product-info-money"><FormattedMessage id="content6_6" /></p>
                <Info expireDate={expireDate} ctx={this} />
              </div> */}
            </div>
          </div>
        </div>
        {
          <Modal visible={purchaseVisible} closable={false} footer={false}>
            <div className="index-modal">
              <p className="index-modal-title">
                <FormattedMessage id="content6_12" />
                <br />
                <FormattedMessage id="content6_13" />
                {expireDate && expireDate.date}
              </p>
              <p className="index-modal-content">
                <FormattedMessage id="content6_14" />
                {timerNum}
                <FormattedMessage id="content6_15" />
              </p>
              <a href={this.href}>
                <FormattedMessage id="content6_16" />
              </a>
            </div>
          </Modal>
        }
        <Footer />
      </div>
    );
  }
}

function Info(props) {
  const { expireDate, ctx } = props;
  return (
    <>
      {expireDate === null && (
        <div className="index-product-info-try">
          <FormattedMessage id="content6_4" />
        </div>
      )}
      {expireDate && expireDate.type === "atTime" && (
        <div style={{ color: "black", fontWeight: 600 }}>
          <FormattedMessage id="content6_8" />
          {expireDate.date}
          <FormattedMessage id="content6_9" />{" "}
          <FormattedMessage id="content6_10" />
        </div>
      )}
      {expireDate && expireDate.type === "overTime" && (
        <div style={{ color: "black", fontWeight: 600 }}>
          <FormattedMessage id="content6_7" />
          {expireDate.date}
          <FormattedMessage id="content6_10" />
        </div>
      )}
      {expireDate === null && (
        <Button type="primary" onClick={ctx.purchase}>
          <FormattedMessage id="content6_11" />
        </Button>
      )}
      {expireDate && (
        <Button type="primary">
          <FormattedMessage id="content6_10" />
        </Button>
      )}
    </>
  );
}

export default root(intl(Index));

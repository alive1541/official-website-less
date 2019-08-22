import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import { Carousel, Button, Modal, message } from "antd";
import Link from "next/link";
import { activeVip, getUserInfo } from "../service";
import { getCookie, ifLogined, getLanguageFromStorage } from "../assets/utils";
import Router from "next/router";
import intl from "../components/intl";
import { FormattedMessage } from "react-intl";
import root from "../components/root";

import "../style/index.less";

class Home extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
    if (isMobile) {
      initReactFastclick();
    }
    return { isMobile };
  }

  href = `http://123.56.11.198:8990/#/page/account?token=${getCookie()}&language=${getLanguageFromStorage()}`;

  state = {
    purchaseVisible: false,
    timerNum: 10,
    expireDate: null
  };

  componentDidMount() {
    console.log("href", this.href);
    if (ifLogined()) {
      this.getUserInfo();
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

  handleDate(date) {
    console.log("date", date);
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
        pathname: "/login"
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
            <p className="content">
              <FormattedMessage id="content2_3" />
            </p>
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
          <h1 id="target">
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
      <Button type="primary" onClick={ctx.purchase}>
        {expireDate === null && <FormattedMessage id="content6_11" />}
        {expireDate && <FormattedMessage id="content6_10" />}
      </Button>
    </>
  );
}

export default root(intl(Home));

import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import initReactFastclick from "react-fastclick";
import { Carousel, Modal, message } from "antd";
import { activeVip, getUserInfo, websiteBalance } from "../service";
import {
  getCookie,
  setCookie,
  ifLogined,
  getLanguageFromStorage
} from "../assets/utils";
import Router from "next/router";
import intl from "../components/intl";
import { FormattedMessage, injectIntl } from "react-intl";
import root from "../components/root";
import qs from "qs";
import { commonPoint } from "../assets/buryingPoint";
import getConfig from "next/config";
import SignCom from "../components/inner-component/signCom";
const {
  publicRuntimeConfig: { cdnPath }
} = getConfig();

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
    timerNum: 5,
    expireDate: null,
    //未登陆用户弹出注册modal
    signModalVisible: true
  };

  componentDidMount() {
    this.handleUrlParams();
    this.setExpireDate();
    if (ifLogined()) {
      this.getUserInfo();
    }
    commonPoint("common", "首页pv");
  }

  setExpireDate() {
    try {
      const expireDate = JSON.parse(localStorage.getItem("expireDate"));
      this.setState({ expireDate });
    } catch (e) {
      console.log("--e--", e);
      // message.error("JSON解析出错");
    }
  }

  handleUrlParams() {
    const { token, channel } = qs.parse(window.location.search.slice(1));
    // console.log(11, qs.parse(window.location.search));
    if (token) {
      setCookie(token);
    }
    this.handleChannelId(channel);
  }

  handleChannelId(channelId) {
    try {
      if (channelId) {
        this.props.dispatch({ type: "CHANGE_CHANNEL_ID", value: channelId });
        // localStorage.setItem("channelId", channelId);
      } else {
        // localStorage.removeItem("channelId");
      }
    } catch (e) {
      console.log(e);
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
    setTimeout(() => {
      commonPoint("click", "立即获取按钮", "purchase-button");
    }, 0);
    if (ifLogined()) {
      activeVip()
        .then(response => {
          if (response.code === 2000) {
            this.setState({ purchaseVisible2: true });
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
        pathname: "/sign",
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

  closeSignModal = () => {
    this.setState({ signModalVisible: false });
  };

  render() {
    const {
      isMobile,
      intl,
      intl: { messages }
    } = this.props;

    const {
      purchaseVisible,
      purchaseVisible2,
      signModalVisible,
      expireDate
    } = this.state;
    return (
      <div>
        <Head title="体育套利" />
        <Nav isMobile={isMobile} pathName="index" />
        <div className="index-wraper">
          <Info isMobile={isMobile} intl={intl} />
          <h1>
            <FormattedMessage id="title1" />
          </h1>
          <p className="content">
            <FormattedMessage id="content1_1" />
          </p>
          <p className="content">
            <FormattedMessage id="content1_2" />
          </p>
          <h1>
            <FormattedMessage id="title2" />
          </h1>
          <p className="content">
            <FormattedMessage id="content2_1" />
            {/* <Link href={{ pathname: "/subscribe" }}>
              <a>
                <u>
                  <FormattedMessage id="content2_2" />
                </u>
              </a>
            </Link> */}
          </p>
          <p className="content">
            <FormattedMessage id="content2_3" />
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
              <p>
                <FormattedMessage id="content4_5" />
              </p>
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
                        <img src={`${cdnPath}/static/img/line-chart1.png`} />
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
                        <img src={`${cdnPath}/static/img/line-chart2.png`} />
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
                        <img src={`${cdnPath}/static/img/line-chart2.png`} />
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
                      <img src={`${cdnPath}/static/img/line-chart1.png`} />
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
                      <img src={`${cdnPath}/static/img/line-chart2.png`} />
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
                      <img src={`${cdnPath}/static/img/line-chart2.png`} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Footer ctx={this} expireDate={expireDate} messages={messages} />
        </div>
        {
          <Modal
            visible={purchaseVisible2}
            footer={false}
            onCancel={() => this.setState({ purchaseVisible2: false })}
          >
            <p className="index-purcharse-success-title">
              <FormattedMessage id="title77" />
            </p>
            <p className="index-purcharse-success-content">
              <FormattedMessage id="content77_1" />
            </p>
          </Modal>
        }
        {/*purchaseVisible暂时隐藏*/}
        {
          <Modal visible={purchaseVisible} closable={false} footer={false}>
            <div className="index-modal">
              <p className="index-modal-title">
                <FormattedMessage id="content6_12" />
              </p>
              <p className="index-modal-content">
                <FormattedMessage id="content6_13" />
                {expireDate && expireDate.date}
                <br />
                <FormattedMessage id="content6_14" />
              </p>
            </div>
          </Modal>
        }
        {/*未登录用户注册*/}
        {!ifLogined() && (
          <Modal
            visible={signModalVisible}
            footer={false}
            onCancel={this.closeSignModal}
          >
            <SignCom title={<SignTitle intl={intl} />} />
          </Modal>
        )}
      </div>
    );
  }
}

function SignTitle(props) {
  const {
    intl: { locale }
  } = props;
  switch (locale) {
    case "en":
      return (
        <>
          <div className="sign-title-base">100 yuan cash upon registration</div>
        </>
      );
    case "zh":
      return (
        <>
          <span className="sign-title-base">注册即得现金</span>
          <span className="sign-title-big">100元</span>
        </>
      );
    case "id":
      return (
        <>
          <div className="sign-title-base">Dapatkan hadiah uang sebesar</div>
          <div className="sign-title-big">Rp. 200.000,00</div>
          <div className="sign-title-base">setelah registrasi</div>
        </>
      );
    default:
      return "title";
  }
}

function Footer(props) {
  const { expireDate, ctx, messages } = props;
  function rePay() {
    setTimeout(() => {
      commonPoint("click", "点击续费按钮", "repay-button");
    }, 0);
    message.info(messages["content6_10"]);
  }
  return (
    <>
      {expireDate === null && (
        <div className="index-footer" onClick={ctx.purchase}>
          <div className="index-info">
            <div className="index-top">
              <FormattedMessage id="content6_2" />
            </div>
            <div className="index-bottom">
              <FormattedMessage id="content6_3" />
            </div>
          </div>
          <div className="index-button">
            <FormattedMessage id="content6_4" />
          </div>
        </div>
      )}
      {expireDate && expireDate.type === "atTime" && (
        <div className="index-footer" onClick={rePay}>
          <div className="index-info">
            <div className="index-top">
              <FormattedMessage id="content6_5" />
            </div>
            <div className="index-bottom">
              <FormattedMessage id="content6_6" />
              {expireDate.date}
              <FormattedMessage id="content6_7" />
            </div>
          </div>
          <div className="index-button">
            <FormattedMessage id="content6_8" />
          </div>
        </div>
      )}
      {expireDate && expireDate.type === "overTime" && (
        <div className="index-footer" onClick={rePay}>
          <div className="index-info">
            <div className="index-top">
              <FormattedMessage id="content6_5" />
            </div>
            <div className="index-bottom">
              <FormattedMessage id="content6_6" />
              {expireDate.date}
              <FormattedMessage id="content6_7" />
            </div>
          </div>
          <div className="index-button">
            <FormattedMessage id="content6_8" />
          </div>
        </div>
      )}
    </>
  );
}

function Info(props) {
  const {
    isMobile,
    intl: { locale }
  } = props;
  console.log(1111, props);
  function isId() {
    return locale === "id";
  }
  function isZh() {
    return locale === "zh";
  }
  const bigSize = { fontSize: 30 };

  return (
    <>
      {!isMobile && (
        <>
          <br />
          <br />
          <br />
        </>
      )}
      <h1>
        <FormattedMessage id="info1_1" />
      </h1>

      {isId() ? (
        <h1>
          <FormattedMessage id="info1_2" />
          <span style={bigSize}>Rp.200.000</span>
        </h1>
      ) : (
        <h1 style={bigSize}>
          <FormattedMessage id="info1_2" />
        </h1>
      )}
      <h1>
        <FormattedMessage id="info1_3" />
      </h1>
      <h1>
        <FormattedMessage id="info1_4" />
        {isZh() && (
          <>
            <span style={bigSize}>100</span>
            <span>元</span>
          </>
        )}
      </h1>
      <h1>
        <FormattedMessage id="info1_5" />
      </h1>
      <h1>
        <FormattedMessage id="info1_6" />
      </h1>
      <br />
      <br />
      <br />
    </>
  );
}

export default root(intl(injectIntl(Index)));

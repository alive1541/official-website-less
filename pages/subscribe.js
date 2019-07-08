import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import Interest from "../components/calculator/interest";
import initReactFastclick from "react-fastclick";
import { Radio, Table, Button, message, Modal, Checkbox, Icon } from "antd";
import {
  getHistoryData,
  getCurrentData,
  changeFocusChance,
  changeFocusWebsite,
  getFocusList,
  realtimeGameInfoList
} from "../service";
import { ifLogined, setTableKey } from "../assets/utils";
import Router from "next/router";

import "../style/subscribe.less";

export default class Service extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(userAgent);
    if (isMobile) {
      initReactFastclick();
    }
    try {
      const historyData = await getHistoryData({ page_no: 1 });
      if (historyData.code === 2000) {
        return { isMobile, historyData: setTableKey(historyData.data) };
      } else {
        return { isMobile, historyData: [] };
      }
    } catch (e) {
      console.log("e==", e);
      return { isMobile, historyData: [] };
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      mode: "history",
      data: props.historyData.list,
      total: props.historyData.total_num,
      webFilterVisible: false,
      webSitesAll: [],
      webSitesSelected: [],
      interestData: []
    };
  }

  componentDidMount() {
    const hash = window.location.hash;
    if (hash === "#current") {
      this.setState({ mode: "current" });
      this.setCurrentInterval();
      ifLogined() && this.setInterestInterval();
    }
  }

  keepActiveChange = checked => {
    if (checked) {
      this.setInterestInterval();
    } else {
      this.clearInterestTimer();
    }
  };

  async setInterestInterval() {
    this.getInterestData();
    window.interestTimer = window.setInterval(
      () => this.getInterestData(),
      5 * 1000
    );
  }

  async getInterestData() {
    try {
      const response = await realtimeGameInfoList();
      if (response.code === 2000) {
        this.setState({ interestData: response.data });
      } else {
        message.error(response.msg);
      }
    } catch (e) {
      console.log(e);
    }
  }

  setHash = curHash => {
    const url = window.location.href.replace(/#[\S\s]*$/g, "");
    window.location.href = url + curHash;
  };

  handleModeChange = e => {
    this.clearAllInterval();
    const mode = e.target.value;
    if (mode === "current") {
      this.setHash("#current");
      this.setCurrentInterval();
      this.setCurrentInterval();
    } else if (mode == "history") {
      this.setHash("#history");
      this.getHistoryData();
    }
    this.setState({ data: [], mode });
  };

  caculateClick = () => {
    Router.push({
      pathname: "/calculator"
    });
  };

  async webFilterClick() {
    getFocusList().then(response => {
      if (response.code === 2000) {
        const data = response.data;
        this.setState({
          webSitesAll: data.map(v => {
            return { label: v.website_name, value: v.website_code };
          }),
          webSitesSelected: data.map(v => {
            if (v.is_focus === true) {
              return v.website_code;
            }
          })
        });
      } else {
        message.error("获取网站失败");
      }
    });
    this.setState({ webFilterVisible: true });
  }

  clearAllInterval = () => {
    this.clearTimer();
    this.clearInterestTimer();
  };

  clearTimer = () => {
    window.clearInterval(window.timer);
  };

  clearInterestTimer = () => {
    window.clearInterval(window.interestTimer);
  };

  setCurrentInterval = () => {
    this.getCurrentData();
    window.timer = setInterval(() => {
      this.getCurrentData();
    }, 60 * 1000);
  };

  getCurrentData = () => {
    const _this = this;
    getCurrentData()
      .then(function(response) {
        if (response.code === 2000) {
          _this.setState({ data: setTableKey(response.data) });
        } else {
          message.info(response.msg);
        }
      })
      .catch(function(error) {
        console.log(error);
        message.error("服务器开小差了，请稍后再试");
      });
  };

  getHistoryData = (page_no = 1) => {
    const _this = this;
    getHistoryData({
      page_no
    })
      .then(function(response) {
        if (response.code === 2000) {
          _this.setState({
            total: response.data.total_num,
            data: setTableKey(response.data).list
          });
        } else {
          message.info(response.msg);
        }
      })
      .catch(function(error) {
        console.log(error);
        message.error("服务器开小差了，请稍后再试");
      });
  };

  pageChange = val => {
    const { current, total } = val;
    this.setState({ total });
    this.getHistoryData(current);
  };

  handleWebFilterOk = () => {
    this.setState({ webFilterVisible: false });
  };

  handleWebFilterCancel = () => {
    this.setState({ webFilterVisible: false });
  };

  webFilterChange = checkedValue => {
    this.setState({ webSitesSelected: checkedValue });
  };

  addHandlerToColumns = () => {
    if (columns[columns.length - 1].key === "expected_min_profit") {
      columns.push({
        title: "操作",
        // dataIndex: "second_obbs",
        // key: "second_obbs",
        render: (text, row, index) => {
          return (
            <div>
              <Icon
                type="calculator"
                style={{ color: "red" }}
                onClick={() => this.handleClickMobile(row)}
              />{" "}
              <Icon
                style={{ color: "red" }}
                type="plus"
                onClick={() => this.handleClickAdd(row)}
              />
            </div>
          );
        }
      });
    }
  };

  handleClickMobile = row => {
    const { first_obbs, second_obbs, game_time, play_type_name } = row;
    Router.push({
      pathname: "/calculator",
      query: {
        first_obbs,
        second_obbs,
        game_time,
        play_type_name
      }
    });
  };

  handleClickAdd = async row => {
    const ifSuccess = await this.changeFocusChanceInterface(row, 0);
    if (ifSuccess) {
      this.getInterestData();
    }
  };

  changeFocusChanceInterface = async (row, operation) => {
    const { chance_id, game_time } = row;
    try {
      let response = await changeFocusChance({
        operation,
        chance_id,
        game_time
      });
      if (response.code === 2000) {
        message.info(response.msg);
        return true;
      } else {
        message.error(response.msg);
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  };

  async sentWebsite() {
    const { webSitesSelected } = this.state;
    try {
      let response = await changeFocusWebsite({
        website_list_str: webSitesSelected.join("::")
      });
      if (response.code === 2000) {
        message.info(response.msg);
        this.handleWebFilterCancel();
      } else {
        message.error(response.msg);
      }
    } catch (e) {
      console.log(e);
    }
  }

  deleteInterestItem = async item => {
    console.log("item", item);
    const ifSuccess = await this.changeFocusChanceInterface(item, 1);
    if (ifSuccess) {
      this.getInterestData();
    }
  };

  modeIsCurrentAndLogined = () => {
    const { mode } = this.state;
    return mode === "current" && ifLogined();
  };

  componentWillUnmount() {
    this.clearAllInterval();
  }

  render() {
    const { isMobile } = this.props;
    const {
      mode,
      data,
      total,
      webFilterVisible,
      webSitesAll,
      webSitesSelected,
      interestData
    } = this.state;
    const ifHasBorder = isMobile ? true : false;
    let style = {};
    let ifHasInterest;
    if (this.modeIsCurrentAndLogined()) {
      style = { maxWidth: "55%" };
      ifHasInterest = true;
      this.addHandlerToColumns();
    }
    return (
      <div>
        <Head />
        <Nav isMobile={isMobile} pathName="subscribe" />

        <div className="subscribe-wraper" style={style}>
          <div className="subscribe-tab">
            <Radio.Group
              onChange={this.handleModeChange}
              value={mode}
              style={{ marginBottom: 8 }}
            >
              <Radio.Button value="history">历史套利机会</Radio.Button>
              <Radio.Button value="current">实时套利机会</Radio.Button>
            </Radio.Group>{" "}
            {!isMobile && (
              <Button
                shape="round"
                icon="calculator"
                type="link"
                onClick={this.caculateClick}
              >
                计算器
              </Button>
            )}{" "}
            {!isMobile && (
              <Button
                shape="round"
                icon="filter"
                type="link"
                onClick={() => this.webFilterClick()}
              >
                网站过滤器
              </Button>
            )}
          </div>
          {mode === "current" && !ifLogined() && (
            <p className="subcribe-info">
              您还没有订阅该产品，当前只能展示一个套利机会
            </p>
          )}
          {mode === "history" && (
            <Table
              bordered={ifHasBorder}
              onChange={this.pageChange}
              columns={columns}
              dataSource={data}
              pagination={{ defaultCurrent: 1, total }}
            />
          )}
          {mode === "current" && (
            <Table
              bordered={ifHasBorder}
              onChange={this.pageChange}
              columns={columns}
              dataSource={data}
              pagination={false}
            />
          )}
          {mode === "current" && !ifLogined() && (
            <p className="subcribe-info-sign">
              <span className="subscribe-info-sing-content">
                想获得更多更实时的机会吗？快点点击免费注册按钮注册吧，注册成功即可查看所有实时机会
              </span>
              <Button
                type="primary"
                onClick={() => {
                  Router.push("/sign");
                }}
              >
                免费注册
              </Button>
            </p>
          )}
        </div>
        <Footer />
        {ifHasInterest && (
          <Interest
            data={interestData}
            keepActiveChange={this.keepActiveChange}
            deleteInterestItem={this.deleteInterestItem}
          />
        )}
        <Modal
          title="网站过滤器"
          visible={webFilterVisible}
          onOk={() => this.sentWebsite()}
          onCancel={this.handleWebFilterCancel}
        >
          <Checkbox.Group
            options={webSitesAll}
            value={webSitesSelected}
            onChange={this.webFilterChange}
          />
        </Modal>
      </div>
    );
  }
}

const columns = [
  {
    title: "机会",
    dataIndex: "oppertunity",
    key: "oppertunity",
    render: (text, row, index) => {
      const { game_time, game_teams } = row;
      return (
        <div>
          <div>{game_time}</div>
          <div>{game_teams}</div>
        </div>
      );
    }
  },
  {
    title: "网站1",
    dataIndex: "first_website",
    key: "first_website"
  },
  {
    title: "方向",
    dataIndex: "fangxiang",
    key: "fangxiang",
    render: (text, row, index) => {
      const { first_choice, play_type } = row;
      let book = {};
      if (play_type == 2) {
        book = {
          left: "大",
          right: "小"
        };
      } else {
        book = {
          left: "主",
          right: "客"
        };
      }
      return <div>{book[first_choice]}</div>;
    }
  },
  {
    title: "建议购买金额(赔率)",
    dataIndex: "first_amount",
    key: "first_amount",
    render: (text, row, index) => {
      const { first_amount, first_obbs } = row;
      return (
        <div>
          <div>{first_amount}</div>
          <div>{`(${first_obbs})`}</div>
        </div>
      );
    }
  },
  {
    title: "网站2",
    dataIndex: "second_website",
    key: "second_website"
  },
  {
    title: "方向",
    dataIndex: "second_choice",
    key: "second_choice",
    render: (text, row, index) => {
      const { second_choice, play_type } = row;
      let book = {};
      if (play_type == 2) {
        book = {
          left: "大",
          right: "小"
        };
      } else {
        book = {
          left: "主",
          right: "客"
        };
      }
      return <div>{book[second_choice]}</div>;
    }
  },
  {
    title: "建议购买金额(赔率)",
    dataIndex: "second_obbs",
    key: "second_obbs",
    render: (text, row, index) => {
      const { second_amount, second_obbs } = row;
      return (
        <div>
          <div>{second_amount}</div>
          <div>{`(${second_obbs})`}</div>
        </div>
      );
    }
  },
  {
    title: "预计最小收益",
    dataIndex: "expected_min_profit",
    key: "expected_min_profit"
  }
];

import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import Interest from "../components/calculator/interest";
import initReactFastclick from "react-fastclick";
import { Radio, Table, Button, message, Modal, Checkbox, Icon } from "antd";
import { getHistoryData, getCurrentData } from "../service";
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
      webFilterVisible: false
    };
  }

  componentDidMount() {
    const hash = window.location.hash;
    if (hash === "#current") {
      this.setState({ mode: "current" });
      this.setCurrentInterval();
    }
  }

  setHash = curHash => {
    const url = window.location.href.replace(/#[\S\s]*$/g, "");
    window.location.href = url + curHash;
  };

  handleModeChange = e => {
    this.clearInterval();
    const mode = e.target.value;
    if (mode === "current") {
      this.setHash("#current");
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

  webFilterClick = () => {
    this.setState({ webFilterVisible: true });
  };

  clearInterval = () => {
    window.clearInterval(window.timer);
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
    console.log(111, checkedValue);
  };

  handleWebsiteData = () => {
    const options = [];
    const values = [];
    testWebData.forEach(item => {
      if (item.is_focus) {
        values.push(item.website_code);
      }
      options.push({
        label: item.website_name,
        value: item.website_code
      });
    });
    console.log("values", values);
    return { options, values };
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
                onClick={() => this.handleClickMobile()}
              />
              <Icon
                style={{ color: "red" }}
                type="plus"
                onClick={() => handleClickAdd(index)}
              />
            </div>
          );
        }
      });
    }
  };

  componentWillUnmount() {
    this.clearInterval();
  }

  render() {
    const { isMobile } = this.props;
    const { mode, data, total, webFilterVisible } = this.state;
    const ifHasBorder = isMobile ? true : false;
    const { options, values } = this.handleWebsiteData();
    let style = {};
    let ifHasInterest;
    if (mode === "current" && ifLogined()) {
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
                onClick={this.webFilterClick}
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
        {ifHasInterest && <Interest data={testData} />}
        <Modal
          title="网站过滤器"
          visible={webFilterVisible}
          onOk={this.handleWebFilterOk}
          onCancel={this.handleWebFilterCancel}
        >
          <Checkbox.Group
            options={options}
            defaultValue={values}
            onChange={this.webFilterChange}
          />
        </Modal>
      </div>
    );
  }
}

const testWebData = [
  { website_code: "betWay", website_name: "必威", is_focus: true },
  { website_code: "liji", website_name: "liji", is_focus: false }
];

const testData = [
  {
    chance_id: "q",
    game_time: "20190501 23:40",
    host_name: "A队",
    custom_name: "客队",
    first_website: "betway",
    first_obbs: 1.5,
    first_amount: 1000,
    first_plate_name: "主让0.5",
    first_profit: 20,
    first_website_name: "必威1",
    first_place_bet_url: "http://www.xxx.com",
    first_win_return: 123.0,
    second_website: "liji",
    second_choice: "left",
    second_obbs: 1.1,
    second_amount: 1000,
    second_plate_name: "客负0.5",
    second_profit: 25,
    second_website_name: "立即",
    second_place_bet_url: "http://www/xxy.com",
    second_win_return: 123,
    play_type_name: "全场",
    min_profit: 800,
    max_profit: 1000,
    last_update_time: "23:45:12",
    total_amount: 222,
    profit_rate: 0.207,
    game_name: "世界杯",
    game_type_name: "全场"
  },
  {
    chance_id: "q",
    game_time: "20190501 23:40",
    host_name: "A队",
    custom_name: "客队",
    first_website: "betway",
    first_obbs: 1.5,
    first_amount: 1000,
    first_plate_name: "主让0.5",
    first_profit: 20,
    first_website_name: "必威2",
    first_place_bet_url: "http://www.xxx.com",
    first_win_return: 123.0,
    second_website: "liji",
    second_choice: "left",
    second_obbs: 1.1,
    second_amount: 1000,
    second_plate_name: "客负0.5",
    second_profit: 25,
    second_website_name: "立即",
    second_place_bet_url: "http://www/xxy.com",
    second_win_return: 123,
    play_type: 0,
    min_profit: 800,
    max_profit: 1000,
    last_update_time: "23:45:12",
    total_amount: 222,
    profit_rate: 0.207,
    game_name: "世界杯",
    game_type_name: "全场"
  }
];

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

import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import initReactFastclick from "react-fastclick";
import { Radio, Table, Button } from "antd";

import "../style/subscribe.less";

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
      mode: "history"
    };
  }

  handleModeChange = e => {
    const mode = e.target.value;
    this.setState({ mode });
  };

  render() {
    const { isMobile } = this.props;
    const { mode } = this.state;
    return (
      <div>
        <Head title="Subscribe" />
        <Nav isMobile={isMobile} pathName="subscribe" />

        <div className="subscribe-wraper">
          <div className="subscribe-tab">
            <Radio.Group
              onChange={this.handleModeChange}
              value={mode}
              style={{ marginBottom: 8 }}
            >
              <Radio.Button value="history">历史套利机会</Radio.Button>
              <Radio.Button value="current">实时套利机会</Radio.Button>
            </Radio.Group>
          </div>
          {mode === "current" && (
            <p className="subcribe-info">
              您还没有订阅该产品，当前只能展示一个套利机会
            </p>
          )}
          {mode === "history" && <Table columns={columns} dataSource={data} />}
          {mode === "current" && <Table columns={columns} dataSource={data} />}
          {mode === "current" && (
            <p className="subcribe-info-sign">
              <span className="subscribe-info-sing-content">
                想获得更多更实时的机会吗？快点点击免费注册按钮注册吧，注册成功即可查看所有实时机会
              </span>
              <Button type="primary">免费注册</Button>
            </p>
          )}
        </div>
        <Footer />
      </div>
    );
  }
}

const columns = [
  {
    title: "机会",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "网站1",
    dataIndex: "age",
    key: "age"
  },
  {
    title: "方向",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "建议购买金额(赔率)",
    dataIndex: "age",
    key: "age"
  },
  {
    title: "网站2",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "方向",
    dataIndex: "age",
    key: "age"
  },
  {
    title: "建议购买金额(赔率)",
    dataIndex: "address",
    key: "address"
  },
  {
    title: "预计最小收益",
    key: "action"
  }
];

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"]
  }
  // {
  //   key: "2",
  //   name: "Jim Green",
  //   age: 42,
  //   address: "London No. 1 Lake Park",
  //   tags: ["loser"]
  // },
  // {
  //   key: "3",
  //   name: "Joe Black",
  //   age: 32,
  //   address: "Sidney No. 1 Lake Park",
  //   tags: ["cool", "teacher"]
  // }
];

import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import Footer from "../components/footer";
import { Form, Icon, Input, Button, Row, Col, message } from "antd";

import "../style/calculator.less";

class Calculator extends React.Component {
  // static async getInitialProps({ req }) {}

  state = {};

  renderTable = () => {
    return (
      <table width="100%">
        <thead>
          <tr>
            <th>下注项目</th>
            <th>赔率</th>
            <th>下单金额</th>
            <th>赢后返还</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A队</td>
            <td>
              <Input />
            </td>
            <td>
              <Input />
            </td>
            <td>0.00</td>
          </tr>
          <tr>
            <td>B队</td>
            <td>
              <Input />
            </td>
            <td>
              <Input />
            </td>
            <td>0.00</td>
          </tr>
        </tbody>
      </table>
    );
  };

  render() {
    const { isMobile } = this.props;

    return (
      <div>
        <Head />
        <Nav isMobile={isMobile} />
        <div className="calculator-wraper">
          <div className="calculator-item">
            <div className="calculator-left">
              <div className="header">打水计算器</div>
              <div className="header2">11</div>
              {this.renderTable()}
              <div className="profit">
                <span>
                  所有下注金都将取整计算 利润：0.00 到0.00 （利润0.0%)
                </span>
              </div>
              <div className="footer">
                <span>下注的本金</span>
                <Input />
                <div>
                  <Button type="danger">清空</Button>
                  <Button type="primary">计算</Button>
                </div>
              </div>
            </div>
            <div className="calculator-right">
              <div className="header">计算器使用规则</div>
              <div className="content">第一种方法</div>
              <div className="content">
                填写您想要下注的本金和所有下注项目赔率后
              </div>
              <div className="content">第二种方法</div>
              <div className="content">
                填写某个项目的下单金额和所有下注项目赔率
              </div>
            </div>
          </div>
          <div className="calculator-item" style={{ height: "340px" }}>
            <div className="calculator-left">
              <div className="header">止损计算器</div>
              {this.renderTable()}
              <div className="get-profit">
                获取利润&nbsp;&nbsp;&nbsp;
                <Input /> %
              </div>
              <div className="get-profit">
                获取的收益
                <Input />
              </div>
              <div className="profit">
                <span>
                  所有下注金都将取整计算 利润：0.00 到0.00 （利润0.0%)
                </span>
              </div>
              <div className="footer">
                <span>下注的本金</span>
                <Input />
                <div>
                  <Button type="danger">清空</Button>
                  <Button type="primary">计算</Button>
                </div>
              </div>
            </div>
            <div className="calculator-right">
              <div className="header">止损计算器使用规则</div>
              <div className="content">第一种方法</div>
              <div className="content">
                填写已下注队的赔率和下单金额及预期利润（可以是负数）（预期利润按最大损失最小收益计算）
              </div>
              <div className="content">第二种方法</div>
              <div className="content">
                填写已下注队的赔率和下单金额及获取的收益（可以是负数）（收益按最大损失最小收益计算）
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default Calculator;

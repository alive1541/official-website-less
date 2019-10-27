import React from "react";
import Head from "../components/head";
import Nav from "../components/nav";
import root from "../components/root";
import { injectIntl } from "react-intl";
import intl from "../components/intl";
import { FormattedMessage } from "react-intl";
import { commonPoint } from "../assets/buryingPoint";
import Link from "next/link";
import SignCom from "../components/inner-component/signCom";

import "../style/sign.less";

class Sign extends React.Component {
  state = {};

  componentDidMount() {
    commonPoint("common", "注册页pv");
  }

  renderFooter() {
    return (
      <>
        <FormattedMessage id="content10_4" />
        <Link href={{ pathname: "/login" }}>
          <a style={{ margin: "5px 10px" }}>
            <FormattedMessage id="content10_5" />
          </a>
        </Link>
      </>
    );
  }

  render() {
    const {
      isMobile,
      intl: { messages }
    } = this.props;

    return (
      <div>
        <Head title={messages["nav6"]} />
        <Nav isMobile={isMobile} />
        <div className="sign-title-wraper">
          <SignCom title={<Title />} footer={this.renderFooter()} />
        </div>
      </div>
    );
  }
}

function Title() {
  return (
    <>
      <FormattedMessage id="nav6" />
    </>
  );
}

const RootCom = root(intl(injectIntl(Sign)));
export default RootCom;

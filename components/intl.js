import React from "react";
import { IntlProvider, addLocaleData, injectIntl } from "react-intl";
// import zh from "react-intl/locale-data/zh";
// import en from "react-intl/locale-data/en";
import {
  chooseLocale,
  getLanguage,
  getLanguageFromStorage
} from "../assets/utils";

import { connect } from "react-redux";

class Intl extends React.Component {
  state = { defaultLang: "zh" };
  componentDidMount() {
    const defaultLang = getLanguageFromStorage() || getLanguage();
    this.setState({ defaultLang });
  }

  render() {
    const { children, language } = this.props;
    const lan = language || this.state.defaultLang;
    return (
      <IntlProvider locale={lan} messages={chooseLocale(lan)}>
        {children}
      </IntlProvider>
    );
  }
}

export default connect(state => state)(Intl);

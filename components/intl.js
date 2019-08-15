import React from "react";
import { IntlProvider, addLocaleData, injectIntl } from "react-intl";
import {
  chooseLocale,
  getLanguage,
  getLanguageFromStorage
} from "../assets/utils";
import { connect } from "react-redux";

class Intl extends React.Component {
  state = { defaultLang: "en" };
  componentDidMount() {
    const defaultLang = getLanguageFromStorage() || getLanguage();
    this.setState({ defaultLang });
  }

  render() {
    const { children, language } = this.props;
    const lan = language || this.state.defaultLang;
    // console.log("lan-----", chooseLocale(lan));
    if (Intl) {
      return (
        <IntlProvider locale={lan} messages={chooseLocale(lan)}>
          {children}
        </IntlProvider>
      );
    } else {
      return children;
    }
  }
}

export default connect(state => state)(Intl);

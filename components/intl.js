import React from "react";
import { IntlProvider, addLocaleData, injectIntl } from "react-intl";
import {
  chooseLocale,
  getLanguage,
  getLanguageFromStorage
} from "../assets/utils";
import { connect } from "react-redux";

function Intl(Com) {
  class Temp extends React.Component {
    state = { defaultLang: "" };
    componentDidMount() {
      const defaultLang = getLanguageFromStorage();
      this.setState({ defaultLang });
    }

    render() {
      const { children, language } = this.props;
      const lan = getLanguageFromStorage() || this.state.defaultLang;
      if (Intl) {
        return (
          <IntlProvider locale={lan} messages={chooseLocale(lan)}>
            <Com {...this.props} />
          </IntlProvider>
        );
      } else {
        return children;
      }
    }
  }
  return connect(state => state)(Temp);
}

// class Intl extends React.Component {
//   state = { defaultLang: "en" };
//   componentDidMount() {
//     const defaultLang = getLanguageFromStorage() || getLanguage();
//     this.setState({ defaultLang });
//   }

//   render() {
//     const { children, language } = this.props;
//     const lan = getLanguageFromStorage() || language || this.state.defaultLang;
//     if (Intl) {
//       return (
//         <IntlProvider locale={lan} messages={chooseLocale(lan)}>
//           {children}
//         </IntlProvider>
//       );
//     } else {
//       return children;
//     }
//   }
// }

// export default connect(state => state)(Intl);
export default Intl;

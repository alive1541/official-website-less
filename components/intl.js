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
    componentDidMount() {
      const defaultLang = getLanguageFromStorage();
      if (defaultLang) {
        this.props.dispatch({ type: "CHANGE_LANGUAGE", value: defaultLang });
      }
    }

    render() {
      const { language } = this.props;
      return (
        <IntlProvider locale={language} messages={chooseLocale(language)}>
          <Com {...this.props} />
        </IntlProvider>
      );
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

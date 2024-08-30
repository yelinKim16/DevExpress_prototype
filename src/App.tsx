// import "devextreme/dist/css/dx.common.css";
// import "devextreme/dist/css/dx.light.css"; // generic light 테마
// import "./themes/generated/theme.base.css";
// import "./themes/generated/theme.additional.css";
// import "devextreme/dist/css/dx.generic.custom.css";
// import 'devextreme/dist/css/dx.common.css';
// import "./themes/generated/theme.base.css";
import "./themes/generated/theme.additional.css";
import "devextreme/dist/css/dx.softblue.compact.css";
// 또는

import React, { useEffect } from "react";
import { loadMessages, locale } from "devextreme/localization";
import koMessages from "./locales/kr/ko.json";
import { HashRouter as Router } from "react-router-dom";
import "./dx-styles.scss";
import "devextreme/dist/css/dx.material.teal.light.compact.css";
import LoadPanel from "devextreme-react/load-panel";
import { NavigationProvider } from "./contexts/navigation";
import { AuthProvider, useAuth } from "./contexts/auth";
import { useScreenSizeClass } from "./utils/media-query";
import Content from "./Content";
import UnauthenticatedContent from "./UnauthenticatedContent";

function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    loadMessages(koMessages);
    locale("ko");
  }, []);

  if (loading) {
    return <LoadPanel visible={true} />;
  }

  if (user) {
    return <Content />;
  }

  return <UnauthenticatedContent />;
}

export default function Root() {
  const screenSizeClass = useScreenSizeClass();

  return (
    <Router>
      <AuthProvider>
        <NavigationProvider>
          <div className={`app ${screenSizeClass}`}>
            <App />
          </div>
        </NavigationProvider>
      </AuthProvider>
    </Router>
  );
}

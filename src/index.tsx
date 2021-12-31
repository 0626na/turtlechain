import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { QueryClientProvider, QueryClient } from "react-query";
import Router from "router";
import { ConfigProvider } from "antd";
import koKR from "antd/es/locale/ko_KR";
import "moment/locale/ko";
import "antd/dist/antd.less";
import "./i18n";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { theme } from "utils/theme";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

const GlobalStyle = createGlobalStyle`
  body {
        padding: 0;
        margin: 0;
        font-family: 'Noto Sans KR', sans-serif;
        background-color: #f0f2f5;
    };
`;

ReactDOM.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={koKR}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Router />
        </ThemeProvider>
      </ConfigProvider>
    </QueryClientProvider>
  </RecoilRoot>,
  document.getElementById("root"),
);

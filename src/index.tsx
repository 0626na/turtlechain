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
import theme from "utils/theme";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

const GlobalStyle = createGlobalStyle`
@font-face {
    font-family: "Spoqa Han Sans";
    font-weight: 300;
    src : url('${process.env.PUBLIC_URL}/assets/font/SpoqaHanSansNeo-Light.ttf')
  }
  @font-face {
    font-family: "Spoqa Han Sans";
    font-style: normal;
    font-weight: 400;
    src : url("${process.env.PUBLIC_URL}/assets/font/SpoqaHanSansNeo-Regular.ttf")
  }
  @font-face {
    font-family: "Spoqa Han Sans";
    font-weight: 450;
    src : url("${process.env.PUBLIC_URL}/assets/font/SpoqaHanSansNeo-Medium.ttf")
  }
@font-face {
    font-family: "Spoqa Han Sans";
    font-weight: 500;
    src : url("${process.env.PUBLIC_URL}/assets/font/SpoqaHanSansNeo-Bold.ttf")
  }
  body {
        padding: 0;
        margin: 0;
        font-family: "Spoqa Han Sans";
  };
`;

ReactDOM.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={koKR}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <ReactQueryDevtools />
          <Router />
        </ThemeProvider>
      </ConfigProvider>
    </QueryClientProvider>
  </RecoilRoot>,
  document.getElementById("root"),
);

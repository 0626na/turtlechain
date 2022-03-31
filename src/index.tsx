import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { QueryClientProvider, QueryClient } from "react-query";
import Router from "router";
import { ConfigProvider } from "antd";
import koKR from "antd/es/locale/ko_KR";
import "moment/locale/ko";
import "antd/dist/antd.less";
import "./i18n";
import GlobalStyle from "GlobalStyle";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

ReactDOM.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={koKR}>
        <GlobalStyle />
        <Router />
      </ConfigProvider>
    </QueryClientProvider>
  </RecoilRoot>,
  document.getElementById("root"),
);

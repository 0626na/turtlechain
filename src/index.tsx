import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { QueryClientProvider, QueryClient } from "react-query";
import { ConfigProvider, message } from "antd";
import Router from "router";
import koKR from "antd/es/locale/ko_KR";
import GlobalStyle from "GlobalStyle";
import "moment/locale/ko";
import "antd/dist/antd.less";
import "./i18n";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

message.config({
  top: 60,
  maxCount: 1,
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

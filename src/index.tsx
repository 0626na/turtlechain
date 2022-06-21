import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ConfigProvider, message } from 'antd';
import koKR from 'antd/es/locale/ko_KR';
import 'moment/locale/ko';
import 'antd/dist/antd.less';
import './i18n';
import Router from './router';
import GlobalStyle from './GlobalStyle';
import ChannelService from './ChannelService';
import ReactGA from 'react-ga';

// Antd Message
message.config({
  top: 60,
  maxCount: 1,
});

// React Query
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
});

// Chanel Talk
ChannelService.boot({
  pluginKey: '8da7a859-56dc-473a-b576-50a826e5a5db',
});

// Google Analytics
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID ?? '');

ReactDOM.render(
  <RecoilRoot>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider locale={koKR}>
        <GlobalStyle />
        <Router />
      </ConfigProvider>
    </QueryClientProvider>
  </RecoilRoot>,
  document.getElementById('root'),
);

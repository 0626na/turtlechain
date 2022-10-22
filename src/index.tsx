import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ConfigProvider, message } from 'antd';
import koKR from 'antd/es/locale/ko_KR';
import 'moment/locale/ko';
import 'antd/dist/antd.less';
import './i18n';

import ChannelService from './ChannelService';
import GA4React from 'ga-4-react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { Global } from '@emotion/react';
import { reset } from '@styles/reset';

// Antd Message
message.config({
  top: 65,
  maxCount: 1,
  duration: 2,
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
const ga4react = new GA4React(
  process.env.REACT_APP_GOOGLE_ANALYTICS_TRACKING_ID ?? '',
);

(async () => {
  await ga4react.initialize();
  ReactDOM.render(
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={koKR}>
          <BrowserRouter>
            <Global styles={reset} />
            <App />
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </RecoilRoot>,
    document.getElementById('root'),
  );
})();

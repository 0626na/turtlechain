import React, { Suspense } from 'react';
import { PageHeader } from '@layout/page';
import koKR from 'antd/es/locale/ko_KR';
import './i18n';
import 'moment/locale/ko';
import 'antd/dist/antd.less';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import '@testing-library/jest-dom/extend-expect';
import { t } from 'i18next';
import { ConfigProvider } from 'antd';

describe('pickerorder page 테스트', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  test('pageHeader text 테스트', () => {
    const queryClient = new QueryClient();
    render(
      <MemoryRouter>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <ConfigProvider locale={koKR}>
              <PageHeader title={t('title.orderCreate')} />
            </ConfigProvider>
          </QueryClientProvider>
        </RecoilRoot>
      </MemoryRouter>,
    );

    expect(screen.getByText('발주등록')).toHaveTextContent('발주등록');
  });
});

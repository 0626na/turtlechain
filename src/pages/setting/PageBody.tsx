import React, { useEffect } from 'react';

import { TurtleTabs } from '@components/element';

import { PageHeader } from '@layout/page';
import { Tabs } from 'antd';

import { css } from '@emotion/react';

import UserTab from './tabs/UserTab';
import { useSearchParams } from 'react-router-dom';
import CompanyTab from './tabs/CompanyTab';
import StoreTab from './tabs/StoreTab';

function PageBody() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // 초기 진입시 store로 설정.
    if (!searchParams.get('tab')) setSearchParams({ tab: 'store' });
  }, [searchParams, setSearchParams]);

  return (
    <>
      <PageHeader title="설정" />

      <div // pageContent
        css={{
          flexGrow: 1,
          backgroundColor:
            searchParams.get('tab') === 'store' ? '#fff' : '#f9f9fa',
        }}
      >
        <TurtleTabs
          color="dark"
          activeKey={searchParams.get('tab') as string}
          onChange={(newKey) => {
            setSearchParams({ tab: newKey });
          }}
        >
          <Tabs.TabPane key="store" tab="쇼핑몰 관리">
            <div css={[storeTabContainer]}>
              <StoreTab />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key="user" tab="계정관리">
            <div css={tabContainer}>
              <UserTab />
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key="company" tab="사업자 관리">
            <div css={tabContainer}>
              <CompanyTab />
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane key="mistransferRefund" tab="오입금 환불">
            <div css={tabContainer}>ㅁ</div>
          </Tabs.TabPane>
        </TurtleTabs>
      </div>
    </>
  );
}

const tabContainer = css`
  padding: 38px 36px 0px 36px;
`;

const storeTabContainer = css`
  padding: 30px 36px 0px 36px;
`;

export default PageBody;

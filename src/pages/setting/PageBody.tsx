import React, { useEffect } from 'react';

import { TurtleTabs } from '@components/element';

import { PageHeader } from '@layout/page';
import { Tabs } from 'antd';

import { css } from '@emotion/react';

import UserTab from './tabs/UserTab';
import { useSearchParams } from 'react-router-dom';
import CompanyTab from './tabs/CompanyTab';
import StoreTab from './tabs/StoreTab';
import MistransferTab from './tabs/MistransferTab';
import { t } from 'i18next';
import useUser from '@hooks/useUser';

function PageBody() {
  const { isStaff } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // 초기 진입시 store로 설정.
    if (!searchParams.get('tab')) setSearchParams({ tab: 'store' });
  }, [searchParams, setSearchParams]);

  return (
    <>
      <PageHeader title={t('title.setting')} />

      <div // pageContent
        css={pageContent}
        style={{
          ['--background-color' as string]:
            searchParams.get('tab') === 'store' ||
            searchParams.get('tab') === 'mistransfer'
              ? '#fff'
              : '#f9f9fa',
        }}
      >
        <TurtleTabs
          color="dark"
          activeKey={searchParams.get('tab') as string}
          onChange={(newKey) => {
            setSearchParams({ tab: newKey });
          }}
        >
          <Tabs.TabPane key="store" tab={t('description.store management')}>
            <div css={whiteContainer}>
              <StoreTab />
            </div>
          </Tabs.TabPane>

          {isStaff ? null : (
            <>
              <Tabs.TabPane key="user" tab={t('title.manage accounts')}>
                <div css={greyContainer}>
                  <UserTab />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane key="company" tab={t('title.manage business info')}>
                <div css={greyContainer}>
                  <CompanyTab />
                </div>
              </Tabs.TabPane>
            </>
          )}

          <Tabs.TabPane
            key="mistransfer"
            tab={t('title.wrong transfer reversal')}
          >
            <div css={whiteContainer}>
              <MistransferTab />
            </div>
          </Tabs.TabPane>
        </TurtleTabs>
      </div>
    </>
  );
}

const pageContent = css({
  flexGrow: 1,
  backgroundColor: 'var(--background-color)',
});

const greyContainer = css`
  padding: 38px 36px 0px 36px;
`;

const whiteContainer = css`
  padding: 30px 36px 0px 36px;
`;

export default PageBody;

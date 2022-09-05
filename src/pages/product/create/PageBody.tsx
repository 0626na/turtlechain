import React from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TeriaryButton,
  TurtleDropdown,
} from '@components/element';
import { PageBottomBar, PageContent, PageTitle } from '@layout/page';
import { ReactComponent as ExelIcon } from '@icons/exel.svg';
import { ReactComponent as SingleIcon } from '@icons/single.svg';
import { Tabs } from 'antd';
import SuccessTab from './tabs/SuccessTab';
import TurtleTabs from '@components/element/TurtleTabs';
import PendingTab from './tabs/PendingTab';
import FailTab from './tabs/FailTab';

function PageBody() {
  return (
    <>
      <PageTitle
        title="상품등록 미리보기"
        subTitle="실패한 상품은 거래처 또는 일부 상품 정보가 정확하지 않아 추가하지 못한 상품들입니다."
        buttons={[
          <TeriaryButton
            text="재고프로그램 연동"
            onClick={() => {
              //   openModal();
              // vendorInventoryMutation()
            }}
          />,
          <TurtleDropdown
            items={[
              {
                key: '0',
                label: '엑셀 업로드',
                icon: <ExelIcon />,
                onClick(e) {
                  console.log(e);
                },
              },
              {
                key: '1',
                label: '단건추가',
                icon: <SingleIcon />,
                onClick(e) {
                  console.log(e);
                },
              },
            ]}
            triggerButton={<SecondaryButton text="상품 추가하기" />}
          />,
        ]}
      />
      <PageContent>
        <TurtleTabs>
          <Tabs.TabPane tab={`성공()`} key="success">
            <SuccessTab
            // isLoading={vendorInventoryMutation.isLoading}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`보류()`} key="pending">
            <PendingTab />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`실패()`} key="fail">
            <FailTab />
          </Tabs.TabPane>
        </TurtleTabs>
      </PageContent>

      <PageBottomBar>
        <PrimaryButton text="거래처 등록하기" />
      </PageBottomBar>
    </>
  );
}

export default PageBody;

import React from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TeriaryButton,
  TurtleDropdown,
  TurtleIcon,
  TurtleTabs,
  TurtleUpload,
} from '@components/element';
import { PageBottomBar, PageContent, PageTitle } from '@layout/page';
import SuccessTab from './tabs/SuccessTab';
import FailTab from './tabs/FailTab';

function PageBody() {
  const loading = false;
  return (
    <>
      <PageTitle
        title="입고서 미리보기"
        buttons={[
          <TeriaryButton
            text="재고프로그램 연동"
            onClick={() => {
              // openInventoryModal();
            }}
          />,
          <TurtleDropdown
            triggerButton={<SecondaryButton text="입고 추가하기" />}
            items={[
              {
                key: '0',
                label: (
                  <TurtleUpload
                    beforeUpload={(file) => {
                      // saveFile(file);
                      // parseExcelMutation.mutate({
                      //   files: file,
                      //   rt_store_id: store.selected?.id as number,
                      // });
                    }}
                  />
                ),
                icon: <TurtleIcon name="exel" />,
                onClick: (e) => {},
              },
              {
                key: '1',
                label: '단건추가',
                icon: <TurtleIcon name="single" />,
                onClick: (e) => {
                  // openAddingModal();
                },
              },
            ]}
          />,
        ]}
      />

      <PageContent>
        <TurtleTabs>
          <SuccessTab key="success" tab={`성공(${0})`} loading={loading} />
          <FailTab key="fail" tab={`실패(${0})`} loading={loading} />
        </TurtleTabs>
      </PageContent>

      <PageBottomBar>
        <PrimaryButton onClick={() => {}} disabled={false}>
          입고서 등록하기
        </PrimaryButton>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

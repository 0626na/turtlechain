import React from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TeriaryButton,
  TurtleDropdown,
  TurtleIcon,
  TurtleUpload,
} from '@components/element';
import { PageBottomBar, PageContent, PageTitle } from '@layout/page';
import TurtleTabs from '@components/element/TurtleTabs';
import useProductCart from '@hooks/useProductCart';
import SuccessTab from './tabs/SucceessTab';
import FailTab from './tabs/FailTab';
import useModal from '@hooks/useModal';
import AddOrderColumnModal from './modals/AddOrderColumnModal';

function PageBody() {
  const [orderColumnVisible, openSettingColumnModal, closeSettingColumnModal] =
    useModal();

  return (
    <>
      <AddOrderColumnModal
        visible={orderColumnVisible}
        closeModal={closeSettingColumnModal}
      />
      {/*
       * Page
       */}
      <PageTitle
        title="발주서 미리보기"
        buttons={[
          <TeriaryButton text="발주서 설정" onClick={openSettingColumnModal} />,
          <TurtleDropdown
            triggerButton={<SecondaryButton>발주 추가하기</SecondaryButton>}
            items={[
              {
                key: '0',
                label: (
                  <TurtleUpload
                    beforeUpload={(file) => {
                      //       saveFile(file);
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
                onClick: () => {},
              },
            ]}
          />,
        ]}
      />

      <PageContent>
        <TurtleTabs>
          <SuccessTab
            key="success"
            //tab={`성공(${cart.successList.length})`}
            loading={false}
          />
          <FailTab
            key="fail"
            //tab={`실패(${cart.failList.length})`}
            loading={false}
          />
        </TurtleTabs>
      </PageContent>

      <PageBottomBar>
        <PrimaryButton
        //onClick={openConfirmModal}
        //disabled={cart.successList.length === 0}
        >
          발주 등록하기
        </PrimaryButton>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

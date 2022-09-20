import React from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TeriaryButton,
  TurtleDropdown,
  TurtleIcon,
} from '@components/element';
import { PageBottomBar, PageContent, PageTitle } from '@layout/page';
import TurtleTabs from '@components/element/TurtleTabs';
import SuccessTab from './tabs/SucceessTab';

import useModal from '@hooks/useModal';
import AddOrderColumnModal from './modals/AddOrderColumnModal';
import { Upload } from 'antd';
import { useMutation } from 'react-query';
import orderAPI from '@apis/orderAPI';
import { t } from 'i18next';
import useOrderCart from '@hooks/useOrderCart';

function PageBody() {
  const [orderColumnVisible, openSettingColumnModal, closeSettingColumnModal] =
    useModal();
  const { cart, ready, reset } = useOrderCart();

  const createOrderExcelParseMutation = useMutation(
    orderAPI.createOrderExcelParsing,
    {
      onSuccess: (data) => {
        ready(data);
      },
    },
  );
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
                  <Upload
                    accept=".csv, .xls, .xlsx"
                    multiple
                    beforeUpload={(_, list) => {
                      createOrderExcelParseMutation.mutate({ files: list });
                    }}
                    fileList={[]}
                  >
                    {t('button.uploadExcel')}
                  </Upload>
                ),
                icon: <TurtleIcon name="exel" />,
              },
              {
                key: '1',
                label: '단건추가',
                icon: <TurtleIcon name="single" />,
              },
            ]}
          />,
        ]}
      />

      <PageContent>
        <TurtleTabs>
          <SuccessTab
            key="success"
            tab={`성공(${cart.successList.length})`}
            loading={false}
          />
          {/* <FailTab
            key="fail"
            tab={`실패(${cart.failList.length})`}
            loading={false}
          /> */}
        </TurtleTabs>
      </PageContent>

      <PageBottomBar>
        <PrimaryButton>발주 등록하기</PrimaryButton>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

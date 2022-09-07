import React, { useCallback, useState } from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TeriaryButton,
  TurtleDropdown,
  TurtleUpload,
} from '@components/element';
import { PageBottomBar, PageContent, PageTitle } from '@layout/page';
import { ReactComponent as ExelIcon } from '@icons/exel.svg';
import { ReactComponent as SingleIcon } from '@icons/single.svg';
import { message } from 'antd';
import SuccessTab from './tabs/SuccessTab';
import TurtleTabs from '@components/element/TurtleTabs';
import PendingTab from './tabs/PendingTab';
import FailTab from './tabs/FailTab';
import ConnectModal from '@components/combine/ConnectModal';
import { useMutation } from 'react-query';
import productAPI from '@apis/productAPI';
import useProductCart from '@hooks/useProductCart';
import useStore from '@hooks/useStore';

function PageBody() {
  const [modalVisible, setModalVisible] = useState(false);
  const { store, isStoreExist } = useStore();
  const { cart, ready, saveFile } = useProductCart();

  // 재고관리 연동 요청
  const connectInventoryMutation = useMutation(productAPI.connectInventory, {
    onSuccess: (data) => {
      ready(data);
      closeModal();
      message.info(
        `이미 등록된 상품이 ${data.data.count.duplicated_count}건 있습니다.`,
      );
    },
  });

  // 엑셀파싱 요청
  const parseExcelMutation = useMutation(productAPI.parseExcel, {
    onSuccess: (data) => {
      ready(data);
      message.info(
        `이미 등록된 상품이 ${data.data.count.duplicated_count}건 있습니다.`,
      );
    },
  });

  const loading =
    connectInventoryMutation.isLoading || parseExcelMutation.isLoading;

  const openModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  return (
    <>
      {/*
       *
       *  재고프로그램 연동 모달
       *
       */}
      <ConnectModal
        visible={modalVisible}
        title={'재고프로그램 연동'}
        description={[
          '선택한 기간의 재고 정보를 불러옵니다.',
          '정보의 양에따라 최대 1분 정도 걸릴 수 있어요.',
        ]}
        loading={loading}
        onCancel={closeModal}
        onOk={({ start_date, end_date }) => {
          if (!isStoreExist()) return;
          connectInventoryMutation.mutate({
            rt_store_id: store.id as number,
            start_date,
            end_date,
          });
        }}
      />
      <PageTitle
        title="상품등록 미리보기"
        subTitle="거래처 또는 일부 상품정보가 정확하지 않은 경우 등록이 실패될 수 있어요."
        buttons={[
          <TeriaryButton
            text="재고프로그램 연동"
            onClick={() => {
              openModal();
            }}
          />,
          <TurtleDropdown
            items={[
              {
                key: '0',
                label: (
                  <TurtleUpload //
                    beforeUpload={(file) => {
                      saveFile(file);
                      parseExcelMutation.mutate({
                        files: file,
                        rt_store_id: store.id!,
                      });
                    }}
                  />
                ),
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
          <SuccessTab
            key="success"
            tab={`성공(${cart.successList.length})`}
            loading={loading}
          />
          <PendingTab key="pending" tab={`보류()`} loading={loading} />
          <FailTab
            key="fail"
            tab={`실패(${cart.failList.length})`}
            loading={loading}
          />
        </TurtleTabs>
      </PageContent>

      <PageBottomBar>
        <PrimaryButton text="거래처 등록하기" />
      </PageBottomBar>
    </>
  );
}

export default PageBody;

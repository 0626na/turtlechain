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
import { RangeDateModal } from '@components/combine';
import { useNavigate } from 'react-router-dom';
import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';
import { useMutation } from 'react-query';
import warehousingAPI from '@apis/warehousingAPI';
import useWarehousingCart from '@hooks/useWarehousingCart';
import { message } from 'antd';

function PageBody() {
  const navigate = useNavigate();
  const { store, isStoreSelected } = useStore();
  const { cart, ready, reset } = useWarehousingCart();
  const [inventoryModalVisible, openInventoryModal, closeInventoryModal] =
    useModal();

  const connectInventoryMutation = useMutation(
    warehousingAPI.connectInventory,
    {
      onSuccess: (data) => {
        ready(data);
        // data.msg && setReservedMessage(data.msg);
        closeInventoryModal();
      },
    },
  );

  const parseExcelMutation = useMutation(warehousingAPI.parseExcel, {
    onSuccess: (data) => {
      ready(data);
      // data.msg && message.info(data.msg);
    },
  });

  const createMutation = useMutation(warehousingAPI.create, {
    onSuccess: () => {
      reset();
      message.success('성공적으로 등록했습니다.');
      navigate('/warehousing/history');
    },
  });

  const loading =
    connectInventoryMutation.isLoading ||
    parseExcelMutation.isLoading ||
    createMutation.isLoading;

  return (
    <>
      {/*
       *  재고프로그램 연동 모달
       */}
      <RangeDateModal
        inThreeMonth
        visible={inventoryModalVisible}
        title="재고프로그램 연동"
        description={[
          '선택한 기간의 재고 정보를 불러옵니다.',
          '정보의 양에따라 최대 1분 정도 걸릴 수 있어요.',
        ]}
        loading={loading}
        onCancel={closeInventoryModal}
        onOk={({ start_date, end_date }) => {
          if (!isStoreSelected()) return;
          connectInventoryMutation.mutate({
            rt_store_id: store.selected?.id as number,
            start_date,
            end_date,
          });
        }}
      />
      <PageTitle
        title="입고서 미리보기"
        buttons={[
          <TeriaryButton
            text="재고프로그램 연동"
            onClick={() => {
              openInventoryModal();
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
          <SuccessTab
            key="success"
            tab={`성공(${cart.successList.length})`}
            loading={loading}
          />
          <FailTab
            key="fail"
            tab={`실패(${cart.failList.length})`}
            loading={loading}
          />
        </TurtleTabs>
      </PageContent>

      <PageBottomBar>
        <PrimaryButton
          onClick={() => {}}
          disabled={cart.successList.length === 0}
        >
          입고서 등록하기
        </PrimaryButton>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

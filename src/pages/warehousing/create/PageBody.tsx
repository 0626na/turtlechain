import React from 'react';
import {
  PrimaryButton,
  SecondaryIconButton,
  TertiaryButton,
  TurtleConfirmModal,
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
import moment from 'moment';
import AddSingleProductModal from './modals/AddSingleProductModal';

function PageBody() {
  const navigate = useNavigate();
  const { store, isStoreSelected } = useStore();
  const { cart, ready, reset, saveFile } = useWarehousingCart();
  const [inventoryModalVisible, openInventoryModal, closeInventoryModal] =
    useModal();
  const [addingModalVisible, openAddingModal, closeAddingModal] = useModal();
  const [confirmModalVisible, openConfirmModal, closeConfirmModal] = useModal();

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
      {/**
       *  상품 단건추가 모달
       */}
      <AddSingleProductModal
        visible={addingModalVisible}
        closeModal={closeAddingModal}
      />
      {/**
       *  confirm 모달
       */}
      <TurtleConfirmModal
        title="정말 등록할까요?"
        description={['실패에 남아있는 상품은 등록에서 제외됩니다.']}
        okText="등록"
        loading={loading}
        visible={confirmModalVisible}
        onCancel={closeConfirmModal}
        onOk={() => {
          createMutation.mutate({
            sheet: {
              created_date: moment().format('YYYY-MM-DD'),
              rt_store_id: store.selected?.id as number,
            },
            item: {
              rt_store_id: store.selected?.id as number,
              item_list: cart.successList.map((record) => ({
                vendor_id: record.vendor_id,
                product_id: record.product_id,
                count: record.count,
                price: record.price,
                warehousing_date: record.warehousing_date,
                is_reserved: record.is_reserved,
                memo: record.memo,
              })),
            },
          });
        }}
      />
      {/*
       * Page
       */}
      <PageTitle
        title="입고서 미리보기"
        buttons={[
          <TertiaryButton
            text="재고프로그램 연동"
            onClick={() => {
              openInventoryModal();
            }}
          />,
          <TurtleDropdown
            triggerButton={
              <SecondaryIconButton>입고 추가하기</SecondaryIconButton>
            }
            items={[
              {
                key: '0',
                label: (
                  <TurtleUpload
                    beforeUpload={(file) => {
                      saveFile(file);
                      parseExcelMutation.mutate({
                        files: file,
                        rt_store_id: store.selected?.id as number,
                      });
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
                onClick: openAddingModal,
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
          onClick={openConfirmModal}
          disabled={cart.successList.length === 0}
        >
          입고서 등록하기
        </PrimaryButton>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

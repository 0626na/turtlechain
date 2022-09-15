import React from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TeriaryButton,
  TurtleConfirmModal,
  TurtleDropdown,
  TurtleIcon,
  TurtleUpload,
} from '@components/element';
import { PageBottomBar, PageContent, PageTitle } from '@layout/page';
import { message } from 'antd';
import SuccessTab from './tabs/SuccessTab';
import TurtleTabs from '@components/element/TurtleTabs';
import FailTab from './tabs/FailTab';
import { useMutation } from 'react-query';
import productAPI from '@apis/productAPI';
import useProductCart from '@hooks/useProductCart';
import useStore from '@hooks/useStore';
import { RangeDateModal } from '@components/combine';
import AddSingleProductModal from './modals/AddProductModal';
import useModal from '@hooks/useModal';
import { useNavigate } from 'react-router-dom';

function PageBody() {
  const navigate = useNavigate();
  const { store, isStoreSelected } = useStore();
  const { cart, ready, saveFile, resetCart } = useProductCart();
  const [inventoryModalVisible, openInventoryModal, closeInventoryModal] =
    useModal();
  const [addingModalVisible, openAddingModal, closeAddingModal] = useModal();
  const [confirmModalVisible, openConfirmModal, closeConfirmModal] = useModal();

  // 재고관리 연동 요청
  const connectInventoryMutation = useMutation(productAPI.connectInventory, {
    onSuccess: (data) => {
      ready(data);
      closeInventoryModal();
    },
  });

  // 엑셀파싱 요청
  const parseExcelMutation = useMutation(productAPI.parseExcel, {
    onSuccess: (data) => {
      ready(data);
    },
  });

  // 상품 생성 요청
  const createMutation = useMutation(productAPI.create, {
    onSuccess: (data) => {
      resetCart();
      message.success(
        `성공적으로 등록했습니다. 성공 : ${data.data.success} 중복된 상품 : ${data.data.fail}`,
      );
      navigate('/product/history');
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
      {/*
       *  단건 추가 모달
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
        description={['보류와 실패에 남아있는 상품은 등록에서 제외됩니다.']}
        okText="등록"
        loading={loading}
        visible={confirmModalVisible}
        onCancel={closeConfirmModal}
        onOk={() => {
          createMutation.mutate(
            cart.successList.map((product) => ({
              ...product,
              rt_store_id: store.selected?.id as number,
              image_url: product.image_url ?? '',
              memo: product.memo ?? '',
            })),
          );
        }}
      />
      <PageTitle
        title="상품등록 미리보기"
        subTitle="거래처 또는 일부 상품정보가 정확하지 않은 경우 등록이 실패될 수 있어요."
        buttons={[
          <TeriaryButton
            text="재고프로그램 연동"
            onClick={() => {
              openInventoryModal();
            }}
          />,
          <TurtleDropdown
            triggerButton={<SecondaryButton text="상품 추가하기" />}
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
                onClick: () => {
                  openAddingModal();
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
          onClick={openConfirmModal}
          disabled={cart.successList.length === 0}
        >
          상품 등록하기
        </PrimaryButton>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

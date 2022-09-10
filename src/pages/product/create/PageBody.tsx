import React from 'react';
import {
  PrimaryButton,
  SecondaryButton,
  TeriaryButton,
  TurtleConfirmModal,
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
  const { store, isStoreExist } = useStore();
  const { cart, ready, saveFile } = useProductCart();
  const [inventoryModalVisible, openInventoryModal, closeInventoryModal] =
    useModal();
  const [addingModalVisible, openAddingModal, closeAddingModal] = useModal();
  const [confirmModalVisible, openConfirmModal, closeConfirmModal] = useModal();

  // 재고관리 연동 요청
  const connectInventoryMutation = useMutation(productAPI.connectInventory, {
    onSuccess: (data) => {
      ready(data);
      closeInventoryModal();
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

  // 상품 생성 요청
  const createMutation = useMutation(productAPI.create, {
    onSuccess: (data) => {
      // resetStates();
      message.success(
        `성공적으로 등록하였습니다. 성공 : ${data.data.success} 중복된 상품 : ${data.data.fail}`,
      );
      navigate('/product/history');
    },
  });

  const loading =
    connectInventoryMutation.isLoading || parseExcelMutation.isLoading;

  return (
    <>
      {/*
       *  재고프로그램 연동 모달
       */}
      <RangeDateModal
        inThreeMonth
        visible={inventoryModalVisible as boolean}
        title="재고프로그램 연동"
        description={[
          '선택한 기간의 재고 정보를 불러옵니다.',
          '정보의 양에따라 최대 1분 정도 걸릴 수 있어요.',
        ]}
        loading={loading}
        onCancel={closeInventoryModal}
        onOk={({ start_date, end_date }) => {
          if (!isStoreExist()) return;
          connectInventoryMutation.mutate({
            rt_store_id: store.id as number,
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
        okText="네"
        visible={confirmModalVisible}
        onCancel={closeConfirmModal}
        onOk={() => {
          createMutation.mutate(
            cart.successList.map((product) => ({
              ...product,
              rt_store_id: store.id!,
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
          <PendingTab key="pending" tab={`보류()`} loading={loading} />
          <FailTab
            key="fail"
            tab={`실패(${cart.failList.length})`}
            loading={loading}
          />
        </TurtleTabs>
      </PageContent>

      <PageBottomBar>
        <PrimaryButton
          onClick={() => {
            openConfirmModal();
          }}
          disabled={cart.successList.length === 0}
        >
          상품 등록하기
        </PrimaryButton>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

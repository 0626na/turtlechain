import React from 'react';
import {
  PrimaryButton,
  SecondaryIconButton,
  TertiaryButton,
  TurtleConfirmModal,
  TurtleDropdown,
  TurtleIcon,
  TurtleUpload,
} from '@components/element';
import { PageBottomBar, PageContent, PageTitle } from '@layout/page';

import { message } from '@utils/message';
import SuccessTab from './tabs/SuccessTab';
import TurtleTabs from '@components/element/TurtleTabs';
import FailTab from './tabs/FailTab';
import { useMutation } from 'react-query';
import productAPI from '@apis/productAPI';
import useProductCart from '@hooks/useProductCart';
import useStore from '@hooks/useStore';
import { RangeDateModal } from '@components/combine';
import AddSingleProductModal from './modals/AddSingleProductModal';
import useModal from '@hooks/useModal';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import { Date } from '@components/combine/modal/RangeDateModal';

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
        t('message.success register product', {
          success: data.data.success,
          duplicated: data.data.fail,
        }),
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
        title={t('inventory program integration')}
        description={[
          t('please select which dates you wish to integrate'),
          t(
            'it may take up to 1 minute, depending on how much you wish to integrate',
          ),
        ]}
        loading={loading}
        onCancel={closeInventoryModal}
        onOk={({ start_date, end_date }: Date) => {
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
        title={t('title.really register')}
        description={[t('description.except fail product')]}
        okText={t('button.register')}
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
      {/*
       * Page
       */}
      <PageTitle
        title={t('preview of New Products')}
        subTitle={t(
          'your vendor list must be updated before adding new products',
        )}
        buttons={[
          <TertiaryButton
            text={t('button.integrate inventory program')}
            onClick={() => {
              openInventoryModal();
            }}
          />,
          <TurtleDropdown
            triggerButton={
              <SecondaryIconButton>
                {t('button.add product')}
              </SecondaryIconButton>
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
                label: t('button.one by one'),
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
            tab={`${t('success')}(${cart.successList.length})`}
            loading={loading}
          />
          <FailTab
            key="fail"
            tab={`${t('fail')}(${cart.failList.length})`}
            loading={loading}
          />
        </TurtleTabs>
      </PageContent>

      <PageBottomBar>
        <PrimaryButton
          onClick={openConfirmModal}
          disabled={cart.successList.length === 0}
        >
          {t('button.add & save')}
        </PrimaryButton>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

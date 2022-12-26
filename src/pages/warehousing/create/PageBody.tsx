import React, { useEffect } from 'react';
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
import { Col, Row } from 'antd';
import moment from 'moment';
import AddSingleProductModal from './modals/AddSingleProductModal';
import { t } from 'i18next';
import { message } from '@utils/message';
function PageBody() {
  const navigate = useNavigate();
  const { store, isStoreSelected } = useStore();
  const { cart, ready, reset, saveFile, totalCount, totalAmount } =
    useWarehousingCart();
  const [inventoryModalVisible, openInventoryModal, closeInventoryModal] =
    useModal();
  const [addingModalVisible, openAddingModal, closeAddingModal] = useModal();
  const [confirmModalVisible, openConfirmModal, closeConfirmModal] = useModal();

  // 쇼핑몰 변경시, unmount 시 상태 초기화
  useEffect(() => {
    reset();

    return () => {
      reset();
    };
  }, [store.selected]);

  const connectInventoryMutation = useMutation(
    warehousingAPI.connectInventory,
    {
      onSuccess: (data) => {
        ready(data);
        closeInventoryModal();
      },
    },
  );

  const parseExcelMutation = useMutation(warehousingAPI.parseExcel, {
    onSuccess: (data) => {
      ready(data);
    },
  });

  const createMutation = useMutation(warehousingAPI.create, {
    onSuccess: () => {
      reset();
      message.success(t('message.successfully saved todays stock'));
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
        title={t('button.integrate inventory program')}
        description={[
          t('description.please select which dates you wish to integrate'),
          t(
            'description.it may take up to 1 minute, depending on how much you wish to integrate',
          ),
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
        title={t('do yo really want me to sign up?')}
        description={[
          t(
            'description.products remaining in the failure are excluded from registration',
          ),
        ]}
        okText={t('button.register')}
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
        title={t('title.preview of todays stock products')}
        // subTitle="정확한 입고등록을 위해서는 거래처와 상품을 최신화 시켜주세요. 상품가격은 필수이니 잊지말고 입력해주세요!"
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
                {t('button.add warehousing')}
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
            tab={`${t('title.success')}(${cart.successList.length})`}
            loading={loading}
          />
          <FailTab
            key="fail"
            tab={`${t('title.fail')}(${cart.failList.length})`}
            loading={loading}
          />
        </TurtleTabs>
      </PageContent>

      <PageBottomBar>
        <Row justify="end" align="middle">
          <Col>
            <span style={{ color: ' #6B6D73', marginRight: 8 }}>
              {t('description.total stocked quantity')}
            </span>
            <span style={{ fontWeight: 700 }}>
              {totalCount.toLocaleString()}
            </span>
          </Col>
          <Col style={{ marginLeft: 8, marginRight: 8 }}>/</Col>
          <Col style={{ marginRight: 24 }}>
            <span style={{ color: ' #6B6D73', marginRight: 8 }}>
              {t('description.total stocked amount')}
            </span>
            <span style={{ fontWeight: 700 }}>
              {totalAmount.toLocaleString()}
            </span>
          </Col>
          <Col>
            <PrimaryButton
              onClick={openConfirmModal}
              disabled={cart.successList.length === 0}
            >
              {t('button.register warehousing sheet')}
            </PrimaryButton>
          </Col>
        </Row>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

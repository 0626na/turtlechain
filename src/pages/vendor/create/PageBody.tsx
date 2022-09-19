import React from 'react';

import vendorAPI from '@apis/vendorAPI';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { message, Tabs } from 'antd';
import {
  PageBottomBar,
  PageContent,
  PageHeader,
  PageTitle,
} from '@layout/page';
import {
  HistoryButton,
  PrimaryButton,
  SecondaryButton,
  TeriaryButton,
  TurtleConfirmModal,
  TurtleDropdown,
  TurtleIcon,
  TurtleTabs,
  TurtleUpload,
} from '@components/element';

import SuccessTab from './tabs/SuccessTab';
import PendingTab from './tabs/PendingTab';
import { RangeDateModal } from '@components/combine';

import useStore from '@hooks/useStore';
import useVendorCart from '@hooks/useVendorCart';
import useModal from '@hooks/useModal';
import FailTab from './tabs/FailTab';
import AddSingleVendorModal from './modals/AddVendorModal';

function PageBody() {
  const navigate = useNavigate();

  const { store } = useStore();
  const { cart, ready } = useVendorCart();

  const [inventoryModalVisible, openInventoryModal, closeInventoryModal] =
    useModal();
  const [confirmModalVisivle, openConfirmModal, closeConfirmModal] = useModal();
  const [addModalVisivle, openAddModal, closeAddModal] = useModal();

  // 재고프로그램 연동
  const inventoryMutation = useMutation(vendorAPI.inventory, {
    onError: () => {
      // resetField();
    },
    onSuccess: (data) => {
      closeInventoryModal();

      message.info(
        `이미 등록된 거래처가 ${data.data.count.duplicated_count}건 있습니다.`,
      );

      ready(data);
    },
  });

  // 엑셀 연동
  const excelMutation = useMutation(vendorAPI.excel, {
    onSuccess: (data) => {
      ready(data);
      message.info(
        `이미 등록된 거래처가 ${data.data.count.duplicated_count}건 있습니다.`,
      );
    },
  });

  // 거래처 등록하기
  const vendorCreateMutation = useMutation(vendorAPI.create, {
    onError: () => {},
    onSuccess: (data) => {
      message.success(
        `성공적으로 등록하였습니다. 성공 : ${data.data.success_count} 중복된 거래처 : ${data.data.fail_count}`,
      );
      closeConfirmModal();
      navigate('/vendor/history');
    },
  });

  const loading = inventoryMutation.isLoading || excelMutation.isLoading;

  return (
    <>
      {/*
       *
       *  재고프로그램 연동 모달
       *
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
          inventoryMutation.mutate({
            rt_store_id: store.selected?.id as number,
            start_date,
            end_date,
          });
        }}
      />

      {/*
       *  단건 추가 모달
       */}

      <AddSingleVendorModal
        visible={addModalVisivle}
        closeModal={closeAddModal}
      />

      {/*
       *
       * 거래처 등록 확인 모달
       *
       */}

      <TurtleConfirmModal
        visible={confirmModalVisivle}
        title={'정말 등록할까요?'}
        description={['보류와 실패에 남아있는 거래처는 등록에서 제외됩니다.']}
        onCancel={() => {
          closeConfirmModal();
        }}
        okText="등록"
        onOk={() => {
          vendorCreateMutation.mutate(
            cart.successList.map((vendor) => ({
              rt_store_id: store.selected?.id ?? -1,
              vendor_code: vendor.vendor_code,
              vendor_account_id: vendor.ws_store_info[0].store_account[0].id,
              vendor_phone_id: vendor.ws_store_info[0].store_phone[0].id,
              ws_store_id: vendor.ws_store_info[0].id,
              vendor_address: vendor.ws_store_info[0].address,
              vendor_name: vendor.useVendorName,
              memo: vendor.memo,
              is_vat_included: vendor.isVatIncluded,
            })),
          );
        }}
        loading={inventoryMutation.isLoading}
      />

      <PageHeader
        title="거래처등록"
        button={
          <HistoryButton
            text="거래처 목록"
            onClick={() => {
              navigate('/vendor/history');
            }}
          />
        }
      />

      <PageTitle
        title="거래처등록 미리보기"
        buttons={[
          <TeriaryButton
            text="재고프로그램 연동"
            onClick={() => {
              openInventoryModal();
            }}
          />,
          <TurtleDropdown
            items={[
              {
                key: '0',
                label: (
                  <TurtleUpload
                    beforeUpload={(file) => {
                      excelMutation.mutate({
                        file,
                        rt_store_id: store.selected?.id as number,
                      });
                    }}
                  />
                ),
                icon: <TurtleIcon name="exel" />,
              },
              {
                key: '1',
                label: '단건추가',
                icon: <TurtleIcon name="single" />,
                onClick() {
                  openAddModal();
                },
              },
            ]}
            triggerButton={<SecondaryButton>거래처 추가하기</SecondaryButton>}
          />,
        ]}
      />

      <PageContent>
        <TurtleTabs>
          <Tabs.TabPane tab={`성공(${cart.successList.length})`} key="success">
            <SuccessTab isLoading={loading} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`보류(${cart.pendingList.length})`} key="pending">
            <PendingTab isLoading={loading} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`실패(${cart.failList.length})`} key="fail">
            <FailTab isLoading={loading} />
          </Tabs.TabPane>
        </TurtleTabs>
      </PageContent>

      <PageBottomBar>
        <PrimaryButton
          onClick={() => {
            openConfirmModal();
          }}
        >
          거래처 등록하기
        </PrimaryButton>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

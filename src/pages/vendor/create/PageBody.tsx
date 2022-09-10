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
import AddSingleProductModal from '@pages/product/create/modals/AddProductModal';
function PageBody() {
  const navigate = useNavigate();

  const { store } = useStore();
  const { cart, ready } = useVendorCart();

  const [inventoryModalVisible, openInventoryModal, closeInventoryModal] =
    useModal();
  const [confirmModalVisivle, openConfirmModal, closeConfirmModal] = useModal();
  const [addingModalVisible, openAddingModal, closeAddingModal] = useModal();
  // 재고프로그램 연동
  const vendorInventoryMutation = useMutation(vendorAPI.vendorInventory, {
    onError: () => {
      // resetField();
    },
    onSuccess: (data) => {
      closeInventoryModal();

      message.info(
        `이미 등록된 거래처가 ${data.data.count.duplicated_count}개 있습니다.`,
      );

      ready(data);
    },
  });

  // 엑셀 연동

  // 거래처 등록하기
  const vendorCreateMutation = useMutation(vendorAPI.create, {
    onError: () => {},
    onSuccess: (data) => {
      message.success(
        `성공적으로 등록하였습니다. 성공 : ${data.data.success_count} 중복된 거래처 : ${data.data.fail_count}`,
      );
      closeConfirmModal();
      navigate('/vendor/list');
    },
  });

  const loading = vendorInventoryMutation.isLoading;

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
          vendorInventoryMutation.mutate({
            rt_store_id: store.id!,
            start_date,
            end_date,
          });
        }}
      />

      {/*
       *
       * 거래처 등록 확인 모달
       *
       */}

      <TurtleConfirmModal
        visible={confirmModalVisivle}
        title={'정말 등록할까요?'}
        description={['추천과 미매칭에 남아있는 거래처는 등록에서 제외됩니다.']}
        onCancel={() => {
          closeConfirmModal();
        }}
        okText="네"
        onOk={() => {
          vendorCreateMutation.mutate(
            cart.successList.map((vendor) => ({
              rt_store_id: store.id ?? -1,
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
        loading={vendorInventoryMutation.isLoading}
      />

      <PageHeader
        title="거래처등록"
        button={<HistoryButton text="거래처 목록" onClick={() => {}} />}
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
                label: '엑셀 업로드',
                icon: <TurtleIcon name="exel" />,
                onClick(e) {
                  console.log(e);
                },
              },
              {
                key: '1',
                label: '단건추가',
                icon: <TurtleIcon name="single" />,
                onClick(e) {
                  openAddingModal();
                },
              },
            ]}
            triggerButton={<SecondaryButton text="거래처 추가하기" />}
          />,
        ]}
      />

      <PageContent>
        <TurtleTabs>
          <Tabs.TabPane tab={`성공(${cart.successList.length})`} key="success">
            <SuccessTab isLoading={vendorInventoryMutation.isLoading} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`보류(${cart.pendingList.length})`} key="pending">
            <PendingTab isLoading={vendorInventoryMutation.isLoading} />
          </Tabs.TabPane>
          {/* <Tabs.TabPane
            tab={`실패(${parsedVendorCounts.fail_count})`}
            key="fail"
          ></Tabs.TabPane> */}
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

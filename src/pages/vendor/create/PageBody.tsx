import React, { useState } from 'react';
import { storeState } from '@store/storeState';
import { useRecoilState, useRecoilValue } from 'recoil';
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
  TurtleTabs,
} from '@components/element';
import { ReactComponent as ExelIcon } from '@icons/exel.svg';
import { ReactComponent as SingleIcon } from '@icons/single.svg';
import { vendorCartCountsState, vendorCartState } from '@store/vendorCartState';
import SuccessTab from './tabs/SuccessTab';
import PendingTab from './tabs/PendingTab';
import { InventoryModal } from '@components/combine';

function PageBody() {
  const navigate = useNavigate();

  const store = useRecoilValue(storeState);

  const [parsedVendorLists, setParsedVendorLists] =
    useRecoilState(vendorCartState);
  const [parsedVendorCounts, setParsedVendorCounts] = useRecoilState(
    vendorCartCountsState,
  );

  // 모달 제어
  const [inventoryModalVisible, setInventoryModalVisible] = useState(false);
  const [confirmModalVisivle, setConfirmModalVisivle] = useState(false);
  const openInventoryModal = () => {
    setInventoryModalVisible(true);
  };

  const closeInventoryModal = () => {
    setInventoryModalVisible(false);
  };

  const openConfirmModal = () => {
    setConfirmModalVisivle(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalVisivle(false);
  };

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

      setParsedVendorLists({
        successList: data.data.success.map((vendor) => ({
          ...vendor,
          isVatIncluded: false,
          useVendorName: vendor.name,
          memo: '',
        })),

        pendingList: data.data.suggest.map((vendor) => ({
          ...vendor,
          isMatching: false,
          isVatIncluded: false,
          useVendorName: vendor.name,
          memo: '',
          selectedWsStoreInfo:
            vendor.ws_store_info.length === 1
              ? {
                  ...vendor.ws_store_info[0],
                  selectedAccount:
                    vendor.ws_store_info[0].store_account.length === 1
                      ? vendor.ws_store_info[0].store_account[0]
                      : undefined,
                }
              : undefined,
        })),

        failList: data.data.fail,
      });

      setParsedVendorCounts(data.data.count);
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

  return (
    <>
      {/*
       *
       *  재고프로그램 연동 모달
       *
       */}
      <InventoryModal
        visible={inventoryModalVisible}
        title="재고프로그램 연동"
        description={[
          '선택한 기간의 재고 정보를 불러옵니다.',
          '정보의 양에따라 최대 1분 정도 걸릴 수 있어요.',
        ]}
        loading={vendorInventoryMutation.isLoading}
        onCancel={closeInventoryModal}
        onOk={({ start_date, end_date }) => {
          vendorInventoryMutation.mutate({
            rt_store_id: store.id!,
            start_date,
            end_date,
          });
          closeInventoryModal();
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
            parsedVendorLists.successList.map((vendor) => ({
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
            triggerButton={<SecondaryButton text="거래처 추가하기" />}
          />,
        ]}
      />

      <PageContent>
        <TurtleTabs>
          <Tabs.TabPane
            tab={`성공(${parsedVendorCounts?.success_count})`}
            key="success"
          >
            <SuccessTab isLoading={vendorInventoryMutation.isLoading} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`보류(${parsedVendorCounts.suggest_count})`}
            key="pending"
          >
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
          text="거래처 등록하기"
          onClick={() => {
            openConfirmModal();
          }}
        />
      </PageBottomBar>
    </>
  );
}

export default PageBody;

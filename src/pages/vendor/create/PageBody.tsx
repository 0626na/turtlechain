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
  SecondaryIconButton,
  TertiaryButton,
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
  const { cart, setCart, ready, convertToSuccessItem, convertToMutateItem } =
    useVendorCart();

  const [inventoryModalVisible, openInventoryModal, closeInventoryModal] =
    useModal();
  const [confirmModalVisivle, openConfirmModal, closeConfirmModal] = useModal();
  const [addModalVisivle, openAddModal, closeAddModal] = useModal();

  // 재고프로그램 연동
  const inventoryMutation = useMutation(vendorAPI.inventory, {
    onSuccess: (data) => {
      closeInventoryModal();
      message.info(
        `이미 등록된 거래처가 ${data.data.count.duplicated_count}건 있습니다.`,
      );
      ready(data);
    },
    onError: () => {
      // resetField();
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
    onSuccess: (data) => {
      message.success(
        `성공적으로 등록하였습니다. 성공 : ${data.data.success_count} 중복된 거래처 : ${data.data.fail_count}`,
      );
      closeConfirmModal();
      navigate('/vendor/history');
    },
    onError: () => {},
  });

  const successCount = [
    ...cart.successList,
    ...cart.pendingList.filter((item) => item.isMatching),
  ].length;

  const pendingCount = cart.pendingList.filter(
    (item) => !item.isMatching,
  ).length;

  const failCount = cart.failList.length;

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
        loading={inventoryMutation.isLoading}
        onCancel={inventoryMutation.isLoading ? () => {} : closeInventoryModal}
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
        okText="등록"
        onOk={() => {
          vendorCreateMutation.mutate([
            ...cart.successList.map((vendor) =>
              convertToMutateItem(vendor, store.selected?.id as number),
            ),
            ...cart.pendingList
              .filter((vendor) => vendor.isMatching)
              .map((vendor) => convertToSuccessItem(vendor))
              .map((vendor) =>
                convertToMutateItem(vendor, store.selected?.id as number),
              ),
          ]);

          setCart({
            successList: [],
            pendingList: [],
            failList: [],
          });
        }}
        loading={vendorCreateMutation.isLoading}
        onCancel={() => {
          closeConfirmModal();
        }}
        title={'정말 등록할까요?'}
        description={['보류와 실패에 남아있는 거래처는 등록에서 제외됩니다.']}
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
          <TertiaryButton
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
            triggerButton={
              <SecondaryIconButton>거래처 추가하기</SecondaryIconButton>
            }
          />,
        ]}
      />

      <PageContent>
        <TurtleTabs>
          <Tabs.TabPane tab={`성공(${successCount})`} key="success">
            <SuccessTab
              isLoading={inventoryMutation.isLoading || excelMutation.isLoading}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`보류(${pendingCount})`} key="pending">
            <PendingTab
              isLoading={inventoryMutation.isLoading || excelMutation.isLoading}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`실패(${failCount})`} key="fail">
            <FailTab
              isLoading={inventoryMutation.isLoading || excelMutation.isLoading}
            />
          </Tabs.TabPane>
        </TurtleTabs>
      </PageContent>

      <PageBottomBar>
        <PrimaryButton
          disabled={successCount === 0}
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

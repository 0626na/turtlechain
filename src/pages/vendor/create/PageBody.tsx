import React, { useEffect } from 'react';

import vendorAPI from '@apis/vendorAPI';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Tabs } from 'antd';
import {
  AlertBar,
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
import AddSingleVendorModal from './modals/AddSingleModal';
import { t } from 'i18next';
import { message } from '@utils/message';

function PageBody() {
  const navigate = useNavigate();
  const { store } = useStore();
  const { cart, ready, reset, convertToSuccessItem, convertToMutateItem } =
    useVendorCart();
  const [inventoryModalVisible, openInventoryModal, closeInventoryModal] =
    useModal();
  const [confirmModalVisivle, openConfirmModal, closeConfirmModal] = useModal();
  const [addModalVisivle, openAddModal, closeAddModal] = useModal();
  const [alertBarVisible, openAlertModal, closeAlertModal] = useModal(true);

  /**
   * 쇼핑몰 변경시 cart 초기화한다.
   */
  useEffect(() => {
    reset();
  }, [store.selected]);

  // 재고프로그램 연동
  const inventoryMutation = useMutation(vendorAPI.inventory, {
    onSuccess: (data) => {
      ready(data);
      closeInventoryModal();
      message.warn(
        t('message.vendor duplicated count', {
          count: data.data.count.duplicated_count,
        }),
      );
    },
  });

  // 엑셀 연동
  const excelMutation = useMutation(vendorAPI.excel, {
    onSuccess: (data) => {
      ready(data);
      t('message.vendor duplicated count', {
        count: data.data.count.duplicated_count,
      });
    },
  });

  // 거래처 등록하기
  const vendorCreateMutation = useMutation(vendorAPI.create, {
    onSuccess: (data) => {
      message.success(
        t('message.success register vendor', {
          success: data.data.success_count,
          duplicated: data.data.fail_count,
        }),
      );
      closeConfirmModal();
      navigate('/vendor/history');
    },
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
        title={t('button.inventory program integration')}
        description={[
          t('description.please select which dates you wish to integrate'),
          t(
            'description.it may take up to 1 minute, depending on how much you wish to integrate',
          ),
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
        okText={t('button.register')}
        onOk={() => {
          vendorCreateMutation.mutate([
            ...cart.successList.map((vendor) =>
              convertToMutateItem(vendor, Number(store.selected?.id)),
            ),
            ...cart.pendingList
              .filter((vendor) => vendor.isMatching)
              .map((vendor) => convertToSuccessItem(vendor))
              .map((vendor) =>
                convertToMutateItem(vendor, Number(store.selected?.id)),
              ),
          ]);

          reset();
        }}
        loading={vendorCreateMutation.isLoading}
        onCancel={() => {
          closeConfirmModal();
        }}
        title={t('title.really register')}
        description={[t('description.register exclude fail')]}
      />

      {/*
       * 신규거래처 요청 알림 바
       */}
      <AlertBar />

      <PageHeader
        title={t('title.create vendor')}
        button={
          <HistoryButton
            text={t('title.vendor list')}
            onClick={() => {
              navigate('/vendor/history');
            }}
          />
        }
      />

      <PageTitle
        title="거래처등록 미리보기"
        subTitle="거래처명과 계좌번호만 있다면 쉽게 대량등록(xlsx)을 할 수 있어요! 보류에서 계좌정보 선택은 유의해주세요."
        buttons={[
          <TertiaryButton
            text={t('button.inventory program integration')}
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
                label: t('button.one by one'),
                icon: <TurtleIcon name="single" />,
                onClick() {
                  openAddModal();
                },
              },
            ]}
            triggerButton={
              <SecondaryIconButton>
                {t('button.add vendor')}
              </SecondaryIconButton>
            }
          />,
        ]}
      />

      <PageContent>
        <TurtleTabs>
          <Tabs.TabPane
            tab={`${t('title.success')}(${successCount})`}
            key="success"
          >
            <SuccessTab
              isLoading={inventoryMutation.isLoading || excelMutation.isLoading}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${t('title.pending')}(${pendingCount})`}
            key="pending"
          >
            <PendingTab
              isLoading={inventoryMutation.isLoading || excelMutation.isLoading}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`${t('title.fail')}(${failCount})`} key="fail">
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
          {t('button.save vendor')}
        </PrimaryButton>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

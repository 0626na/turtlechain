import React, { useEffect, useState } from 'react';
import {
  PrimaryButton,
  SecondaryIconButton,
  TertiaryButton,
  TurtleDropdown,
  TurtleIcon,
  TurtleText,
} from '@components/element';
import { PageBottomBar, PageContent, PageTitle } from '@layout/page';
import TurtleTabs from '@components/element/TurtleTabs';
import SuccessTab from './tabs/SucceessTab';
import FailTab from './tabs/FailTab';
import useModal from '@hooks/useModal';
import AddOrderColumnModal from '@pages/pickerOrder/create/modals/AddOrderColumnModal';
import { Col, Row, Upload } from 'antd';
import { t } from 'i18next';
import useOrderCart from '@hooks/useOrderCart';
import { useMutation, useQuery } from 'react-query';
import orderAPI, { ResponseCreateOrderItemExcelParsing } from '@apis/orderAPI';
import { css } from '@emotion/react';
import pickerAPI from '@apis/pickerAPI';
import useUser from '@hooks/useUser';
import moment from 'moment';
import { theme } from '@styles/theme';
import useStore from '@hooks/useStore';

import ConfirmOrderModal from '@pages/pickerOrder/create/modals/ConfirmOrderModal';
import OrderParsingProcessPresentModal from '@pages/pickerOrder/create/modals/OrderParsingProcessPresentModal';
import OrderCreateBlockModal from './modals/OrderCreateBlockModal';
import AddNewOrderModal from './modals/AddNewOrderModal';
import LoadAdjustementModal from './modals/LoadAdjustementModal';

function PageBody() {
  const {
    cart,
    reset,
    ready,
    countFailList,
    countOrdersForType,
    countSucessOrdersCount,
    calculateTotalPrice,
  } = useOrderCart();
  const { store } = useStore();
  const { user } = useUser();
  const [todayOrdersCount, setTodayordersCount] = useState({
    complete: 0,
    total: 0,
  });

  const [orderColumnVisible, openSettingColumnModal, closeSettingColumnModal] =
    useModal();
  const [confirmModalVisible, openConfirmModal, closeConfirmModal] = useModal();
  const [preparsingModalVisible, openPreparsingModal, closePreparsingModal] =
    useModal();
  const [newAddModalVisible, openNewAddModal, closeNewAddModal] = useModal();
  const [
    orderParsingResultModalVisible,
    openParsingResultModal,
    closeParsingResultModal,
  ] = useModal();

  const [adjustmentModalVisible, openAdjustmentModal, closeAdjustmentModal] =
    useModal();

  //엑셀 파싱 전에 해당 파일이 등록이 이미 된 파일인지 확인 (프리파싱)
  const {
    data: preParsingData,
    mutate,
    isSuccess,
  } = useMutation(orderAPI.createPreParsing, {
    onSuccess: (data) => {
      //2회 이상 발주 파일이 없는경우
      if (!data.parsingData) {
        openPreparsingModal();
        return;
      }

      if (!data.parsingData.data.parsing_status.fail_count) {
        ready({ ...data.parsingData });
        return;
      }

      openParsingResultModal();
    },
  });

  //쇼핑몰 갯수
  useQuery(['getStoreCount'], pickerAPI.getList, {
    enabled: !!user?.id,
    onSuccess: (data) =>
      setTodayordersCount({
        ...todayOrdersCount,
        total: data.data.total_count,
      }),
  });

  //발주완료 갯수
  useQuery(
    'getOrdersCountQuery',
    () =>
      orderAPI.getOrderSheets({
        rt_store_id: store.selected?.id,
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
      }),
    {
      enabled: !!store.selected?.id,
      onSuccess: (data) =>
        setTodayordersCount({
          ...todayOrdersCount,
          complete: data.data.order_sheet_list.filter(
            (order) => order.type === 'new',
          ).length,
        }),
    },
  );

  useEffect(() => reset(), [store]);

  /**
   * 발주서 엑셀파일 파싱 상태
   */
  const orderExcefilesParsingData =
    preParsingData?.parsingData?.data.parsing_status;

  /**
   * 발주등록 최종 확인 모달 내용
   */
  const confirmModalItems = [
    {
      title: t('table.orderDate'),
      content: cart.selectedDate.format('YYYY-MM-DD'),
    },

    {
      title: t('title.totalOrderCountInConfirm'),
      content: t('description.count', { count: countOrdersForType().total }),
    },
    {
      title: t('title.totalOrderPriceInConfirm'),
      content: t('description.price', {
        price: calculateTotalPrice().toLocaleString(),
      }),
    },
  ];

  return (
    <>
      <LoadAdjustementModal
        visible={adjustmentModalVisible}
        onClose={closeAdjustmentModal}
      />
      <AddOrderColumnModal
        visible={orderColumnVisible}
        closeModal={closeSettingColumnModal}
      />

      <AddNewOrderModal visible={newAddModalVisible} close={closeNewAddModal} />

      {isSuccess && (
        <OrderCreateBlockModal
          visible={preparsingModalVisible}
          onCancel={closePreparsingModal}
          onOk={closePreparsingModal}
        />
      )}

      <OrderParsingProcessPresentModal
        visible={orderParsingResultModalVisible}
        title={t('title.order is problem')}
        description={[
          t('description.there are orders to modify'),
          t('description.please check error and reload'),
        ]}
        onCancel={closeParsingResultModal}
        onOk={() => {
          ready({
            ...(preParsingData?.parsingData as ResponseCreateOrderItemExcelParsing),
          });
          closeParsingResultModal();
        }}
        successCount={Number(orderExcefilesParsingData?.success_count) ?? 0}
        failCount={Number(orderExcefilesParsingData?.fail_count) ?? 0}
        messages={orderExcefilesParsingData?.error_messages ?? []}
        size="small"
      />

      <ConfirmOrderModal
        highlight={true}
        title={t('title.really order')}
        description={[
          t('description.please check order info again'),
          t('description.failed orders are except'),
        ]}
        visible={confirmModalVisible}
        close={closeConfirmModal}
        items={confirmModalItems}
      />

      {/*
       * Page
       */}
      <PageTitle
        title={t('title.orderPreview')}
        buttons={[
          <TertiaryButton
            text={t('button.orderColumnSetting')}
            onClick={openSettingColumnModal}
            icon={<TurtleIcon name="tuning" />}
          />,
          <TurtleDropdown
            triggerButton={
              <SecondaryIconButton>{t('button.addOrder')}</SecondaryIconButton>
            }
            items={[
              {
                key: '0',
                label: (
                  <Upload
                    accept=".csv, .xls, .xlsx"
                    multiple
                    beforeUpload={(_, list) => {
                      mutate({
                        files: list,
                        rt_store_id: store.selected?.id,
                        request_date: moment(cart.selectedDate).format(
                          'YYYY-MM-DD',
                        ),
                      });

                      return false;
                    }}
                    fileList={[]}
                  >
                    {t('button.at a time')}
                  </Upload>
                ),
                icon: <TurtleIcon name="exel" />,
              },
              {
                key: '1',
                label: t('button.one by one'),
                icon: <TurtleIcon name="single" />,
                onClick() {
                  openNewAddModal();
                },
              },
              {
                key: '2',
                label: t('button.load adjustment'),
                icon: <TurtleIcon name="bookMark" />,
                onClick() {
                  openAdjustmentModal();
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
            tab={`${t('title.success')} (${countSucessOrdersCount()})`}
            loading={false}
          />
          <FailTab
            key="fail"
            tab={`${t('title.fail')} (${countFailList()})`}
            loading={false}
          />
        </TurtleTabs>
      </PageContent>

      <PageBottomBar>
        <Row
          css={css({
            display: 'flex',
            alignItems: 'center',
            fontSize: 16,
            fontWeight: 700,
          })}
        >
          <Col css={css({ marginRight: 20 })}>
            <TurtleText>
              <span css={css({ color: theme.grey500, fontWeight: 400 })}>
                {t('description.orderTotalCount')}
              </span>
              {'   '}
              {t('description.count', { count: countOrdersForType().total })}
              <span css={css({ color: theme.grey500, fontWeight: 400 })}>
                {`(${t('type.orderTypes.order')} ${
                  countOrdersForType().order
                }, ${t('type.orderTypes.exchange')} ${
                  countOrdersForType().exchange
                }, ${t('type.orderTypes.takeback')} ${
                  countOrdersForType().takeback
                }, ${t('type.orderTypes.reserve')} ${
                  countOrdersForType().reserve
                }, ${t('type.orderTypes.sample')} ${
                  countOrdersForType().sample
                }, ${t('type.orderTypes.pickup')} ${
                  countOrdersForType().pickup
                }, ${t('type.orderTypes.extra')} ${countOrdersForType().extra})
              / ${t('description.orderTotalPrice')}  `}
              </span>
              {`${calculateTotalPrice().toLocaleString()}${t(
                'description.won',
              )}`}
            </TurtleText>
          </Col>
          <Col>
            <PrimaryButton
              disabled={cart.successList.length === 0}
              onClick={() => {
                openConfirmModal();
              }}
            >
              {t('button.do order')}
            </PrimaryButton>
          </Col>
        </Row>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

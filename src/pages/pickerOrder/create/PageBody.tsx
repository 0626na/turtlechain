import React, { useState } from 'react';
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
import AddOrderColumnModal from './modals/AddOrderColumnModal';
import { Col, Row, Upload } from 'antd';

import { t } from 'i18next';
import useOrderCart from '@hooks/useOrderCart';

import AddNewOrderModal from './modals/AddNewOrderModal';
import ConfirmOrderModal from './modals/ConfirmOrderModal';
import PreparsingOrderModal from './modals/PreparsingOrderModal';
import { useMutation, useQuery } from 'react-query';
import orderAPI, {
  ResponseCreateOrderItemExcelParsing,
  ResponseCreatePreParsing,
} from '@apis/orderAPI';
import { css } from '@emotion/react';
import pickerAPI from '@apis/pickerAPI';
import useUser from '@hooks/useUser';
import moment from 'moment';
import { theme } from '@styles/theme';
import OrderParsingProcessPresentModal from './modals/OrderParsingProcessPresentModal';

function PageBody() {
  const {
    cart,
    ready,
    countSuccessList,
    countFailList,
    countOrdersForType,
    calculateTotalPrice,
  } = useOrderCart();
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
    orderParsingProcessModalVisible,
    openParsingProcessModal,
    closeParsingProcessModal,
  ] = useModal();

  /**
   * 엑셀 파싱 전에 해당 파일이 등록이 이미 된 파일인지 확인 (프리파싱)
   */
  const createPreParsingMutation = useMutation(orderAPI.createPreParsing, {
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
      openParsingProcessModal();
    },
  });

  /**
   * 파싱하려는 발주서 엑셀파일
   */
  const uploadFiles = createPreParsingMutation.data?.files ?? [];

  /**
   * 프리파싱 결과
   */
  const preParsingResult = createPreParsingMutation.data?.preParsingResult;

  /**
   * 발주서 엑셀파일 파싱 상태
   */
  const orderExcefilesParsingData =
    createPreParsingMutation.data?.parsingData?.data.parsing_status;

  return (
    <>
      {/* 발주서 헤더 설정 모달 */}
      <AddOrderColumnModal
        visible={orderColumnVisible}
        closeModal={closeSettingColumnModal}
      />

      {/* 단건 추가 모달 */}
      <AddNewOrderModal visible={newAddModalVisible} close={closeNewAddModal} />

      {/* 재등록 모달 */}
      {createPreParsingMutation.isSuccess && (
        <PreparsingOrderModal
          visible={preparsingModalVisible}
          open={openPreparsingModal}
          close={closePreparsingModal}
          data={{
            files: uploadFiles,
            preParsingResult: preParsingResult as ResponseCreatePreParsing,
          }}
        />
      )}

      {/* 발주등록 확인 모달 */}
      <ConfirmOrderModal
        visible={confirmModalVisible}
        close={closeConfirmModal}
      />

      {/* 발주서 파싱 결과 모달 */}
      <OrderParsingProcessPresentModal
        visible={orderParsingProcessModalVisible}
        title={t('order is problem')}
        description={[
          t('there are orders to modify'),
          t('please check error and reload'),
        ]}
        onCancel={closeParsingProcessModal}
        onOk={() => {
          ready({
            ...(createPreParsingMutation.data
              ?.parsingData as ResponseCreateOrderItemExcelParsing),
          });
          closeParsingProcessModal();
        }}
        successCount={Number(orderExcefilesParsingData?.success_count) ?? 0}
        failCount={Number(orderExcefilesParsingData?.fail_count) ?? 0}
        messages={orderExcefilesParsingData?.error_messages ?? []}
        size="middle"
      />

      {/*
       * Page
       */}
      <PageTitle
        title={t('order.preview')}
        buttons={[
          <TurtleText
            css={css({
              fontSize: 14,
              fontWeight: 500,
            })}
          >
            {`${t('complete orders today')} ${todayOrdersCount.complete}`}{' '}
            <span css={css({ color: theme.grey400 })}>
              {`/ 
              ${t('count', { count: todayOrdersCount.total })} | `}
            </span>
            {`${t('incomplete orders today')} ${
              todayOrdersCount.total - todayOrdersCount.complete
            }`}{' '}
            <span css={css({ color: theme.grey400 })}>{`/ ${t('count', {
              count: todayOrdersCount.total,
            })}`}</span>
          </TurtleText>,
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
                      createPreParsingMutation.mutate({
                        files: list,
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
            ]}
          />,
        ]}
      />

      <PageContent>
        <TurtleTabs>
          <SuccessTab
            key="success"
            tab={`${t('success')}(${countSuccessList()})`}
            loading={false}
          />
          <FailTab
            key="fail"
            tab={`${t('fail')}(${countFailList()})`}
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
              <span css={css({ color: theme.grey400, fontWeight: 400 })}>
                {t('orderTotalCount')}
              </span>
              {'   '}
              {` ${t('count', { count: countSuccessList() })}`}
              <span css={css({ color: theme.grey400, fontWeight: 400 })}>
                {`(${t('order.types.order')} ${countOrdersForType().order}, ${t(
                  'order.types.exchange',
                )} ${countOrdersForType().exchange}, ${t(
                  'order.types.takeback',
                )} ${countOrdersForType().takeback}, ${t(
                  'order.types.reserve',
                )} ${countOrdersForType().reserve}, ${t(
                  'order.types.sample',
                )} ${countOrdersForType().sample}, ${t('order.types.pickup')} ${
                  countOrdersForType().pickup
                }, ${t('order.types.extra')} ${countOrdersForType().extra})
              / ${t('orderTotalPrice')}  `}
              </span>
              {`${t('price', {
                price: calculateTotalPrice().toLocaleString(),
              })}`}
            </TurtleText>
          </Col>
          <Col>
            <PrimaryButton
              disabled={cart.successList.length === 0}
              onClick={() => {
                openConfirmModal();
              }}
            >
              {t('button.order')}
            </PrimaryButton>
          </Col>
        </Row>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

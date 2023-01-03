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
import orderAPI from '@apis/orderAPI';
import { css } from '@emotion/react';
import pickerAPI from '@apis/pickerAPI';
import useUser from '@hooks/useUser';
import moment from 'moment';
import { theme } from '@styles/theme';
import useStore from '@hooks/useStore';

function PageBody() {
  const {
    cart,
    ready,
    countSuccessList,
    countFailList,
    countOrdersForType,
    calculateTotalPrice,
  } = useOrderCart();
  const { store } = useStore();
  const { user } = useUser();
  const [todayOrdersCount, setTodayordersCount] = useState({
    complete: 0,
    total: 0,
  });
  //모달 data
  const [orderColumnVisible, openSettingColumnModal, closeSettingColumnModal] =
    useModal();
  const [confirmModalVisible, openConfirmModal, closeConfirmModal] = useModal();
  const [preparsingModalVisible, openPreparsingModal, closePreparsingModal] =
    useModal();
  const [newAddModalVisible, openNewAddModal, closeNewAddModal] = useModal();
  const [
    orderParsingProcessPresentModalVisible,
    openParsingProcessModal,
    closeParsingProcessModal,
  ] = useModal();

  //엑셀 파싱 전에 해당 파일이 등록이 이미 된 파일인지 확인 (프리파싱)
  const createPreParsingMutation = useMutation(orderAPI.createPreParsing, {
    onSuccess: (data) => {
      //2회 이상 발주 파일이 없는경우
      if (data.parsingData) {
        ready({ ...data.parsingData });
        if (data.parsingData.data.parsing_status.fail_count)
          openParsingProcessModal();
        return;
      }

      openPreparsingModal();
    },
  });

  //쇼핑몰 갯수
  const getStoreCountQuery = useQuery(['getStoreCount'], pickerAPI.getList, {
    enabled: !!user?.id,
    onSuccess: (data) =>
      setTodayordersCount({
        ...todayOrdersCount,
        total: data.data.total_count,
      }),
  });

  //발주완료 갯수
  const getOrdersCountQuery = useQuery(
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
            files: createPreParsingMutation.data?.files,
            preParsingResult: createPreParsingMutation.data?.preParsingResult,
          }}
        />
      )}

      {/* 발주등록 확인 모달 */}
      <ConfirmOrderModal
        visible={confirmModalVisible}
        close={closeConfirmModal}
      />

      {/*
       * Page
       */}
      <PageTitle
        title="발주서 미리보기"
        buttons={[
          <TertiaryButton
            text="발주서 설정"
            onClick={openSettingColumnModal}
            icon={<TurtleIcon name="tuning" />}
          />,
          <TurtleDropdown
            triggerButton={
              <SecondaryIconButton>발주 추가하기</SecondaryIconButton>
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
            ]}
          />,
        ]}
      />

      <PageContent>
        <TurtleTabs>
          <SuccessTab
            key="success"
            tab={`성공(${countSuccessList()})`}
            loading={false}
          />
          <FailTab
            key="fail"
            tab={`실패(${countFailList()})`}
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
                발주수량 합계{' '}
              </span>
              {'   '}
              {` ${countSuccessList()}개 `}
              <span css={css({ color: theme.grey400, fontWeight: 400 })}>
                {`(발주 ${countOrdersForType().order}, 교환 ${
                  countOrdersForType().exchange
                }, 미송 ${countOrdersForType().notDelivery}, 샘플 ${
                  countOrdersForType().sample
                }, 픽업 ${countOrdersForType().pickup}, 기타 ${
                  countOrdersForType().etc
                })
              / 발주금액 합계  `}
              </span>
              {`${calculateTotalPrice().toLocaleString()}원`}
            </TurtleText>
          </Col>
          <Col>
            <PrimaryButton
              disabled={cart.successList.length === 0}
              onClick={() => {
                openConfirmModal();
              }}
            >
              발주 등록하기
            </PrimaryButton>
          </Col>
        </Row>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

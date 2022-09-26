import React, { useState } from 'react';
import {
  AnswerButton,
  PrimaryButton,
  SecondaryButton,
  TeriaryButton,
  TurtleDropdown,
  TurtleIcon,
} from '@components/element';
import { PageBottomBar, PageContent, PageTitle } from '@layout/page';
import TurtleTabs from '@components/element/TurtleTabs';
import SuccessTab from './tabs/SucceessTab';

import useModal from '@hooks/useModal';
import AddOrderColumnModal from './modals/AddOrderColumnModal';
import { Col, message, Row, Space, Typography, Upload } from 'antd';
import { useMutation } from 'react-query';
import orderAPI, {
  CreatingOrdersItem,
  OrderItemList,
  PreParsingOrderList,
} from '@apis/orderAPI';
import { t } from 'i18next';
import useOrderCart from '@hooks/useOrderCart';
import { TurtleContentModal } from '@components/combine';
import { RcFile } from 'antd/lib/upload';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import FailTab from './tabs/FailTab';

function PageBody() {
  const navigate = useNavigate();
  const { cart, ready, reset } = useOrderCart();
  const [fileList, setFileList] = useState<RcFile[]>([]);
  const [preParsingList, setPreParsingList] = useState<PreParsingOrderList>({
    first_order: [],
    second_order: [],
    third_order: [],
  });

  const [orderColumnVisible, openSettingColumnModal, closeSettingColumnModal] =
    useModal();
  const [confirmModalVisible, openConfirmModal, closeConfirmModal] = useModal();
  const [preparsingModalVisible, openPreparsingModal, closePreparsingModal] =
    useModal();

  //발주서 파싱
  const createOrderExcelParseMutation = useMutation(
    orderAPI.createOrderExcelParsing,
    {
      onSuccess: (data) => {
        ready(data);
      },
    },
  );
  //const loading = !createOrderExcelParseMutation.isSuccess;

  //발주서 등록 (발주 시트)
  const createOrderSheetMutation = useMutation(orderAPI.createOrderSheet, {
    onSuccess: () => {
      const rt_stores = cart.successList.map<OrderItemList>((store) => {
        const orders = store.orders.map<CreatingOrdersItem>((order) => {
          return {
            vendor_name: order.vendor_name,
            vendor_address: order.vendor_address,
            vendor_mobile: order.vendor_mobile,
            product_name: order.product_name,
            product_option: order.product_option,
            product_count: Number(order.product_count),
            product_price: Number(order.product_price),
            order_type: order.order_type,
            memo: order.memo,
            ws_store_id: order.ws_store_info[0].id,
          };
        });

        return {
          rt_store_id: store.rt_store_id,
          orders,
        };
      });

      createOrderItemMutation.mutate({ rt_stores });
    },
  });

  //발주서 등록 (발주 Item)
  const createOrderItemMutation = useMutation(orderAPI.createOrderItem, {
    onSuccess: (data) => {
      if (data.msg === 'success') {
        message.success('발주서 등록이 완료되었습니다.', 4);
        closeConfirmModal();
        reset();
        navigate('/order/history');
      }
    },
  });

  //엑셀 파싱 전에 해당 파일이 등록이 이미 된 파일인지 확인 (프리파싱)
  const creatOrderSheetsPreParsingMutation = useMutation(
    orderAPI.createPreParsing,
    {
      onSuccess: (data) => {
        setPreParsingList(data.responseData.data);
        setFileList(data.files);
        if (data.responseData.data.third_order.length === 0) {
          createOrderExcelParseMutation.mutate({ files: data.files });
          return;
        }

        openPreparsingModal();
      },
    },
  );

  return (
    <>
      <AddOrderColumnModal
        visible={orderColumnVisible}
        closeModal={closeSettingColumnModal}
      />

      {/* 재등록 모달 */}
      <TurtleContentModal
        size="small"
        visible={preparsingModalVisible}
        title="발주서 재등록"
        onClose={closePreparsingModal}
      >
        <p>
          2차 발주까지 완료된 쇼핑몰은 발주서 등록이 금일은 불가능합니다.
          <br />
          {preParsingList.third_order.map((store, index) =>
            preParsingList.third_order.length !== index + 1
              ? `${store.rt_store_name}, `
              : `${store.rt_store_name}`,
          )}
          <br />
          <br />위 쇼핑몰을 제외한 나머지 발주서만 등록합니다. <br />
          1차발주:
          {preParsingList.first_order.map((store, index) =>
            preParsingList.first_order.length !== index + 1
              ? `${store.rt_store_name}, `
              : `${store.rt_store_name}`,
          )}
          <br />
          2차발주:
          {preParsingList.second_order.map((store, index) =>
            preParsingList.second_order.length !== index + 1
              ? `${store.rt_store_name}, `
              : `${store.rt_store_name}`,
          )}
        </p>

        <Row justify="end">
          <Col style={{ marginRight: 20 }}>
            <AnswerButton
              type="NO"
              text="취소"
              onClick={closePreparsingModal}
            />
          </Col>
          <Col>
            <AnswerButton
              type="YES"
              text="재등록하기"
              disabled={
                preParsingList.third_order.length !== 0 &&
                preParsingList.first_order.length === 0 &&
                preParsingList.second_order.length === 0
              }
              onClick={() => {
                createOrderExcelParseMutation.mutate({ files: fileList });
                closePreparsingModal();
              }}
            />
          </Col>
        </Row>
      </TurtleContentModal>

      {/* 발주등록 확인 모달 */}
      <TurtleContentModal
        size="small"
        title="정말 발주할까요?"
        visible={confirmModalVisible}
        onClose={closeConfirmModal}
      >
        <Space direction="vertical">
          <Typography.Paragraph>
            실패에 남아있는 건은 발주에서 제외됩니다. <br />
            발주 정보를 다시 한번 확인해주세요.
          </Typography.Paragraph>

          <Typography.Text style={{ fontSize: 16, fontWeight: 500 }}>
            {`발주일자: ${moment().format('YYYY-MM-DD')}   `}
          </Typography.Text>
          <Typography.Text
            style={{ fontSize: 16, fontWeight: 500 }}
          >{`총 발주수량:  ${cart.successList.length}개  `}</Typography.Text>
          <Typography.Text
            style={{ fontSize: 16, fontWeight: 500 }}
          >{`총 발주금액: ${cart.successList
            .reduce(
              (acc, store) =>
                acc +
                store.orders.reduce(
                  (acc, order) => acc + Number(order.product_price),
                  0,
                ),
              0,
            )
            .toLocaleString()}원`}</Typography.Text>
        </Space>

        <Row justify="end">
          <Col style={{ marginRight: 10 }}>
            <AnswerButton type="NO" text="취소" onClick={closeConfirmModal} />
          </Col>
          <Col>
            <AnswerButton
              type="YES"
              text="요청"
              onClick={() =>
                createOrderSheetMutation.mutate({
                  rt_store_ids: cart.successList.map(
                    (store) => store.rt_store_id,
                  ),
                })
              }
            />
          </Col>
        </Row>
      </TurtleContentModal>
      {/*
       * Page
       */}
      <PageTitle
        title="발주서 미리보기"
        buttons={[
          <TeriaryButton text="발주서 설정" onClick={openSettingColumnModal} />,
          <TurtleDropdown
            triggerButton={<SecondaryButton>발주 추가하기</SecondaryButton>}
            items={[
              {
                key: '0',
                label: (
                  <Upload
                    accept=".csv, .xls, .xlsx"
                    multiple
                    beforeUpload={(_, list) => {
                      creatOrderSheetsPreParsingMutation.mutate({
                        files: list,
                      });

                      return false;
                    }}
                    fileList={[]}
                  >
                    {t('button.uploadExcel')}
                  </Upload>
                ),
                icon: <TurtleIcon name="exel" />,
              },
              {
                key: '1',
                label: '단건추가',
                icon: <TurtleIcon name="single" />,
              },
            ]}
          />,
        ]}
      />

      <PageContent>
        <TurtleTabs>
          <SuccessTab
            key="success"
            tab={`성공(${cart.successList.length})`}
            loading={false}
          />
          <FailTab
            key="fail"
            tab={`실패(${cart.failList.length})`}
            loading={false}
          />
        </TurtleTabs>
      </PageContent>

      <PageBottomBar>
        <PrimaryButton
          disabled={cart.successList.length === 0}
          onClick={() => {
            openConfirmModal();
          }}
        >
          발주 등록하기
        </PrimaryButton>
      </PageBottomBar>
    </>
  );
}

export default PageBody;

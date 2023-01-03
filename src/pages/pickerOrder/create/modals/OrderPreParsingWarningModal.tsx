import React from 'react';
import orderAPI, { ResponseCreatePreParsing } from '@apis/orderAPI';
import { TurtleConfirmModal } from '@components/element';
import { css } from '@emotion/react';
import useOrderCart from '@hooks/useOrderCart';
import { RcFile } from 'antd/lib/upload';
import { t } from 'i18next';
import moment from 'moment';
import { useMutation } from 'react-query';

interface Props {
  visible: boolean;
  title: string;

  description: string[];

  onCancel: () => void;
  data: {
    files: RcFile[];
    preParsingResult: ResponseCreatePreParsing;
  };
  size?: 'small' | 'middle' | 'large';
}

/**
 * 발주서 프리파싱(재등록 가능 여부 확인) 결과 모달
 */
function OrderPreParsingWarningModal({
  visible,
  title,
  description,
  onCancel,
  size,
  data,
}: Props) {
  const { ready, cart } = useOrderCart();
  //발주서 파싱
  const createOrderExcelParseMutation = useMutation(
    orderAPI.createOrderExcelParsing,
    {
      onSuccess: (parsingData) => {
        ready({
          ...parsingData,
          data: {
            ...parsingData.data,
            successes: parsingData.data.successes.map((item) => ({
              ...item,
              type: 'excel',
            })),
            fails: parsingData.data.fails.map((item) => ({
              ...item,
              type: 'excel',
            })),
          },
        });
      },
    },
  );

  const orderPreparsingResult = data.preParsingResult.data;
  const unabledOrders = orderPreparsingResult.third_order;
  const enabledOrders = [
    ...orderPreparsingResult.first_order,
    ...orderPreparsingResult.second_order,
  ];
  const totalOrderCount = unabledOrders.length + enabledOrders.length;

  return (
    <TurtleConfirmModal
      visible={visible}
      title={title}
      titleIcon={false}
      iconName="alertWarningRed"
      description={description}
      onCancel={onCancel}
      onOk={() => {
        if (enabledOrders.length !== 0)
          createOrderExcelParseMutation.mutate({
            files: data.files,
            request_date: moment(cart.selectedDate).format('YYYY-MM-DD'),
          });
        onCancel();
      }}
      size={size}
    >
      <div
        css={css({ display: 'flex', flexDirection: 'column', marginTop: 40 })}
      >
        {/* 추가 발주불가 갯수 */}
        <div
          css={css({
            display: 'flex',
            marginLeft: 2,
            color: '#434852',
            fontWeight: 500,
            fontSize: 14,
            letterSpacing: '0.005em',
          })}
        >
          <span>{t('description.unable additional order')} </span>
          <span css={css({ color: '#FA5252', marginLeft: 4, marginRight: 3 })}>
            {unabledOrders.length}
          </span>
          <div
            css={css({
              display: 'flex',
              color: 'none',
              alignItems: 'center',
            })}
          >
            <span css={css({ marginRight: 4 })}>/ {totalOrderCount} </span>
          </div>
        </div>

        {unabledOrders.length !== 0 && (
          <div
            css={css({
              display: 'flex',
              flexDirection: 'column',
              marginTop: 17,
              padding: 14,
              backgroundColor: '#F0F3F6',
              borderRadius: 10,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '140%',
              letterSpacing: '-0.005em',
            })}
          >
            <span css={css({ color: '#FA5252' })}>
              {unabledOrders.map((order, index) => {
                if (unabledOrders.length === index + 1)
                  return `${order.rt_store_name}`;

                return `${order.rt_store_name}, `;
              })}
            </span>
          </div>
        )}

        {/* 추가 가능 발주 갯수 */}
        <div
          css={css({
            marginTop: 17,
            display: 'flex',
            marginLeft: 2,
            color: '#434852',
            fontWeight: 500,
            fontSize: 14,
            letterSpacing: '0.005em',
          })}
        >
          <span>{t('description.enable additional order')} </span>
          <span css={css({ marginRight: 3 })}>{enabledOrders.length}</span>
          <div
            css={css({
              display: 'flex',
              color: 'none',
              alignItems: 'center',
            })}
          >
            <span css={css({ marginRight: 4 })}>/ {totalOrderCount} </span>
          </div>
        </div>
        {enabledOrders.length !== 0 && (
          <div
            css={css({
              display: 'flex',
              flexDirection: 'column',
              marginTop: 17,
              padding: 14,
              backgroundColor: '#F0F3F6',
              borderRadius: 10,
              fontWeight: 500,
              fontSize: 14,
              lineHeight: '140%',
              letterSpacing: '-0.005em',
            })}
          >
            <span>
              {enabledOrders.map((order, index) => {
                if (enabledOrders.length === index + 1)
                  return `${order.rt_store_name}`;

                return `${order.rt_store_name}, `;
              })}
            </span>
          </div>
        )}
        {/* 발주서 에러 메세지 */}
      </div>
    </TurtleConfirmModal>
  );
}

export default OrderPreParsingWarningModal;

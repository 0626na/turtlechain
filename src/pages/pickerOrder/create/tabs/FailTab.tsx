import React from 'react';
import {
  MemoIcon,
  TurtleTableNumberInput,
  TurtleTableTitle,
} from '@components/element';
import TurtleTableSelect from '@components/element/select/TurtleTableSelect';
import useModal from '@hooks/useModal';
import useOrderCart, { FailListForOutput } from '@hooks/useOrderCart';
import { message, Table, TabPaneProps, Tabs } from 'antd';
import { useState } from 'react';
import OrderMemoModal from '../modals/OrderMemoModal';
import { category } from './SucceessTab';
import { t } from 'i18next';
import { StoreOrder, StoreOrderItemExcelParsing } from '@apis/orderAPI';
import TurtleTablePhoneNumberInput from '@components/element/input/TurtleTablePhoneNumberInput';
import { notNumPattern, phonePattern } from '@utils/pattern';
import AddOrderFailtoSuccessModal from '../modals/AddOrderFailtoSuccessModal';

interface Props extends TabPaneProps {
  loading: boolean;
}

function FailTab({ loading, ...props }: Props) {
  const { cart, setCart, failListOutput } = useOrderCart();
  const [selectRowID, setSelectRowID] = useState(-1);
  const [failToSuccessRowData, setfailToSuccessRowData] = useState({
    id: 0,
    mobile: '',
  });
  const [memoModalvisible, openMemoModal, closeMemoModal] = useModal();
  const [
    failtoSuccessModailvisible,
    openFailToSuccessModal,
    closeFailToSuccessModal,
  ] = useModal();

  //클릭한 테이블 Row를 찾는 함수
  const searchSameRow = (
    store: StoreOrderItemExcelParsing,
    order: StoreOrder,
    record: FailListForOutput,
  ) => {
    return (
      store.rt_store_id === record.rt_store_id &&
      order.order_id === record.order_id
    );
  };

  //휴대전화번호 Input
  const failTablePhoneNumberInput = (record: FailListForOutput) => {
    return (
      <TurtleTablePhoneNumberInput
        placeholder="휴대전화번호 입력"
        maxLength={13}
        onInput={(e) => {
          e.currentTarget.value = e.currentTarget.value
            .replaceAll(notNumPattern, '')
            .replace(phonePattern, '$1-$2-$3');

          if (e.currentTarget.value.length === 13) {
            setfailToSuccessRowData({
              id: record.id,
              mobile: e.currentTarget.value,
            });

            openFailToSuccessModal();
          }
        }}
      />
    );
  };

  return (
    <>
      <OrderMemoModal
        visible={memoModalvisible}
        close={closeMemoModal}
        defaultValue={
          failListOutput().find((item) => item.id === selectRowID)?.memo ?? ''
        }
        onOk={(value) => {
          const clickRow = failListOutput().find(
            (item) => item.id === selectRowID,
          );
          if (clickRow) {
            setCart({
              ...cart,
              failList: cart.failList.map((failItem) => ({
                ...failItem,
                orders: failItem.orders.map((order) => ({
                  ...order,
                  memo: searchSameRow(failItem, order, clickRow)
                    ? value
                    : order.memo,
                })),
              })),
            });
            message.success(t('message.successMemoInput'));
            closeMemoModal();
            return;
          }

          message.error('데이터를 선택해주세요');
          closeMemoModal();
        }}
      />
      {failListOutput().length !== 0 && (
        <AddOrderFailtoSuccessModal
          title="성공으로 변환"
          description={[
            '휴대전화번로를 입력하면 성공으로 변경합니다.',
            '성공으로 변환한 데이터는 실패탭에서 휴대전화번호가 표시됩니다.',
          ]}
          visible={failtoSuccessModailvisible}
          onCancel={closeFailToSuccessModal}
          failData={{
            record: failListOutput()[failToSuccessRowData.id],
            mobile: failToSuccessRowData.mobile,
          }}
          onOk={() => {
            const failToSuccessRecord =
              failListOutput()[failToSuccessRowData.id];
            setCart({
              ...cart,
              failList: cart.failList.map((failItem) => ({
                ...failItem,
                orders: failItem.orders.map((order) => ({
                  ...order,
                  mobile:
                    failItem.rt_store_id === failToSuccessRecord.rt_store_id &&
                    order.vendor_name === failToSuccessRecord.vendor_name
                      ? failToSuccessRowData.mobile
                      : order.mobile,
                })),
              })),
            });

            message.success(t('message.success update'));
            closeFailToSuccessModal();
          }}
        />
      )}
      <Tabs.TabPane {...props}>
        <Table
          scroll={{ x: 1608, y: 'auto', scrollToFirstRowOnChange: true }}
          loading={loading}
          size="small"
          dataSource={failListOutput()}
          rowKey={(record) => record.id}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
          }}
          title={() => (
            <TurtleTableTitle totalCount={failListOutput().length ?? 0} />
          )}
          columns={[
            {
              title: '쇼핑몰',
              width: 148,
              render: (_, record) => record.rt_store_name,
            },
            {
              title: '거래처명',
              width: 136,
              render: (_, record) => record.vendor_name,
            },
            {
              title: '거래처 주소',
              width: 196,
              render: (_, record) => record.vendor_address,
            },
            {
              title: '휴대전화 번호',
              width: 156,
              render: (_, record) => {
                const tempList = failListOutput();

                if (record.mobile !== '') return record.mobile;
                if (record.id === 0) return failTablePhoneNumberInput(record);
                if (
                  tempList[record.id - 1].rt_store_name ===
                    record.rt_store_name &&
                  tempList[record.id - 1].vendor_name === record.vendor_name &&
                  tempList[record.id - 1].vendor_address ===
                    record.vendor_address
                ) {
                  return null;
                }

                return failTablePhoneNumberInput(record);
              },
            },
            {
              title: '거래처 상품명',
              width: 216,
              render: (_, record) => record.product_name,
            },
            {
              title: '옵션',
              width: 136,
              render: (_, record) => record.product_option,
            },
            {
              title: '분류',
              width: 136,
              render: (_, record) => (
                <TurtleTableSelect
                  items={category}
                  value={record.order_type}
                  onChange={(value: string) => {
                    setCart({
                      successList: cart.successList,
                      failList: cart.failList.map((failItem) => ({
                        ...failItem,
                        orders: failItem.orders.map((order) => ({
                          ...order,
                          order_type: searchSameRow(failItem, order, record)
                            ? value
                            : order.order_type,
                        })),
                      })),
                    });
                  }}
                />
              ),
            },
            {
              title: '수량',
              width: 136,
              render: (_, record) => (
                <TurtleTableNumberInput
                  value={record.product_count}
                  step={1}
                  onChange={(value:number) => {
                    setCart({
                      successList: cart.successList,
                      failList: cart.failList.map((failItem) => ({
                        ...failItem,
                        orders: failItem.orders.map((order) => ({
                          ...order,
                          product_count:
                            searchSameRow(failItem, order, record) &&
                            value !== null
                              ? value.toString()
                              : order.product_count,
                        })),
                      })),
                    });
                  }}
                />
              ),
            },
            {
              title: '가격',
              width: 136,
              align: 'right',
              render: (_, record) => record.product_price,
            },
            {
              title: '메모',
              align: 'center',
              width: 100,
              render: (_, record) => (
                <MemoIcon
                  value={record.memo ?? ''}
                  onClick={() => {
                    setSelectRowID(record.id);
                    openMemoModal();
                  }}
                />
              ),
            },
          ]}
        />
      </Tabs.TabPane>
    </>
  );
}

export default FailTab;

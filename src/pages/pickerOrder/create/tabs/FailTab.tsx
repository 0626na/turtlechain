import React, { useMemo } from 'react';
import {
  MemoIcon,
  TurtleSearchInput,
  TurtleSearchSelect,
  TurtleTableNumberInput,
  TurtleTableTitle,
} from '@components/element';
import TurtleTableSelect from '@components/element/select/TurtleTableSelect';
import useModal from '@hooks/useModal';
import useOrderCart, { FailListForOutput } from '@hooks/useOrderCart';
import { Col, Row, Table, TabPaneProps, Tabs } from 'antd';
import { message } from '@utils/message';
import { useState } from 'react';
import OrderMemoModal from '../../../../components/combine/modal/OrderMemoModal';
import { category } from './SucceessTab';
import { t } from 'i18next';
import { StoreOrder, StoreOrderItemExcelParsing } from '@apis/orderAPI';
import TurtleTablePhoneNumberInput from '@components/element/input/TurtleTablePhoneNumberInput';
import { notNumPattern, phonePattern } from '@utils/pattern';
import AddOrderFailtoSuccessModal from '../modals/AddOrderFailtoSuccessModal';
import { valueType } from 'antd/lib/statistic/utils';
import { css } from '@emotion/react';

interface Props extends TabPaneProps {
  loading: boolean;
}

function FailTab({ loading, ...props }: Props) {
  const options = [
    {
      name: t('button.storeName'),
      value: 'name',
    },
    {
      name: t('button.vendorName'),
      value: 'vendor_name',
    },
    {
      name: t('button.vendorAddress'),
      value: 'address',
    },
  ];

  const { cart, setCart, failListOutput } = useOrderCart();
  const [selectRowID, setSelectRowID] = useState(-1);
  const [failToSuccessRowData, setfailToSuccessRowData] = useState({
    id: 0,
    mobile: '',
  });
  const [searchQuery, setSearchQuery] = useState({
    type: 'name',
    search_string: '',
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

  const filteredList = useMemo(() => {
    if (searchQuery.type === 'name')
      return failListOutput().filter((item) =>
        item.rt_store_name.includes(searchQuery.search_string),
      );
    if (searchQuery.type === 'vendor_name')
      return failListOutput().filter((item) =>
        item.vendor_name.includes(searchQuery.search_string),
      );
    if (searchQuery.type === 'address')
      return failListOutput().filter((item) =>
        item.vendor_address.includes(searchQuery.search_string),
      );
  }, [cart.failList, searchQuery]);

  //휴대전화번호 Input
  const failTablePhoneNumberInput = (record: FailListForOutput) => {
    return (
      <TurtleTablePhoneNumberInput
        placeholder={t('mobile')}
        maxLength={13}
        onInput={(e) => {
          e.currentTarget.value = e.currentTarget.value
            .replace(notNumPattern, '')
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

          message.error(t('message.select data'));
          closeMemoModal();
        }}
      />
      {failListOutput().length !== 0 && (
        <AddOrderFailtoSuccessModal
          title={t('change to success')}
          description={[
            t('if you enter your phone, change it to success'),
            t(
              'the data converted to Success displays the mobile phone number on the Failed tab',
            ),
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
                      ? failToSuccessRowData.mobile.replaceAll('-', '')
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
          dataSource={filteredList}
          rowKey={(record) => record.id}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
          }}
          title={() => (
            <TurtleTableTitle
              totalCount={failListOutput().length ?? 0}
              rightContent={
                <Row>
                  <Col css={marginRight}>
                    <TurtleSearchSelect
                      value={searchQuery.type}
                      onChange={(value) => {
                        setSearchQuery({
                          ...searchQuery,
                          type: value,
                        });
                      }}
                      items={options}
                    />
                  </Col>

                  <Col>
                    <TurtleSearchInput
                      placeholder={t('please input search query')}
                      value={searchQuery.search_string}
                      onChange={(e) =>
                        setSearchQuery({
                          ...searchQuery,
                          search_string: e.currentTarget.value,
                        })
                      }
                    />
                  </Col>
                </Row>
              }
            />
          )}
          columns={[
            {
              title: t('table.store'),
              width: 148,
              render: (_, record) => record.rt_store_name,
            },
            {
              title: t('table.vendorName'),
              width: 136,
              render: (_, record) => record.vendor_name,
            },
            {
              title: t('table.vendorAddress'),
              width: 196,
              render: (_, record) => record.vendor_address,
            },
            {
              title: t('table.mobile'),
              width: 156,
              render: (_, record) => {
                const tempList = failListOutput();

                if (record.mobile !== '')
                  return record.mobile.replace(phonePattern, '$1-$2-$3');
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
              title: t('table.vendorProductName'),
              width: 216,
              render: (_, record) => record.product_name,
            },
            {
              title: t('table.option'),
              width: 136,
              render: (_, record) => record.product_option,
            },
            {
              title: t('table.type'),
              width: 136,
              render: (_, record) => (
                <TurtleTableSelect
                  items={category}
                  value={record.order_type}
                  onChange={(value: string) => {
                    setCart({
                      ...cart,
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
              title: t('table.count'),
              width: 136,
              render: (_, record) => (
                <TurtleTableNumberInput
                  value={Number(record.product_count)}
                  step={1}
                  onChange={(value: valueType) => {
                    setCart({
                      ...cart,
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
              title: t('table.price'),
              width: 136,
              align: 'right',
              render: (_, record) => record.product_price,
            },
            {
              title: t('table.memo'),
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

const marginRight = css`
  margin-right: 6px;
`;

export default FailTab;

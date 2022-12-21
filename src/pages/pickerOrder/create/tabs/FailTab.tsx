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

  /**
   * 클릭한 테이블 Row를 찾는 함수
   * @param store 발주데이터를 가지고 있는 쇼핑몰 데이터
   * @param order 발주데이터
   * @param record 클릭한 row의 데이터
   * @returns 클릭한 발주의 row와 일치하는지를 확인. 일치하면 true 아니면 false
   */
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
    return failListOutput().filter(
      (item) =>
        item.rt_store_name.includes(searchQuery.search_string) ||
        item.vendor_name.includes(searchQuery.search_string) ||
        item.vendor_address.includes(searchQuery.search_string),
    );
  }, [cart.failList, searchQuery]);

  /**
   * 휴대전화번호 Input element
   * */
  const failTablePhoneNumberInput = (record: FailListForOutput) => {
    return (
      <TurtleTablePhoneNumberInput
        placeholder={t('table.mobile')}
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

  const inputMemo = (newMemo: string) => {
    const clickRow = failListOutput().find((item) => item.id === selectRowID);
    if (clickRow) {
      setCart({
        ...cart,
        failList: cart.failList.map((failItem) => ({
          ...failItem,
          orders: failItem.orders.map((order) => ({
            ...order,
            memo: searchSameRow(failItem, order, clickRow)
              ? newMemo
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
  };

  const moveOrderFromFailtoSuccess = () => {
    const failToSuccessRecord = failListOutput()[failToSuccessRowData.id];
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
  };

  const modalItems = [
    {
      title: t('table.vendor'),
      content:
        failListOutput().length !== 0
          ? failListOutput()[failToSuccessRowData.id].vendor_name
          : '',
    },
    {
      title: t('table.address'),
      content:
        failListOutput().length !== 0
          ? failListOutput()[failToSuccessRowData.id].vendor_address
          : '',
    },
    {
      title: t('table.mobile'),
      content: failToSuccessRowData.mobile ?? '',
    },
  ];

  return (
    <>
      <OrderMemoModal
        visible={memoModalvisible}
        close={closeMemoModal}
        defaultValue={
          failListOutput().find((item) => item.id === selectRowID)?.memo ?? ''
        }
        onOk={(value) => inputMemo(value)}
      />
      {failListOutput().length !== 0 && (
        <AddOrderFailtoSuccessModal
          title={t('description.should I add it as account information?')}
          description={[
            t(
              'description.add the mobile phone number you entered as your account information',
            ),
            t(
              `description.after addition, the client's order is classified as successful`,
            ),
          ]}
          visible={failtoSuccessModailvisible}
          onCancel={closeFailToSuccessModal}
          items={modalItems}
          onOk={() => moveOrderFromFailtoSuccess()}
        />
      )}
      <Tabs.TabPane {...props}>
        <Table
          scroll={{ x: 950, y: 'auto', scrollToFirstRowOnChange: true }}
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
                  <Col>
                    <TurtleSearchInput
                      placeholder={t(
                        'placeholder.search by store name, product name, mobile',
                      )}
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
              render: (_, record) => record.rt_store_name,
            },
            {
              title: t('table.vendorName'),
              render: (_, record) => record.vendor_name,
            },
            {
              title: t('table.vendorAddress'),
              render: (_, record) => record.vendor_address,
            },
            {
              title: t('table.mobile'),
              width: 140,
              render: (_, record) => {
                const failList = failListOutput();
                const vendorNameisSameList: FailListForOutput[] = [];
                failList.map((failItem) => {
                  if (failItem.vendor_name === record.vendor_name)
                    vendorNameisSameList.push(failItem);
                });

                const firstTurnItem = vendorNameisSameList.filter(
                  (item) => item.id < record.id && item.id !== record.id,
                );

                if (firstTurnItem.length === 0)
                  return failTablePhoneNumberInput(record);

                return null;
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
              render: (_, record) => (
                <TurtleTableNumberInput
                  value={Number(record.product_count)}
                  step={1}
                  onChange={(value: valueType | null) => {
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
              align: 'right',
              render: (_, record) =>
                Number(record.product_price).toLocaleString(),
            },
            {
              title: t('table.memo'),
              align: 'center',
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

import { StoreOrderItemExcelParsing } from '@apis/orderAPI';
import {
  TurtleFormSelect,
  TurtleTableNumberInput,
  TurtleTableTitle,
} from '@components/element';
import TurtleTablePhoneNumberInput from '@components/element/input/TurtleTablePhoneNumberInput';
import useModal from '@hooks/useModal';
import useOrderCart from '@hooks/useOrderCart';
import { notNumPattern, phonePattern } from '@utils/pattern';
import { message, Table, TabPaneProps, Tabs } from 'antd';
import { useState } from 'react';

import AddOrderFailtoSuccessModal from '../modals/AddOrderFailtoSuccessModal';

interface Props extends TabPaneProps {
  loading: boolean;
}

function FailTab({ loading, ...props }: Props) {
  const { cart, setCart, failList, setFailList } = useOrderCart();
  const [visible, open, close] = useModal();
  const [failData, setFailData] = useState({
    data: {
      id: 0,
      store_id: 0,
      store_name: '',
      vendor_name: '',
      vendor_address: '',
      mobile: '',
      vendor_product: '',
      product_option: '',
      type: '',
      count: '',
      price: '',
      memo: '',
    },
    mobile: '',
  });
  return (
    <Tabs.TabPane {...props}>
      <AddOrderFailtoSuccessModal
        visible={visible}
        onCancel={close}
        onOk={() => {
          const failtoSuccessStores = cart.failList
            .filter((store) => store.rt_store_id === failData.data.store_id)
            .map<StoreOrderItemExcelParsing>((store) => ({
              rt_store_id: store.rt_store_id,
              rt_store_name: store.rt_store_name,
              orders: store.orders.map((order) => {
                if (
                  order.vendor_name === failData.data.vendor_name &&
                  order.vendor_address === failData.data.vendor_address
                ) {
                  return {
                    ...order,
                    mobile: failData.mobile.replaceAll('-', ''),
                  };
                }
                return order;
              }),
            }));

          setCart({
            successList: cart.successList.map<StoreOrderItemExcelParsing>(
              (item) => {
                const failTosuccessStore = failtoSuccessStores.find(
                  (store) => store.rt_store_id === item.rt_store_id,
                );

                if (failTosuccessStore)
                  return {
                    ...item,
                    orders: item.orders.concat(
                      ...failTosuccessStore.orders.filter(
                        (order) => order.mobile !== '',
                      ),
                    ),
                  };

                return item;
              },
            ),
            failList: cart.failList,
          });
          setFailList(
            failList.filter(
              (data) =>
                data.vendor_name !== failData.data.vendor_name &&
                data.vendor_address !== failData.data.vendor_address,
            ),
          );
          message.success('성공으로 변경되었습니다.');
          close();
        }}
        failData={failData}
        title="성공으로 변환"
        description={[
          '올바른 휴대전화번호인가요?',
          '입력한 휴대전화번호로 발주데이터가 입력됩니다.',
        ]}
      />
      <Table
        scroll={{ x: 1608, y: 398, scrollToFirstRowOnChange: true }}
        loading={loading}
        size="small"
        rowKey={(record) => record.id}
        dataSource={failList}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
        }}
        title={() => (
          <TurtleTableTitle totalCount={cart.failList.length ?? 0} />
        )}
        columns={[
          {
            title: '쇼핑몰',
            width: '148px',
            render: (_, record) => record.store_name,
          },
          {
            title: '거래처명',
            width: '136px',
            render: (_, record) => record.vendor_name,
          },
          {
            title: '거래처 주소',
            width: '196px',
            render: (_, record) => record.vendor_address,
          },
          {
            title: '휴대전화번호',
            width: '156px',
            render: (_, record) => {
              if (
                record.id !== 0 &&
                failList[record.id - 1].store_name === record.store_name &&
                failList[record.id - 1].vendor_name === record.vendor_name &&
                failList[record.id - 1].vendor_address === record.vendor_address
              ) {
                return;
              }

              return (
                <TurtleTablePhoneNumberInput
                  placeholder="휴대전화번호 입력"
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value
                      .replace(notNumPattern, '')
                      .replace(phonePattern, '$1-$2-$3');

                    if (e.currentTarget.value.length === 13) {
                      setFailData({
                        data: record,
                        mobile: e.currentTarget.value,
                      });
                      open();
                    }
                  }}
                />
              );
            },
          },
          {
            title: '거래처 상품명',
            width: '216px',
            render: (_, record) => record.vendor_product,
          },
          {
            title: '옵션',
            width: '136px',
            render: (_, record) => record.product_option,
          },
          {
            title: '분류',
            width: '136px',
            render: (_, record) => (
              <TurtleFormSelect
                items={[
                  {
                    value: '발주',
                    name: '발주',
                  },
                  {
                    value: '미송',
                    name: '미송',
                  },
                  {
                    value: '반품',
                    name: '반품',
                  },
                  {
                    value: '교환',
                    name: '교환',
                  },
                  {
                    value: '샘플',
                    name: '샘플',
                  },
                  {
                    value: '픽업',
                    name: '픽업',
                  },
                  {
                    value: '기타',
                    name: '기타',
                  },
                ]}
                value={record.type}
                onChange={(value: string) => {
                  //보여지는 실패케이스 테이블 데이터
                  setFailList([
                    ...failList.map((item) => ({
                      ...item,
                      type: record.id === item.id ? value : item.type,
                    })),
                  ]);

                  //실제로 보내는 데이터
                  setCart({
                    successList: cart.successList,
                    failList: cart.failList.map((item) => ({
                      ...item,
                      orders:
                        item.rt_store_id === record.store_id
                          ? item.orders.map((order) => ({
                              ...order,
                              order_type:
                                order.vendor_name === record.vendor_name
                                  ? value
                                  : order.order_type,
                            }))
                          : item.orders,
                    })),
                  });
                }}
              />
            ),
          },
          {
            title: '요청 수량',
            width: '136px',
            render: (_, record) => (
              <TurtleTableNumberInput
                step={1}
                value={record.count}
                onChange={(value) => {
                  setFailList([
                    ...failList.map((item) => ({
                      ...item,
                      count:
                        record.id === item.id && value !== null
                          ? value.toString()
                          : item.count,
                    })),
                  ]);
                }}
              />
            ),
          },
          {
            title: '가격',
            width: '136px',
            align: 'right',
            render: (_, record) => record.price,
          },
          {
            title: '메모',
            width: '212px',
            render: (_, record) => record.memo,
          },
        ]}
      />
    </Tabs.TabPane>
  );
}

export default FailTab;

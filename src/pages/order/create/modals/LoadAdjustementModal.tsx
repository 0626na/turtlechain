import React, { useEffect, useState } from 'react';
import adjustmentAPI, { AdjustmentItemShow } from '@apis/adjustmentAPI';
import { SearchFilter, TurtleContentModal } from '@components/combine';
import useStore from '@hooks/useStore';
import { Col, Row, Table } from 'antd';
import { t } from 'i18next';
import { useMutation, useQuery } from 'react-query';
import moment from 'moment';
import { MemoIcon, PrimaryButton, TurtleTableTitle } from '@components/element';
import useModal from '@hooks/useModal';
import OrderMemoModal from '@components/combine/modal/OrderMemoModal';
import { message } from '@utils/message';
import { css } from '@emotion/react';
import useOrderCart from '@hooks/useOrderCart';
import { StoreOrder } from '@apis/orderAPI';
import vendorAPI from '@apis/vendorAPI';

interface Props {
  visible: boolean;
  onClose: () => void;
}

function LoadAdjustementModal({ visible, onClose }: Props) {
  const typeOptions = {
    exchange: t('type.adjustment.process type.exchange'),
    takeback: t('type.adjustment.process type.takeback'),
    reserve: t('type.adjustment.process type.reserve'),
  };

  const { store } = useStore();
  const { cart, setCart } = useOrderCart();
  const [searchQuery, setSearchQuery] = useState({
    search_string: '',
  });
  const [selectedID, setSelectedID] = useState(-1);
  const [selectedList, setSelectedList] = useState<AdjustmentItemShow[]>([]);

  const [memoModalVisible, openMemoModal, closeMemoModal] = useModal();

  /**
   * 매입조정 데이터 가져오는 react-query
   */
  const { data: adjustmentData, refetch } = useQuery(
    ['getAdjustment', searchQuery],
    () =>
      adjustmentAPI.getList({
        rt_store_id: Number(store.selected?.id),
        start_date: moment().subtract(1, 'week').format('YYYY/MM/DD'),
        end_date: moment().format('YYYY/MM/DD'),
        is_cleared: '',
        search_string: searchQuery.search_string,
      }),
    {
      enabled: !!store.selected && visible,
    },
  );

  const { data: vendorList } = useQuery(
    'getVendorList',
    () =>
      vendorAPI.getList({
        page: 1,
        page_size: 300,
        search_string: '',
        rt_store_id: store.selected?.id,
      }),
    {
      enabled: !!store.selected?.id,
    },
  );

  /**
   * 매입조정 데이터 발주서에 등록하는 react-query
   */
  const { mutate } = useMutation(adjustmentAPI.update, {
    onSuccess: () => {
      message.success(t('message.successMemoInput'));
      refetch();
      closeMemoModal();
    },
  });

  useEffect(() => setSelectedList([]), [visible]);

  return (
    <>
      <OrderMemoModal
        visible={memoModalVisible}
        close={closeMemoModal}
        defaultValue={
          adjustmentData?.data.adjustment_list.find(
            (store) => store.id === selectedID,
          )?.memo ?? ''
        }
        onOk={(value) => {
          mutate({ id: selectedID, memo: value });
        }}
      />
      <TurtleContentModal
        visible={visible}
        onClose={onClose}
        size="large"
        title={t('title.load adjustment')}
      >
        <Table
          rowKey={(record) => record.id}
          title={() => (
            <TurtleTableTitle
              totalCount={adjustmentData?.data.total_count ?? 0}
              rightContent={
                <SearchFilter
                  placeholder={t('placeholder.input vendor name')}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              }
            />
          )}
          size="small"
          rowSelection={{
            selectedRowKeys: selectedList.map((item) => item.id),
            onChange: (_, selectedRow) => {
              setSelectedList(selectedRow);
            },
          }}
          pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
          scroll={{ x: 850, y: 'auto' }}
          dataSource={adjustmentData?.data.adjustment_list}
          columns={[
            {
              title: t('table.type'),
              width: 100,
              render: (_, record) => typeOptions[record.type],
            },
            {
              title: t('table.vendorName'),
              width: 130,
              render: (_, record) => record.vendor_info.vendor_name,
            },
            {
              title: t('table.productName'),
              width: 240,
              render: (_, record) => record.product_info.name,
            },
            {
              title: t('table.vendorProductName'),
              width: 240,
              render: (_, record) => record.product_info.vendor_product_name,
            },
            {
              title: t('table.option'),
              width: 136,
              render: (_, record) => record.product_info.option,
            },
            {
              title: t('table.amount'),
              width: 136,
              align: 'right',
              render: (_, record) => record.product_info.price,
            },
            {
              title: t('table.requestCount'),
              width: 116,
              align: 'right',
              render: (_, record) => record.count,
            },
            {
              title: t('table.memo'),
              width: 100,
              align: 'center',
              render: (_, record) => (
                <MemoIcon
                  value={record.memo ?? ''}
                  onClick={() => {
                    setSelectedID(record.id);
                    openMemoModal();
                  }}
                />
              ),
            },
          ]}
        />
        <Row css={css({ display: 'flex', justifyContent: 'flex-end' })}>
          <Col>
            <PrimaryButton
              onClick={() => {
                if (!cart.successList.length) {
                  setCart({
                    ...cart,
                    successList: [
                      {
                        rt_store_id: Number(store.selected?.id),
                        rt_store_name: String(store.selected?.name),
                        orders: selectedList.map<StoreOrder>((item, index) => ({
                          order_id: index,
                          vendor_name: item.vendor_info.vendor_name,
                          vendor_address: item.vendor_info.vendor_address,
                          vendor_mobile: '',
                          mobile:
                            vendorList?.data.vendor_list.find(
                              (vendor) => vendor.id === item.vendor_info.id,
                            )?.vendor_phone.phone ?? '',
                          product_name: item.product_info.name,
                          product_option: item.product_info.option,
                          product_price: item.product_info.price,
                          product_count: item.count,
                          order_type: item.type,
                          creation_type: 'adjustment',
                          memo: item.memo,
                          ws_store_info: [],
                        })),
                        type: 'excel',
                      },
                    ],
                  });
                } else {
                  setCart({
                    ...cart,
                    successList: [
                      {
                        ...cart.successList[0],
                        orders: [
                          ...cart.successList[0].orders,
                          ...selectedList.map<StoreOrder>((item, index) => ({
                            order_id: cart.successList[0].orders.length + index,
                            vendor_name: item.vendor_info.vendor_name,
                            vendor_address: item.vendor_info.vendor_address,
                            vendor_mobile: '',
                            mobile:
                              vendorList?.data.vendor_list.find(
                                (vendor) => vendor.id === item.id,
                              )?.vendor_phone.phone ?? '',
                            product_name: item.product_info.name,
                            product_option: item.product_info.option,
                            product_price: item.product_info.price,
                            product_count: item.count,
                            order_type: item.type,
                            creation_type: 'adjustment',
                            memo: item.memo,
                            ws_store_info: [],
                          })),
                        ],
                      },
                    ],
                  });
                }

                message.success(t('message.add to order'));
                onClose();
              }}
            >
              발주서에 추가하기
            </PrimaryButton>
          </Col>
        </Row>
      </TurtleContentModal>
    </>
  );
}

export default LoadAdjustementModal;

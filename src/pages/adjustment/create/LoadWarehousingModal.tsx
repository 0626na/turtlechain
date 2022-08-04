import moment from 'moment';
import { t } from 'i18next';
import { Col, DatePicker, Input, message, Row, Table, Typography } from 'antd';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';

import { AdjustmentItem } from '@apis/adjustmentAPI';
import warehousingAPI, {
  RequestGetItem,
  WarehousingItem,
} from '@apis/warehousingAPI';
import { TurtleButton, TurtleModal } from '@components/common';

interface Props {
  visible: boolean;
  closeModal: () => void;
  onItemAdd: (item: AdjustmentItem) => boolean;
}

function LoadWarehousingModal({ visible, closeModal, onItemAdd }: Props) {
  const [selectedItemList, setSelectedItemList] = useState<WarehousingItem[]>(
    [],
  );
  const [itemList, setItemList] = useState<WarehousingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<RequestGetItem>({
    product_name: '',
    start_date: moment().subtract(1, 'weeks').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    page: 1,
  });

  // 입고상품 불러오기.
  const getWarehousingItemQuery = useQuery(
    ['getWarehousingItem', searchQuery],
    () => warehousingAPI.getItem(searchQuery),
    {
      enabled: visible && searchQuery.product_name !== '',
      onSuccess: (data) => {
        setItemList([...data.data.item_list]);
      },
    },
  );

  const handleRowClick = useCallback(
    (record: WarehousingItem) => {
      if (selectedItemList.find((item) => item.id === record.id)) {
        setSelectedItemList((selectedItemList) =>
          selectedItemList.filter((item) => item.id !== record.id),
        );
        return;
      }
      setSelectedItemList((selectedItemList) => [...selectedItemList, record]);
    },
    [setSelectedItemList, selectedItemList],
  );

  const handleAddBtnClick = useCallback(() => {
    if (selectedItemList.length === 0) {
      message.info('선택된 상품이 없습니다.');
      return;
    }

    // WarehousingItem -> AdjustmentProduct 타입 변환해서 넣어줌
    selectedItemList.forEach((item) => {
      onItemAdd({
        vendor_id: item.vendor_info.id,
        vendor_name: item.vendor_info.vendor_name,
        vendor_address: item.vendor_info.vendor_address,
        warehousing_item_id: item.id,
        product_id: item.product_info.id,
        product_name: item.product_info.name,
        vendor_product_name: item.product_info.vendor_product_name,
        product_option: item.product_info.option,
        product_price: item.product_info.price,
        product_count: 0,
        product_count_max: item.count,
        product_code: item.product_info.product_code,
        is_vat_included: item.is_vat_included,
        type: '',
        memo: '',
      });
    });
    closeModal();
  }, [selectedItemList, onItemAdd, closeModal]);

  return (
    <TurtleModal
      centered
      width="90%"
      title={t('warehousing.load')}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      getContainer={false}
      bodyStyle={{ height: '90vh', overflowY: 'auto' }}
    >
      {/*
       * 입고상품 검색
       */}
      <Input.Search
        style={{ maxWidth: 300 }}
        placeholder={t('placeholder.product name')}
        size="small"
        onChange={(e) => {
          // 검색인풋을 비우게되면 선택된 아이템만 보여준다.
          if (e.target.value === '') {
            setItemList([...selectedItemList]);
          }
        }}
        onSearch={(value) => {
          setSearchQuery({ ...searchQuery, product_name: value });
        }}
      />

      {/*
       * 총 갯수 + 날짜 지정
       */}

      <Row
        style={{
          marginTop: 20,
          marginBottom: 12,
        }}
        justify="space-between"
        align="middle"
      >
        <Col style={{ fontSize: 13 }}>
          <Typography.Text>
            총{' '}
            <Typography.Text style={{ color: '#32ACDD' }}>
              {getWarehousingItemQuery.data?.data.total_count ?? 0}
            </Typography.Text>
            건
          </Typography.Text>
        </Col>
        <Col>
          <DatePicker.RangePicker
            size="small"
            allowClear={false}
            defaultValue={[
              moment(searchQuery.start_date),
              moment(searchQuery.end_date),
            ]}
            onChange={(_, [start_date, end_date]) => {
              setSearchQuery({ ...searchQuery, start_date, end_date });
            }}
          />
        </Col>
      </Row>

      {/*
       *입고 상품 리스트 테이블
       */}

      <Table
        style={{ height: '80%' }}
        size="small"
        loading={getWarehousingItemQuery.isLoading}
        pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
        dataSource={itemList}
        rowKey={(record) => record.id}
        scroll={{ y: 'auto' }}
        // title={() => (
        //   <TurtleTableTitle
        //     count={getWarehousingItemQuery.data?.data.total_count ?? 0}
        //   >
        //     <DatePicker.RangePicker
        //       size="small"
        //       allowClear={false}
        //       defaultValue={[
        //         moment(searchQuery.start_date),
        //         moment(searchQuery.end_date),
        //       ]}
        //       onChange={(_, [start_date, end_date]) => {
        //         setSearchQuery({ ...searchQuery, start_date, end_date });
        //       }}
        //     />
        //   </TurtleTableTitle>
        // )}
        rowSelection={{
          selectedRowKeys: selectedItemList.map((item) => item.id),
          onSelect: handleRowClick,
          hideSelectAll: true,
        }}
        onRow={(record) => ({
          onClick: () => {
            handleRowClick(record);
          },
        })}
        columns={[
          {
            ellipsis: true,
            title: t('warehousing.date'),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: t('vendor.name'),
            render: (_, record) => record.vendor_info.vendor_address,
          },
          {
            ellipsis: true,
            title: t('product.name'),
            render: (_, record) => record.product_info.product_code,
          },
          {
            ellipsis: true,
            title: t('product.vendor product name'),
            render: (_, record) => record.product_info.name,
          },
          {
            ellipsis: true,
            title: t('product.option'),
            render: (_, record) => record.product_info.option,
          },
          {
            ellipsis: true,
            title: t('product.price'),
            render: (_, record) => record.product_info.vendor_product_name,
          },
          {
            ellipsis: true,
            title: t('product.count'),
            render: (_, record) => record.count,
          },
        ]}
      />

      <Row style={{ marginTop: 32 }} justify="end" align="middle">
        <Col style={{ marginRight: 24 }}>
          <Typography.Text
            style={{ color: ' #6B6D73', marginRight: 8, fontSize: 15 }}
          >
            총 선택 상품
          </Typography.Text>
          <Typography.Text style={{ fontWeight: 700 }}>11111원</Typography.Text>
        </Col>

        <Col>
          <TurtleButton type="default" onClick={handleAddBtnClick}>
            {t('button.add product')}
          </TurtleButton>
        </Col>
      </Row>
    </TurtleModal>
  );
}

export default LoadWarehousingModal;

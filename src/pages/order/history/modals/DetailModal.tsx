import React from 'react';
import orderAPI from '@apis/orderAPI';
import { TurtleContentModal } from '@components/combine';
import TurtleStatistics from '@components/element/TurtleStatistics';
import { Table } from 'antd';
import moment from 'moment';
import { useQuery } from 'react-query';
import { TurtleTableTitle } from '@components/element';

interface Props {
  visible: boolean;
  onclose: () => void;
  sheetId: number;
}

function DetailModal({ visible, onclose, sheetId }: Props) {
  const getOrderHistoryQuery = useQuery(
    ['getOrderHistory', sheetId],
    () => orderAPI.getOrderHistory({ sheet_id: sheetId }),
    {
      enabled: sheetId !== 0,
    },
  );
  return (
    <>
      <TurtleContentModal
        title="발주내역 상세보기"
        size="large"
        onClose={onclose}
        visible={visible}
      >
        <TurtleStatistics
          value={[
            {
              title: '쇼핑몰',
              value:
                getOrderHistoryQuery.data?.data.order_sheet.rt_store_name ?? '',
            },
            {
              title: '발주 일자',
              value:
                moment(
                  getOrderHistoryQuery.data?.data.order_sheet.request_date,
                ).format('YYYY-MM-DD') ?? '',
            },
            {
              title: '발주 거래처',
              value:
                getOrderHistoryQuery.data?.data.order_sheet.total_store_count.toString() ??
                '0',
            },
            {
              title: '발주수량 합계',
              value:
                getOrderHistoryQuery.data?.data.order_sheet.total_item_subcount.toString() ??
                '0',
            },
            {
              title: '발주금액 합계',
              value:
                getOrderHistoryQuery.data?.data.order_sheet.total_success_price.toLocaleString() ??
                '0',
            },
          ]}
        />
        <Table
          dataSource={getOrderHistoryQuery.data?.data.successes}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
          }}
          title={() => (
            <TurtleTableTitle
              totalCount={getOrderHistoryQuery.data?.data.successes.length ?? 0}
            />
          )}
          columns={[
            {
              title: '거래처명',
              render: (_, record) => record.vendor_name,
            },
            {
              title: '거래처 주소',
              render: (_, record) => record.address,
            },
            {
              title: '휴대전화 번호',
              render: (_, record) => record.mobile,
            },
            {
              title: '거래처 상품명',
              render: (_, record) => record.name,
            },
            {
              title: '옵션',
              render: (_, record) => record.option,
            },
            {
              title: '분류',
              render: (_, record) => record.type,
            },
            {
              title: '요청 수량',
              render: (_, record) => record.count.toLocaleString(),
            },
            {
              title: '공급가',
              render: (_, record) => record.price.toLocaleString(),
            },
            {
              title: '메모',
            },
          ]}
        />
      </TurtleContentModal>
    </>
  );
}

export default DetailModal;

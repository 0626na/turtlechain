import orderAPI from '@apis/orderAPI';
import {
  TertiaryButton,
  TurtleCard,
  TurtleIcon,
  TurtleTag,
} from '@components/element';
import { TurtleTableTitle } from '@components/element';
import { PageContent, PageTitle } from '@layout/page';
import { Table } from 'antd';
import { PageHeader } from '@layout/page';
import { t } from 'i18next';
import moment from 'moment';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import DetailModal from './modals/DetailModal';
import useModal from '@hooks/useModal';

function PageBody() {
  const [sheetId, setSheetId] = useState(0);
  const [detailModalVisible, openDetailModal, closeDetailModal] = useModal();
  const getOrderSheetsQuery = useQuery('getOrderSheetsQuery', () =>
    orderAPI.getOrderSheets({
      start_date: moment().subtract(1, 'week').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    }),
  );

  return (
    <>
      <DetailModal
        visible={detailModalVisible}
        onclose={closeDetailModal}
        sheetId={sheetId}
      />
      <PageHeader title={`${t('order.history')}`} />
      <PageTitle
        title={`${t('order.present')}`}
        buttons={[
          <TertiaryButton
            text="발주서 다운"
            disabled
            icon={<TurtleIcon name="download" />}
          />,
        ]}
      />
      <PageContent>
        {/*
         *  결제현황
         */}
        <TurtleCard
          value={[
            {
              color: 'cyan',
              title: '성공',
              count:
                getOrderSheetsQuery.data?.data.order_sheet_list.reduce(
                  (acc, sheet) => acc + sheet.total_store_count,
                  0,
                ) ?? 0,

              price:
                getOrderSheetsQuery.data?.data.order_sheet_list.reduce(
                  (acc, sheet) => acc + sheet.total_success_price,
                  0,
                ) ?? 0,
            },
            {
              color: 'orange',
              title: '실패',
              count:
                getOrderSheetsQuery.data?.data.order_sheet_list.reduce(
                  (acc, sheet) => acc + sheet.total_fail_count,
                  0,
                ) ?? 0,
              price:
                getOrderSheetsQuery.data?.data.order_sheet_list.reduce(
                  (acc, sheet) => acc + sheet.total_fail_price,
                  0,
                ) ?? 0,
            },
          ]}
        />

        <Table
          size="small"
          scroll={{ y: 432, x: 1608 }}
          rowKey={(record) => record.id}
          dataSource={getOrderSheetsQuery.data?.data.order_sheet_list}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                setSheetId(record.id);
                openDetailModal();
              },
            };
          }}
          title={() => (
            <TurtleTableTitle
              totalCount={
                getOrderSheetsQuery.data?.data.order_sheet_list.length ?? 0
              }
            />
          )}
          columns={[
            {
              ellipsis: true,
              width: 108,
              title: '분류',
              render: (_, record) =>
                record.type === 'new' ? (
                  <TurtleTag color="orderHistoryCategoryFirst">1차</TurtleTag>
                ) : (
                  <TurtleTag color="orderHistoryCategorySecond">2차</TurtleTag>
                ),
            },
            {
              ellipsis: true,
              width: 176,
              title: '발주 일자',
              render: (_, record) =>
                moment(record.created_time).format('YYYY-MM-DD'),
            },
            {
              ellipsis: true,
              width: 176,
              title: '쇼핑몰',
              render: (_, record) => record.rt_store_name,
            },
            {
              ellipsis: true,
              align: 'right',
              width: 136,
              title: '거래처 수',
              render: (_, record) => record.total_store_count,
            },
            {},
          ]}
        />
      </PageContent>
    </>
  );
}

export default PageBody;

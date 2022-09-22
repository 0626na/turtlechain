import orderAPI from '@apis/orderAPI';
import { TeriaryButton, TurtleCard, TurtleIcon } from '@components/element';
import { PageContent, PageTitle } from '@layout/page';
import { PageHeader, Table } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import React from 'react';
import { useQuery } from 'react-query';

function PageBody() {
  const getOrderSheetsQuery = useQuery('getOrderSheetsQuery', () =>
    orderAPI.getOrderSheets({
      start_date: moment().subtract(1, 'week').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
    }),
  );
  return (
    <>
      <PageHeader title={`${t('order.history')}`} />
      <PageTitle
        title={`${t('order.present')}`}
        buttons={[
          <TeriaryButton
            text="발주서 다운"
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
                getOrderSheetsQuery.data?.data.order_sheet_list.length ?? 0,

              price: 0,
            },
            {
              color: 'orange',
              title: '실패',
              count: 0,
              price: 0,
            },
          ]}
        />

        <Table
          size="small"
          dataSource={getOrderSheetsQuery.data?.data.order_sheet_list}
          columns={[
            {
              ellipsis: true,
              title: '분류',
              render: (_, record) => (record.type === 'new' ? '1차' : '2차'),
            },
            {
              ellipsis: true,
              title: '발주 일자',
              render: (_, record) =>
                moment(record.created_time).format('YYYY-MM-DD'),
            },
            {
              ellipsis: true,
              title: '쇼핑몰',
              render: (_, record) => record.rt_store_name,
            },
            {
              ellipsis: true,
              title: '거래처 수',
              render: (_, record) => record.total_store_count,
            },
          ]}
        />
      </PageContent>
    </>
  );
}

export default PageBody;

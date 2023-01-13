import orderAPI from '@apis/orderAPI';
import { TertiaryButton, TurtleCard, TurtleIcon } from '@components/element';
import { TurtleTableTitle } from '@components/element';
import { PageContent, PageTitle } from '@layout/page';
import { Table } from 'antd';
import { t } from 'i18next';
import moment from 'moment';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';
import DetailModal from '@pages/pickerOrder/history/modals/DetailModal';

function PageBody() {
  const [sheetId, setSheetId] = useState(0);
  const [detailModalVisible, openDetailModal, closeDetailModal] = useModal();
  const { store } = useStore();
  const getOrderSheetsQuery = useQuery(
    'getOrderSheetsQuery',
    () =>
      orderAPI.getOrderSheets({
        start_date: moment().subtract(1, 'week').format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        rt_store_id: Number(store.selected?.id),
      }),
    {
      enabled: !!store.selected,
    },
  );
  return (
    <>
      {!!sheetId && (
        <DetailModal
          visible={detailModalVisible}
          onclose={closeDetailModal}
          sheetId={sheetId}
        />
      )}
      <PageTitle
        title="발주현황"
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
                getOrderSheetsQuery.data?.data.order_sheet_list.length ?? 0,

              price:
                getOrderSheetsQuery.data?.data.order_sheet_list.reduce(
                  (acc, sheet) => acc + sheet.order_price,
                  0,
                ) ?? 0,
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
          rowKey={(record) => record.id}
          dataSource={getOrderSheetsQuery.data?.data.order_sheet_list}
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
              title: '분류',
              render: (_, record) => (record.type === 'new' ? '1차' : '2차'),
            },
            {
              ellipsis: true,
              title: '발주 일자',
              render: (_, record) =>
                moment(record.request_date).format('YYYY-MM-DD'),
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

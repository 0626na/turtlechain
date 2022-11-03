import orderAPI from '@apis/orderAPI';
import {
  TertiaryButton,
  TurtleCard,
  TurtleIcon,
  TurtlePrimaryRangePicker,
  TurtleSearchInput,
  TurtleSearchSelect,
  TurtleTag,
} from '@components/element';
import { TurtleTableTitle } from '@components/element';
import { PageContent, PageTitle } from '@layout/page';
import { Col, DatePicker, Row, Table } from 'antd';
import { PageHeader } from '@layout/page';
import { t } from 'i18next';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import DetailModal from './modals/DetailModal';
import useModal from '@hooks/useModal';
import { css } from '@emotion/react';

function PageBody() {
  const options = [
    {
      value: 'entire',
      name: '전체',
    },
    {
      value: 'new',
      name: '1차',
    },
    {
      value: 'modify',
      name: '2차',
    },
  ];

  const [sheetId, setSheetId] = useState(0);
  const [searchQuery, setSearchQuery] = useState({
    type: 'entire',
    start_date: moment().subtract(1, 'week').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
  });

  const [detailModalVisible, openDetailModal, closeDetailModal] = useModal();
  const getOrderSheetsQuery = useQuery(
    ['getOrderSheetsQuery', searchQuery.end_date, searchQuery.end_date],
    () =>
      orderAPI.getOrderSheets({
        start_date: searchQuery.start_date,
        end_date: searchQuery.end_date,
      }),
  );

  const filteredList = useMemo(() => {
    if (searchQuery.type === 'entire')
      return getOrderSheetsQuery.data?.data.order_sheet_list ?? [];

    if (searchQuery.type === 'new')
      return (
        getOrderSheetsQuery.data?.data.order_sheet_list.filter(
          (sheet) => sheet.type === searchQuery.type,
        ) ?? []
      );

    if (searchQuery.type === 'modify')
      return (
        getOrderSheetsQuery.data?.data.order_sheet_list.filter(
          (sheet) => sheet.type === searchQuery.type,
        ) ?? []
      );
  }, [getOrderSheetsQuery.data?.data.order_sheet_list, searchQuery]);

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
          dataSource={filteredList}
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
              rightContent={
                <Row>
                  <Col css={css({ marginRight: 16 })}>
                    <TurtleSearchSelect
                      items={options}
                      value={searchQuery.type}
                      onChange={(value) =>
                        setSearchQuery({ ...searchQuery, type: value })
                      }
                    />
                  </Col>
                  <Col>
                    <TurtlePrimaryRangePicker
                      onChange={(_, [start_date, end_date]) =>
                        setSearchQuery({ ...searchQuery, start_date, end_date })
                      }
                    />
                  </Col>
                </Row>
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

import orderAPI, { OrderSheetList } from '@apis/orderAPI';
import {
  TertiaryButton,
  TurtleCard,
  TurtleIcon,
  TurtleTag,
} from '@components/element';
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
import { css } from '@emotion/react';
import { theme } from '@styles/theme';
import WholesalerMessageModal from '@pages/pickerOrder/history/modals/WholesalerMessageModal';

function PageBody() {
  const [sheetId, setSheetId] = useState(0);
  const [selectOrderSheet, setSelectOrderSheet] = useState<OrderSheetList>();
  const [detailModalVisible, openDetailModal, closeDetailModal] = useModal();
  const [
    detailMessageModalVisible,
    openDetailMessageModal,
    closeDetailMessageModal,
  ] = useModal();

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
      {!!selectOrderSheet && (
        <WholesalerMessageModal
          visible={detailMessageModalVisible}
          onClose={closeDetailMessageModal}
          sheetID={selectOrderSheet?.id}
          isComment={selectOrderSheet.total_comment_count === 0 ? false : true}
        />
      )}
      <PageTitle
        title={t('title.orderStatus')}
        buttons={[
          <TertiaryButton
            text={t('button.orderDown')}
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
              title: t('title.success'),
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
              title: t('title.fail'),
              count: 0,
              price: 0,
            },
          ]}
        />

        <Table
          size="small"
          rowKey={(record) => record.id}
          dataSource={getOrderSheetsQuery.data?.data.order_sheet_list}
          pagination={{ position: ['bottomCenter'] }}
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
              title: t('table.type'),
              render: (_, record) =>
                record.type === 'new' ? (
                  <TurtleTag color="orderHistoryCategoryFirst">
                    {t('button.orderNew')}
                  </TurtleTag>
                ) : (
                  <TurtleTag color="orderHistoryCategorySecond">
                    {t('button.orderModify')}
                  </TurtleTag>
                ),
            },
            {
              ellipsis: true,
              title: t('table.orderDate'),
              render: (_, record) =>
                moment(record.request_date).format('YYYY-MM-DD'),
            },
            {
              ellipsis: true,
              width: 130,
              align: 'right',
              title: t('table.clientCount'),
              render: (_, record) => record.total_store_count,
            },
            {
              title: t('table.vendorMessage'),
              width: 100,
              align: 'center',
              render: (_, record) => {
                return record.total_comment_count !== 0 ? (
                  <div
                    css={css({
                      width: '100%',
                      ':hover': {
                        cursor: 'pointer',
                        backgroundColor: theme.greenBg,
                      },
                    })}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectOrderSheet(record);
                      openDetailMessageModal();
                    }}
                  >
                    <TurtleIcon name="memoMessage" />
                  </div>
                ) : null;
              },
            },
            {},
          ]}
        />
      </PageContent>
    </>
  );
}

export default PageBody;

import moment from 'moment';

import { useQuery } from 'react-query';
import { Col, Row, Table } from 'antd';

import {
  TurtlePrimaryRangePicker,
  TurtleTableTitle,
} from '@components/element';
import { TurtleContentModal } from '@components/combine';

import transactionAPI, { RequestGetItem } from '@apis/transactionAPI';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import TurtleStatistics from '@components/element/TurtleStatistics';
import { aWeekAgo, today } from '@utils/date';

interface Props {
  visible: boolean;
  onClose: () => void;
  vendor_id?: number;
  vendor_name?: string;
}

function DetailModal({ visible, onClose, vendor_id, vendor_name }: Props) {
  const [searchQuery, setSearchQuery] = useState<RequestGetItem>({
    vendor_id,
    start_date: aWeekAgo(),
    end_date: today(),
  });

  // 장부 상세내역 요청
  const { data: { data: transactionDetailList = [] } = {}, isLoading } =
    useQuery(
      ['getTransactionDetail', searchQuery],
      () => transactionAPI.getItem(searchQuery),
      {
        enabled: !!visible && !!searchQuery.vendor_id,
      },
    );

  useEffect(() => {
    if (visible) return;

    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      start_date: aWeekAgo(),
      end_date: today(),
    }));
  }, [visible]);

  return (
    <TurtleContentModal
      size="large"
      title={t('title.ledger detail')}
      visible={visible}
      onClose={onClose}
    >
      <TurtleStatistics
        value={[
          {
            title: t('table.vendorName'),
            value: vendor_name ?? '',
          },
          {
            title: t('table.refundAmount'),
            value: transactionDetailList
              ?.reduce((acc, item) => acc + item.refund_amount, 0)
              .toLocaleString(),
          },
          {
            title: t('table.overpaidAmount'),
            value: transactionDetailList
              .reduce((acc, item) => acc + item.overpaid_amount, 0)
              .toLocaleString(),
          },
          {
            title: t('table.unpaidAmount'),
            value: transactionDetailList
              .reduce((acc, item) => acc + item.unpaid_amount, 0)
              .toLocaleString(),
          },
        ]}
      />

      <Table
        title={() => (
          <TurtleTableTitle
            totalCount={transactionDetailList.length ?? 0}
            totalSubstractAmount={transactionDetailList.reduce(
              (acc, item) => acc + item.overpaid_amount,
              0,
            )}
            totalRefundAmount={transactionDetailList.reduce(
              (acc, item) => acc + item.refund_amount,
              0,
            )}
            totalUnpaidAmount={transactionDetailList.reduce(
              (acc, item) => acc + item.unpaid_amount,
              0,
            )}
            rightContent={
              <Row>
                <Col>
                  <TurtlePrimaryRangePicker
                    value={[
                      moment(searchQuery.start_date),
                      moment(searchQuery.end_date),
                    ]}
                    onChange={(_, dateStrings) => {
                      const start_date = dateStrings[0];
                      const end_date = dateStrings[1];

                      setSearchQuery((searchQuery) => ({
                        ...searchQuery,
                        start_date,
                        end_date,
                      }));
                    }}
                  />
                </Col>
              </Row>
            }
          />
        )}
        size="small"
        scroll={{ y: 500, x: 'auto' }}
        dataSource={transactionDetailList}
        rowKey={(record) => transactionDetailList.indexOf(record)}
        loading={isLoading}
        pagination={false}
        columns={[
          {
            ellipsis: true,
            width: 120,
            title: t('table.createdDate'),
            render: (_, record) => record.created_date,
          },
          {
            ellipsis: true,
            width: 140,
            title: t('table.type'),
            render: (_, record) =>
              t(`type.transaction.${record.transaction_type}`),
          },
          {
            ellipsis: true,
            width: 800,
            title: t('table.memo'),
            render: (_, record) => record.memo,
          },
          {
            ellipsis: true,
            width: 200,
            align: 'right',
            title: t('table.refundAmount'),
            render: (_, record) =>
              record.refund_amount > 0
                ? '+' + record.refund_amount.toLocaleString()
                : record.refund_amount.toLocaleString(),
          },
          {
            ellipsis: true,
            width: 200,
            align: 'right',
            title: t('table.overpaidAmount'),
            render: (_, record) =>
              record.overpaid_amount > 0
                ? `+ ${record.overpaid_amount.toLocaleString()}`
                : record.overpaid_amount.toLocaleString(),
          },
          {
            ellipsis: true,
            width: 200,
            align: 'right',
            title: t('table.unpaidAmount'),
            render: (_, record) =>
              record.unpaid_amount > 0
                ? `+ ${record.unpaid_amount.toLocaleString()}`
                : record.unpaid_amount.toLocaleString(),
          },
        ]}
      />
    </TurtleContentModal>
  );
}

export default DetailModal;

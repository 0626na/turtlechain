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

interface Props {
  visible: boolean;
  onClose: () => void;
  vendor_id?: number;
  vendor_name?: string;
}

function DetailModal({ visible, onClose, vendor_id, vendor_name }: Props) {
  const [searchQuery, setSearchQuery] = useState<RequestGetItem>({
    vendor_id: undefined,
    start_date: moment().subtract(1, 'week').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
  });

  // 장부 상세내역 요청
  const getTransactionDetailQuery = useQuery(
    ['getTransactionDetail', searchQuery],
    () => transactionAPI.getItem(searchQuery),
    {
      enabled: !!visible && !!searchQuery.vendor_id,
    },
  );

  useEffect(() => {
    if (!visible) return;

    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      vendor_id: vendor_id,
    }));
  }, [vendor_id, visible]);

  return (
    <TurtleContentModal
      size="large"
      title="장부 상세보기"
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
            value: (
              getTransactionDetailQuery?.data?.data.reduce(
                (acc, item) => acc + item.refund_amount,
                0,
              ) ?? ''
            ).toLocaleString(),
          },
          {
            title: t('table.overpaidAmount'),
            value: (
              getTransactionDetailQuery?.data?.data.reduce(
                (acc, item) => acc + item.overpaid_amount,
                0,
              ) ?? ''
            ).toLocaleString(),
          },
          {
            title: t('table.unpaidAmount'),
            value: (
              getTransactionDetailQuery?.data?.data.reduce(
                (acc, item) => acc + item.unpaid_amount,
                0,
              ) ?? ''
            ).toLocaleString(),
          },
        ]}
      />
      <Table
        title={() => (
          <TurtleTableTitle
            totalCount={getTransactionDetailQuery?.data?.data.length ?? 0}
            totalSubstractAmount={getTransactionDetailQuery?.data?.data.reduce(
              (acc, item) => acc + item.overpaid_amount,
              0,
            )}
            totalRefundAmount={getTransactionDetailQuery?.data?.data.reduce(
              (acc, item) => acc + item.refund_amount,
              0,
            )}
            totalUnpaidAmount={getTransactionDetailQuery?.data?.data.reduce(
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
        dataSource={getTransactionDetailQuery?.data?.data}
        rowKey={(record) => String(record?.id)}
        loading={getTransactionDetailQuery.isLoading}
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
            render: (_, record) => t(`transaction.${record.transaction_type}`),
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
                ? '+' + record.overpaid_amount.toLocaleString()
                : record.overpaid_amount.toLocaleString(),
          },
          {
            ellipsis: true,
            width: 200,
            align: 'right',
            title: t('table.unpaidAmount'),
            render: (_, record) =>
              record.unpaid_amount > 0
                ? '+' + record.unpaid_amount.toLocaleString()
                : record.unpaid_amount.toLocaleString(),
          },
        ]}
      />
    </TurtleContentModal>
  );
}

export default DetailModal;

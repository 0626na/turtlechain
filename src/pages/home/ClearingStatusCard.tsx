import moment from 'moment';
import { t } from 'i18next';
import { Col, Row, Table, Tag, Typography } from 'antd';
import { useQuery } from 'react-query';
// import { TurtleCardHome } from '@components/common';
import clearingAPI from '@apis/clearingAPI';

function ClearingStatusCard() {
  const getSheetQuery = useQuery(['getClearingSheet'], () =>
    clearingAPI.getSheet({
      credit_type: 'general',
      start_date: moment().startOf('month').format('YYYY-MM-DD'),
      end_date: moment().endOf('month').format('YYYY-MM-DD'),
      status: 'all',
      page_size: 1000,
    }),
  );

  return (
    <div>
      <Row justify="space-between">
        <Col>
          <Typography.Title style={{ marginBottom: 16, fontSize: 18 }}>
            정산처리 현황
          </Typography.Title>
        </Col>
        <Col>
          <Typography.Text type="secondary">
            {moment().format('YYYY-MM')}
          </Typography.Text>
        </Col>
      </Row>
      <Table
        size="small"
        loading={getSheetQuery.isLoading}
        dataSource={getSheetQuery.data?.data.sheet_list}
        rowKey={(record) => record.id}
        pagination={{
          position: ['bottomRight'],
          showSizeChanger: false,
          defaultPageSize: 3,
        }}
        columns={[
          {
            ellipsis: true,
            width: 100,
            align: 'center',
            title: t('table.paymentStatus'),
            render: (_, record) => {
              const { status } = record;
              const color =
                status === 'request'
                  ? 'green'
                  : status === 'pending'
                  ? 'orange'
                  : 'geekblue';
              const text = t(`clearing.status.${status}`);
              return <Tag color={color}>{text}</Tag>;
            },
          },
          {
            ellipsis: true,
            title: t('table.paymentRequestDate'),
            render: (_, record) => record.request_date,
          },
          {
            ellipsis: true,
            title: t('table.paymentCompleteDate'),
            render: (_, record) => record.complete_date,
          },
          {
            ellipsis: true,
            title: t('table.storeName'),
            render: (_, record) => record.store_name,
          },
          {
            ellipsis: true,
            title: t('table.paymentPrice'),
            render: (_, record) =>
              `${record.total_deposit_amount.toLocaleString()}원`,
          },
        ]}
      />
    </div>
  );
}

export default ClearingStatusCard;

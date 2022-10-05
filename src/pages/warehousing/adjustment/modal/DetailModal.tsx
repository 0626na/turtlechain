import moment from 'moment';
import { t } from 'i18next';

import { useQuery } from 'react-query';
import { Row, Table } from 'antd';
import adjustmentAPI, { AdjustmentItemShow } from '@apis/adjustmentAPI';

import { TurtleTableTitle, TurtleText } from '@components/element';
import { TurtleContentModal } from '@components/combine';
import { css } from '@emotion/react';

interface Props {
  visible: boolean;
  onClose: () => void;
  selectedRow?: AdjustmentItemShow;
}

function DetailModal({ visible, onClose, selectedRow }: Props) {
  // 매입조정 상세내역 요청
  const getAdjustmentDetailHistoryQuery = useQuery(
    ['getAdjustmentDetailHistory', selectedRow?.id],
    () => adjustmentAPI.get({ adjustment_item_id: selectedRow?.id as number }),
    {
      enabled: !!visible,
    },
  );

  return (
    <TurtleContentModal
      size="large"
      title="매입조정 상세보기"
      visible={visible}
      onClose={onClose}
    >
      <Table
        size="small"
        dataSource={selectedRow && [selectedRow]}
        rowKey={(record) => record.id}
        pagination={false}
        columns={[
          {
            ellipsis: true,
            align: 'center',
            width: 120,
            title: t('table.createdDate'),
            render: (_, record) => record.created_date,
          },
          {
            ellipsis: true,
            title: t('table.type'),
            render: (_, record) => t(`adjustment.type.${record.type}`),
          },
          {
            ellipsis: true,
            title: t('table.vendorName'),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: t('table.productName'),
            render: (_, record) => record.product_info.name,
          },
          {
            ellipsis: true,
            title: t('table.vendorProductName'),
            render: (_, record) => record.product_info.vendor_product_name,
          },
          {
            ellipsis: true,
            title: t('table.option'),
            render: (_, record) => record.product_info.option,
          },
          {
            ellipsis: true,
            align: 'right',
            title: t('table.price'),
            render: (_, record) =>
              (record.product_info.price * record.count).toLocaleString(),
          },
          {
            ellipsis: true,
            align: 'right',
            title: t('table.proccessed totalCount'),
            render: (_, record) =>
              `${record.count - record.count_left} / ${record.count}`,
          },
        ]}
      />

      <Row
        css={css`
          margin: 48px 0 24px 0;
        `}
      >
        <TurtleText
          css={css`
            font-weight: 500;
            font-size: 20px;
          `}
        >
          처리 상세내역
        </TurtleText>
      </Row>

      <Table
        size="small"
        loading={getAdjustmentDetailHistoryQuery.isLoading}
        dataSource={getAdjustmentDetailHistoryQuery.data?.data.transaction_list}
        rowKey={(record) => record.id}
        pagination={false}
        title={() => (
          <TurtleTableTitle
            totalCount={
              getAdjustmentDetailHistoryQuery.data?.data.transaction_list
                .length ?? 0
            }
          />
        )}
        columns={[
          {
            ellipsis: true,
            width: 200,
            align: 'center',
            title: '처리시간',
            render: (_, record) =>
              moment(record.created_datetime).format('YYYY-MM-DD HH:mm:ss'),
          },
          {
            ellipsis: true,
            title: '처리내용',
            render: (_, record) => record.memo,
          },
        ]}
      />
    </TurtleContentModal>
  );
}

export default DetailModal;

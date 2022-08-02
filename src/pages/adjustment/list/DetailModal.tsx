import moment from 'moment';
import { t } from 'i18next';

import { useQuery } from 'react-query';
import { Row, Table } from 'antd';
import adjustmentAPI, { AdjustmentItemShow } from '@apis/adjustmentAPI';

import { TurtleModal, TurtleTableTitle, TurtleText } from '@components/common';

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: AdjustmentItemShow;
}

function DetailModal({ visible, closeModal, selectedRow }: Props) {
  // 매입조정 상세내역 요청
  const getRetailerStoreAdjustmentDetailHistoryQuery = useQuery(
    ['getRetailerStoreAdjustmentDetailHistory', selectedRow?.id!],
    () => adjustmentAPI.get({ adjustment_item_id: selectedRow?.id! }),
    {
      enabled: visible,
    },
  );

  return (
    <TurtleModal
      centered
      width="90%"
      title={t('adjustment.detail')}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      bodyStyle={{ height: '60vh', overflowY: 'auto' }}
    >
      <Row style={{ marginBottom: 16 }}>
        <TurtleText>{t('adjustment.list')}</TurtleText>
      </Row>

      <Table
        size="small"
        loading={visible}
        dataSource={selectedRow && [selectedRow]}
        rowKey={(record) => record.id}
        pagination={false}
        columns={[
          {
            ellipsis: true,
            align: 'center',
            width: 120,
            title: t('adjustment date'),
            render: (_, record) => record.created_date,
          },
          {
            ellipsis: true,
            title: t('adjustment.type.'),
            render: (_, record) => t(`adjustment.type.${record.type}`),
          },
          {
            ellipsis: true,
            title: t('vendor.name'),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: t('product.name'),
            render: (_, record) => record.product_info.name,
          },
          {
            ellipsis: true,
            title: t('product.vendor product name'),
            render: (_, record) => record.product_info.vendor_product_name,
          },
          {
            ellipsis: true,
            title: t('product.option'),
            render: (_, record) => record.product_info.option,
          },
          {
            ellipsis: true,
            align: 'right',
            title: t('warehousing.amount'),
            render: (_, record) =>
              (record.product_info.price * record.count).toLocaleString(),
          },
          {
            ellipsis: true,
            align: 'right',
            title: t('adjustment.count all'),
            render: (_, record) =>
              `${record.count - record.count_left} / ${record.count}`,
          },
        ]}
      />

      <Row style={{ margin: '32px 0 16px 0' }}>
        <TurtleText>입고 및 매입조정 처리이력</TurtleText>
      </Row>

      <Table
        size="small"
        loading={getRetailerStoreAdjustmentDetailHistoryQuery.isLoading}
        dataSource={
          getRetailerStoreAdjustmentDetailHistoryQuery.data?.data
            .transaction_list
        }
        rowKey={(record) => record.id}
        pagination={false}
        title={() => (
          <TurtleTableTitle
            count={
              getRetailerStoreAdjustmentDetailHistoryQuery.data?.data
                .transaction_list.length ?? 0
            }
          ></TurtleTableTitle>
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
    </TurtleModal>
  );
}

export default DetailModal;

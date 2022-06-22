import moment from 'moment';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useQuery } from 'react-query';
import { DatePicker, Row, Table } from 'antd';
import adjustmentAPI, { AdjustmentItemShow } from '@apis/adjustmentAPI';
import clearingAPI, { RequestGetBalance } from '@apis/clearingAPI';
import { TurtleModal, TurtleTableTitle, TurtleText } from '@components/common';
import { storeState } from '@store/storeState';

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: AdjustmentItemShow;
}

function DetailModal({ visible, closeModal, selectedRow }: Props) {
  const store = useRecoilValue(storeState);
  const [searchQuery, setSearchQuery] = useState<RequestGetBalance>({
    rt_store_id: store.id,
    vendor_id: selectedRow?.vendor_info.id,
    start_date: selectedRow?.created_date,
    end_date: moment().add(1, 'd').format('YYYY-MM-DD'),
    tab: 'adjustment',
    original_id: selectedRow?.id,
  });

  // 매입조정 상세내역 요청
  const getDetailQuery = useQuery(
    ['getAdjustmentDetail', selectedRow],
    () => adjustmentAPI.get({ id: selectedRow?.id! }),
    {
      enabled: visible && !!searchQuery.original_id,
    },
  );

  // 잔금 내역 조회 요청 청
  const getBalanceQuery = useQuery(
    ['getBalance', searchQuery], //
    () => clearingAPI.getBalance(searchQuery),
    {
      enabled: visible && !!searchQuery.original_id,
    },
  );

  useEffect(() => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      rt_store_id: store.id,
      vendor_id: selectedRow?.vendor_info.id,
      start_date: selectedRow?.created_date,
      end_date: moment().add(1, 'd').format('YYYY-MM-DD'),
      tab: 'adjustment',
      original_id: selectedRow?.id,
    }));
  }, [selectedRow, store.id]);

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
        loading={getDetailQuery.isLoading}
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
              (record.price * record.count).toLocaleString(),
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
        loading={getBalanceQuery.isLoading}
        dataSource={getBalanceQuery.data?.data.item_list}
        rowKey={(record) => record.id}
        pagination={false}
        title={() => (
          <TurtleTableTitle count={getBalanceQuery.data?.data.total_count ?? 0}>
            <DatePicker.RangePicker
              size="small"
              allowClear={false}
              value={[
                moment(searchQuery.start_date),
                moment(searchQuery.end_date),
              ]}
              onChange={(_, [start_date, end_date]) => {
                setSearchQuery({ ...searchQuery, start_date, end_date });
              }}
            />
          </TurtleTableTitle>
        )}
        columns={[
          {
            ellipsis: true,
            width: 200,
            align: 'center',
            title: '처리시간',
            render: (_, record) =>
              moment(record.created_time).format('YYYY-MM-DD HH:mm:ss'),
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

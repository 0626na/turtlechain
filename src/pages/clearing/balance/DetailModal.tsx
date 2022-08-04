import moment from 'moment';
import { t } from 'i18next';
import { Table } from 'antd';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import clearingAPI, { ClearingInfo } from '@apis/clearingAPI';
import {
  TurtleModal,
  TurtleStatistics,
  TurtleTableTitle,
} from '@components/common';
import { storeState } from '@store/storeState';

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: ClearingInfo;
}

function DetailModal({ visible, closeModal, selectedRow }: Props) {
  const store = useRecoilValue(storeState);

  const getOverpaidBalanceQuery = useQuery(
    ['getOverpaidBalance', selectedRow],
    () =>
      clearingAPI.getOverpaidBalance({
        rt_store_id: store.id!,
        start_date: moment().subtract('1', 'month').format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),

        vendor_id: selectedRow?.vendor_info.id!,
        subtract_amount: selectedRow?.overpaid_amount!,
        refund_amount: selectedRow?.refund_amount!,
      }),
    {
      enabled: visible && !!selectedRow?.rt_store_id,
    },
  );

  return (
    <TurtleModal
      centered
      width="90%"
      title={t('clearing.balance detail')}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      bodyStyle={{ height: '80vh', overflowY: 'auto' }}
    >
      <TurtleStatistics
        value={[
          {
            title: t('vendor.name'),
            value: selectedRow?.vendor_info.vendor_name ?? ' ',
          },
          {
            title: '환불 받을 금액',
            value: `${selectedRow?.refund_amount.toLocaleString()}원`,
          },
          {
            title: '사용 가능 금액',
            value: `${selectedRow?.overpaid_amount.toLocaleString()}원`,
          },
        ]}
      />

      <Table
        size="small"
        loading={getOverpaidBalanceQuery.isLoading}
        pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
        dataSource={getOverpaidBalanceQuery.data?.item_list}
        rowKey={(item) => item.rt_store_id}
        title={() => (
          <TurtleTableTitle
            count={getOverpaidBalanceQuery.data?.item_list.length ?? 0}
          ></TurtleTableTitle>
        )}
        columns={[
          {
            ellipsis: true,
            width: 200,
            align: 'center',
            title: '날짜',
            render: (_, record) =>
              moment(record.created_date).format('YYYY-MM-DD'),
          },
          {
            ellipsis: true,
            width: 500,
            title: '처리 내용',
            render: (_, record) => record.memo,
          },
          {
            ellipsis: true,
            title: '환불 받을 금액',
            render: (_, record) => record.refund_amount.toLocaleString(),
          },
          {
            ellipsis: true,
            title: '사용 가능 금액',
            render: (_, record) => record.overpaid_amount.toLocaleString(),
          },
        ]}
      />
    </TurtleModal>
  );
}

export default DetailModal;

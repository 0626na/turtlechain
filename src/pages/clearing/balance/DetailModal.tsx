import moment from 'moment';
import { t } from 'i18next';
import { message, Table } from 'antd';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import clearingAPI, { BalanceShow } from '@apis/clearingAPI';
import {
  TurtleModal,
  TurtleStatistics,
  TurtleTableTitle,
} from '@components/common';
import { storeState } from '@store/storeState';

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: BalanceShow;
}

function DetailModal({ visible, closeModal, selectedRow }: Props) {
  const store = useRecoilValue(storeState);

  const getBalanceQuery = useQuery(
    ['getBalance', selectedRow],
    () =>
      clearingAPI.getBalance({
        rt_store_id: store.id,
        vendor_id: selectedRow?.vendor_info.id,
        tab: 'balance_detail',
      }),
    {
      enabled: visible && !!selectedRow?.id,
      onError: (error: AxiosError) => {
        message.warn(error.response?.data.msg);
      },
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
        loading={getBalanceQuery.isLoading}
        pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
        dataSource={getBalanceQuery.data?.data.item_list}
        rowKey={(item) => item.id}
        title={() => (
          <TurtleTableTitle
            count={getBalanceQuery.data?.data.total_count ?? 0}
          ></TurtleTableTitle>
        )}
        columns={[
          {
            ellipsis: true,
            width: 200,
            align: 'center',
            title: '날짜',
            render: (_, record) =>
              moment(record.created_time).format('YYYY-MM-DD'),
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

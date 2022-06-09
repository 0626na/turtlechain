import moment from 'moment';
import { t } from 'i18next';
import { Table, Popconfirm, Row, message } from 'antd';
import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import { useRecoilValue } from 'recoil';
import { useCallback, useEffect, useState } from 'react';
import orderAPI, { RequestGetList } from '@apis/orderAPI';
import { storeState } from '@store/storeState';
import { TurtleButtonSub, TurtleText } from '@components/common';
import OrderSheetModal from './OrderSheetModal';

interface Props {
  searchQuery: RequestGetList;
  setSearchQuery: React.Dispatch<React.SetStateAction<RequestGetList>>;
}
function OrderSheetList({ searchQuery, setSearchQuery }: Props) {
  const store = useRecoilValue(storeState);
  const [sheetId, setSheetId] = useState<number>();
  const [modalVisible, setModalVisible] = useState(false);

  const getOrderListQuery = useQuery(
    ['getOrderList', searchQuery],
    () => orderAPI.getList({ ...searchQuery, rt_store_id: store.id ?? -1 }),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {},
    },
  );

  useEffect(() => {
    setSearchQuery({ ...searchQuery, rt_store_id: store.id ?? -1 });
  }, [store.id]);

  const openModal = useCallback((id) => {
    setSheetId(id);
    setModalVisible(true);
  }, []);

  return (
    <Row>
      <TurtleText>
        {t('order.sheet.list')}({getOrderListQuery.data?.data.total_count})
      </TurtleText>
      <Table
        size="small"
        loading={getOrderListQuery.isLoading}
        dataSource={getOrderListQuery.data?.data.order_sheet_list}
        rowKey={(record) => record.id}
        pagination={{
          position: ['bottomCenter'],
          showSizeChanger: false,
          pageSize: 13,
        }}
        style={{ height: '630px' }}
        scroll={{ y: 630 }}
        columns={[
          {
            ellipsis: true,
            width: '8%',
            title: t('order.status'),
            render: (_, record) =>
              record.status === 'Y'
                ? '처리'
                : record.status === 'N'
                ? '미처리'
                : '취소',
          },
          {
            ellipsis: true,
            width: '8%',
            title: t('order.time'),
            render: (_, record) =>
              moment(record.created_date).format('YYYY.MM.DD'),
          },
          {
            ellipsis: true,
            title: t('order.content'),
            render: (_, record) =>
              `주문${record.order_count} / 미송${record.reserve_count} / 반품${record.takeback_count} / 교환${record.exchange_count} / 샘플${record.sample_case_count} / 픽업${record.pickup_case_count} / 기타${record.extra_count}`,
          },
          {
            ellipsis: true,
            title: t('order.sheet.status'),
            render: (_, record) =>
              `알림톡${record.kakao} / SMS${record.sms} / 실패${record.fail}`,
          },
          {
            ellipsis: true,
            width: '8%',
            title: t('order.sheet.resend'),
            render: (_, record) => {
              return (
                <Popconfirm
                  title={t('description.really resend')}
                  okText={t('yes')}
                  cancelText={t('no')}
                  onConfirm={() => {}}
                >
                  <TurtleButtonSub size="small" disabled={true}>
                    {t('button.resend')}
                  </TurtleButtonSub>
                </Popconfirm>
              );
            },
          },
          {
            ellipsis: true,
            width: '8%',
            title: t('view details'),
            render: (_, record) => (
              <TurtleButtonSub
                size="small"
                color="grey"
                onClick={() => {
                  openModal(record.id);
                }}
              >
                {t('button.details')}
              </TurtleButtonSub>
            ),
          },
        ]}
      />
      <OrderSheetModal
        visible={modalVisible}
        closeModal={() => setModalVisible(false)}
        sheetId={sheetId}
      />
    </Row>
  );
}

export default OrderSheetList;

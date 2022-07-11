import moment from 'moment';
import { t } from 'i18next';
import { useEffect, useCallback, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useMutation, useQuery } from 'react-query';
import {
  Table,
  Tag,
  Popconfirm,
  Pagination,
  Row,
  Space,
  Select,
  DatePicker,
  Divider,
  message,
} from 'antd';
import { storeState } from '@store/storeState';
import { MainContent, MenuBar } from '@layout/page';
import {
  TurtleButtonSub,
  TurtleIcon,
  TurtleTableTitle,
} from '@components/common';
import warehousingAPI, {
  RequestGetSheet,
  WarehousingSheet,
} from '@apis/warehousingAPI';
import WarehousingDetailModal from './DetailModal';
import { AxiosError } from 'axios';

function PageBody() {
  const store = useRecoilValue(storeState);
  const [selectedRow, selectRow] = useState<WarehousingSheet>();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<RequestGetSheet>({
    rt_store_id: -1,
    is_confirmed: '',
    start_date: moment().subtract(1, 'months').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    page: 1,
  });

  // 입고장 리스트 요청
  const getSheetQuery = useQuery(
    ['getWarehousingSheet', searchQuery],
    () => warehousingAPI.getSheet(searchQuery),
    {
      enabled: searchQuery.rt_store_id !== -1,
    },
  );

  // 입고장 수정, 삭제 요청
  const updateSheetQuery = useMutation(
    ['updateWarehousingSheet'],
    warehousingAPI.updateSheet,
    {
      onSuccess: () => {
        message.success(t('message.success update'));
        setSearchQuery({ ...searchQuery, page: 1 });
        getSheetQuery.refetch();
      },
      onError: (error: AxiosError) => {
        message.warn(error.response?.data.msg);
      },
    },
  );

  // 쇼핑몰 바뀔때 마다 입고서 리스트 재요청
  useEffect(() => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      rt_store_id: store.id ?? -1,
    }));
  }, [store.id]);

  // 행 선택
  const openDetailModal = useCallback((record) => {
    setDetailModalVisible(true);
    selectRow(record);
  }, []);

  return (
    <>
      <MenuBar />

      <MainContent title={t('warehousing.lists')}>
        <Table
          size="small"
          dataSource={getSheetQuery.data?.sheet_list}
          loading={getSheetQuery.isLoading}
          pagination={false}
          scroll={{ y: 'auto' }}
          rowKey={(record) => record.id}
          onRow={(record) => ({
            onClick: () => {
              openDetailModal(record);
            },
          })}
          title={() => (
            <TurtleTableTitle count={getSheetQuery.data?.total_count ?? 0}>
              <Select
                size="small"
                style={{ width: 100 }}
                value={searchQuery.is_confirmed}
                onChange={(is_confirmed) => {
                  setSearchQuery({ ...searchQuery, is_confirmed });
                }}
              >
                <Select.Option value="">{t('all')}</Select.Option>
                <Select.Option value={0}>{t('waiting')}</Select.Option>
                <Select.Option value={1}>{t('confirmed')}</Select.Option>
              </Select>

              <Divider type="vertical" style={{ margin: 0 }} />

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
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={getSheetQuery.data?.total_count}
                showSizeChanger={false}
                current={searchQuery.page}
                onChange={(page) => {
                  setSearchQuery({ ...searchQuery, page });
                }}
              />
            </Row>
          )}
          columns={[
            {
              ellipsis: true,
              width: 100,
              align: 'center',
              title: t('progress'),
              render: (_, record) => {
                const { is_confirmed } = record;
                const color = is_confirmed ? 'geekblue' : 'orange';
                const text = is_confirmed ? t('confirmed') : t('waiting');
                return <Tag color={color}>{text}</Tag>;
              },
            },
            {
              ellipsis: true,
              align: 'center',
              title: t('warehousing.date'),
              render: (_, record) => record.created_date,
            },
            {
              ellipsis: true,
              align: 'right',
              title: t('warehousing.total count'),
              render: (_, record) => record.total_item_count.toLocaleString(),
            },
            {
              ellipsis: true,
              align: 'right',
              title: t('warehousing.total amount'),
              render: (_, record) => record.total_amount.toLocaleString(),
            },
            {
              ellipsis: true,
              align: 'center',
              render: (_, record) => (
                <Space>
                  {!record.is_confirmed && (
                    <>
                      <Popconfirm
                        title={t('description.really confirmed')}
                        okText={t('yes')}
                        cancelText={t('no')}
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          updateSheetQuery.mutate({
                            id: record.id,
                            is_confirmed: true,
                          });
                        }}
                        onCancel={(e) => {
                          e?.stopPropagation();
                        }}
                      >
                        <TurtleButtonSub
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          마감
                        </TurtleButtonSub>
                      </Popconfirm>
                      <Popconfirm
                        title={t('description.really delete')}
                        okText={t('yes')}
                        cancelText={t('no')}
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          updateSheetQuery.mutate({
                            id: record.id,
                            is_inactive: true,
                          });
                        }}
                        onCancel={(e) => {
                          e?.stopPropagation();
                        }}
                      >
                        <TurtleIcon type="delete" />
                      </Popconfirm>
                    </>
                  )}
                </Space>
              ),
            },
          ]}
        />

        {/*상세 입고 내역 모달 */}
        <WarehousingDetailModal
          visible={detailModalVisible}
          onClose={() => {
            setDetailModalVisible(false);
          }}
          sheet={selectedRow}
        />
      </MainContent>
    </>
  );
}

export default PageBody;

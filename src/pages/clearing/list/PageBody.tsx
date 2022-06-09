import moment from 'moment';
import { t } from 'i18next';
import {
  Button,
  DatePicker,
  Divider,
  message,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Table,
  Tag,
} from 'antd';
import { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { DownloadOutlined } from '@ant-design/icons';
import clearingAPI, {
  ClearingSheetShow,
  RequestGetSheet,
} from '@apis/clearingAPI';
import { TurtleCard, TurtleIcon, TurtleTableTitle } from '@components/common';
import { MainContent, MenuBar } from '@layout/main';
import { storeState } from '@store/storeState';
import { SelectDateModal } from '@components/combine';
import { useStoreExist } from '@hooks/index';
import DetailModal from './DetailModal';
import excelAPI from '@apis/excelAPI';

function PageBody() {
  const store = useRecoilValue(storeState);
  const isStoreExist = useStoreExist();
  const [sheetList, setSheetList] = useState<ClearingSheetShow[]>([]);
  const [searchQuery, setSearchQuery] = useState<RequestGetSheet>({
    store_id: store.id,
    credit_type: 'general',
    start_date: moment().subtract(1, 'months').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    page: 1,
    page_size: 10,
    status: 'all',
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const [selectedRow, selectRow] = useState<ClearingSheetShow>();

  const getSheetQuery = useQuery(
    ['getClearingSheet', searchQuery],
    () => clearingAPI.getSheet(searchQuery),
    {
      enabled: !!searchQuery.store_id,
      onSuccess: (data) => {
        setSheetList(data.data.sheet_list);
      },
      onError: (err: AxiosError) => {
        message.warn(err.response?.data.msg);
      },
    },
  );

  const updateSheetQuery = useMutation(
    ['updateClearingSheet'],
    clearingAPI.updateSheet,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: () => {
        getSheetQuery.refetch();
        message.success(t('message.success delete clearing'));
      },
    },
  );

  const downloadExcelQuery = useMutation(
    'downloadClearing',
    excelAPI.downloadClearing,
    {
      onError: (error: AxiosError) => {
        message.error(
          new TextDecoder().decode(error.response?.data).split('"')[3],
        );
      },
      onSuccess: () => {
        setDownloadModalVisible(false);
      },
    },
  );

  // 쇼핑몰 바뀔때 마다 정산 리스트 재요청
  useEffect(() => {
    setSearchQuery((searchQuery) => ({ ...searchQuery, store_id: store.id }));
  }, [store.id]);

  const openDetailModal = useCallback((record) => {
    selectRow(record);
    setDetailModalVisible(true);
  }, []);

  return (
    <>
      <MenuBar>
        <Button
          type="default"
          style={{ borderColor: '#CBCCD1', borderRadius: 2, color: '#5B5D63' }}
          icon={<DownloadOutlined />}
          onClick={() => {
            if (!isStoreExist()) {
              return;
            }
            setDownloadModalVisible(true);
          }}
        >
          정산내역 다운
        </Button>
      </MenuBar>

      <TurtleCard
        value={[
          {
            color: 'green',
            title: t('clearing.status.request'),
            count: getSheetQuery.data?.data.clearing_summary.request.count ?? 0,
            price:
              getSheetQuery.data?.data.clearing_summary.request.amount ?? 0,
          },
          {
            color: 'orange',
            title: t('clearing.status.pending'),
            count: getSheetQuery.data?.data.clearing_summary.pending.count ?? 0,
            price:
              getSheetQuery.data?.data.clearing_summary.pending.amount ?? 0,
          },
          {
            color: 'geekblue',
            title: t('clearing.status.complete'),
            count:
              getSheetQuery.data?.data.clearing_summary.complete.count ?? 0,
            price:
              getSheetQuery.data?.data.clearing_summary.complete.amount ?? 0,
          },
        ]}
      />

      <MainContent title={t('clearing.lists')}>
        <Table
          size="small"
          dataSource={sheetList}
          loading={getSheetQuery.isLoading}
          pagination={false}
          rowKey={(record) => record.id}
          scroll={{ y: 'auto' }}
          onRow={(record) => ({
            onClick: () => {
              openDetailModal(record);
            },
          })}
          title={() => (
            <TurtleTableTitle count={getSheetQuery.data?.data.total_count ?? 0}>
              <Select
                size="small"
                style={{ width: 100 }}
                value={searchQuery.status}
                defaultValue="all"
                onChange={(value) => {
                  setSearchQuery({ ...searchQuery, status: value });
                }}
              >
                <Select.Option value="all">{t('all')}</Select.Option>
                <Select.Option value="request">
                  {t('clearing.status.request')}
                </Select.Option>
                <Select.Option value="pending">
                  {t('clearing.status.pending')}
                </Select.Option>
                <Select.Option value="complete">
                  {t('clearing.status.complete')}
                </Select.Option>
              </Select>

              <Divider type="vertical" style={{ margin: 0 }} />
              <DatePicker.RangePicker
                size="small"
                allowClear={false}
                value={[
                  moment(searchQuery.start_date),
                  moment(searchQuery.end_date),
                ]}
                onChange={(_, dateStrings) => {
                  const start_date = dateStrings[0];
                  const end_date = dateStrings[1];
                  setSearchQuery({ ...searchQuery, start_date, end_date });
                }}
              />
            </TurtleTableTitle>
          )}
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={getSheetQuery.data?.data.total_count}
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
              title: t('clearing.status.default'),
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
              title: t('clearing.request date'),
              render: (_, record) => record.request_date,
            },
            {
              ellipsis: true,
              title: t('clearing.complete date'),
              render: (_, record) => record.complete_date,
            },
            {
              ellipsis: true,
              title: t('clearing.total price'),
              render: (_, record) =>
                record.total_clearing_amount.toLocaleString(),
            },
            {
              ellipsis: true,
              render: (_, record) => (
                <>
                  {record.status === 'request' && (
                    <Popconfirm
                      title={t('description.really delete')}
                      okText={t('yes')}
                      cancelText={t('no')}
                      onCancel={(e) => {
                        e?.stopPropagation();
                      }}
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        updateSheetQuery.mutate({
                          id: record.id,
                          is_inactive: 1,
                        });
                      }}
                    >
                      <TurtleIcon type="delete" />
                    </Popconfirm>
                  )}
                </>
              ),
            },
          ]}
        />
      </MainContent>

      {/* 상세내역 모달 */}
      <DetailModal
        visible={detailModalVisible}
        closeModal={() => {
          setDetailModalVisible(false);
        }}
        sheet={selectedRow}
      />

      {/* 엑셀 다운로드 날짜선택 모달 */}
      <SelectDateModal
        visible={downloadModalVisible}
        closeModal={() => {
          setDownloadModalVisible(false);
        }}
        onClick={({ start_date, end_date }) => {
          downloadExcelQuery.mutate({
            rt_store_id: store.id,
            start_date,
            end_date,
          });
        }}
        loading={downloadExcelQuery.isLoading}
      />
    </>
  );
}

export default PageBody;

import moment from 'moment';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DatePicker, message, Pagination, Row, Table, Tag } from 'antd';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import clearingAPI, {
  ClearingItemShow,
  RequestGetSheet,
} from '@apis/clearingAPI';
import { NewSearchFilter } from '@components/combine';
import { TurtleModal, TurtleTableTitle } from '@components/common';
import { MainContent } from '@layout/main';
import { storeState } from '@store/storeState';

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectClearingItem: React.Dispatch<
    React.SetStateAction<ClearingItemShow | undefined>
  >;
}

function LoadClearingModal({ visible, closeModal, selectClearingItem }: Props) {
  const store = useRecoilValue(storeState);
  const [selectedSheetId, selectSheetId] = useState<number>(-1);
  const [searchQuery, setSearchQuery] = useState<RequestGetSheet>({
    store_id: store.id,
    credit_type: 'general',
    start_date: moment().subtract(1, 'months').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    page: 1,
    page_size: 5,
    status: 'complete',
  });
  const [searchState, setSearchState] = useState({ search_string: '' });

  const getSheetQuery = useQuery(
    ['getClearingSheet', searchQuery],
    () => clearingAPI.getSheet(searchQuery),
    {
      enabled: visible,
      onError: (err: AxiosError) => {
        message.warn(err.response?.data.msg);
      },
    },
  );

  const getItemQuery = useQuery(
    ['getClearingItem', selectedSheetId], //
    () =>
      clearingAPI.getItem({
        sheet_id: selectedSheetId,
        page_size: 100,
      }),
    {
      enabled: visible && selectedSheetId !== -1,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  const resetStates = useCallback(() => {
    selectSheetId(-1);
    setSearchQuery({
      store_id: store.id,
      credit_type: 'general',
      start_date: moment().subtract(1, 'months').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
      page: 1,
      page_size: 5,
      status: 'complete',
    });
    setSearchState({ search_string: '' });
  }, [store.id]);

  useEffect(() => {
    resetStates();
  }, [visible, resetStates]);

  const onClickItemRow = useCallback(
    (record: ClearingItemShow) => {
      selectClearingItem(record);
      closeModal();
    },
    [selectClearingItem, closeModal],
  );

  const filteredList = useMemo(
    () =>
      getItemQuery.data?.data.item_list.filter((item) => {
        return (
          item.vendor_name.includes(searchState.search_string) ||
          item.vendor_address.includes(searchState.search_string) ||
          item.account_number.includes(searchState.search_string) ||
          item.account_holder.includes(searchState.search_string)
        );
      }),
    [getItemQuery.data, searchState],
  );

  return (
    <TurtleModal
      centered
      width="90%"
      title={t('clearing.search')}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      getContainer={false}
      bodyStyle={{ height: '90vh', overflowY: 'auto' }}
    >
      <Row style={{ marginBottom: 16 }}>
        <DatePicker.RangePicker
          size="small"
          allowClear={false}
          value={[moment(searchQuery.start_date), moment(searchQuery.end_date)]}
          onChange={(_, [start_date, end_date]) => {
            setSearchQuery({ ...searchQuery, start_date, end_date });
          }}
        />
      </Row>

      <Table
        size="small"
        dataSource={getSheetQuery.data?.data.sheet_list}
        loading={getSheetQuery.isLoading}
        pagination={false}
        scroll={{ y: 'auto' }}
        rowKey={(record) => record.id}
        onRow={(record) => ({
          onClick: () => {
            selectSheetId(record.id);
          },
        })}
        footer={() => (
          <Row justify="center">
            <Pagination
              size="small"
              total={getSheetQuery.data?.data.total_count}
              showSizeChanger={false}
              pageSize={5}
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
        ]}
      />

      <MainContent title={t('clearing.detail')}>
        <Table
          size="small"
          dataSource={filteredList}
          loading={getItemQuery.isLoading}
          pagination={false}
          rowKey={(record) => record.id}
          scroll={{ y: 'auto' }}
          onRow={(record) => ({
            onClick: () => {
              onClickItemRow(record);
            },
          })}
          title={() => (
            <TurtleTableTitle
              count={getItemQuery.data?.data.total_count ?? 0}
              searchCount={filteredList?.length ?? 0}
            >
              <NewSearchFilter
                select={false}
                vendor
                searchQuery={searchState}
                setSearchQuery={setSearchState}
              />
            </TurtleTableTitle>
          )}
          columns={[
            {
              ellipsis: true,
              title: t('vendor.name'),
              render: (_, record) => record.vendor_name,
            },
            {
              ellipsis: true,
              title: t('vendor.address'),
              render: (_, record) => record.vendor_address,
            },
            {
              ellipsis: true,
              title: t('vendor.account'),
              render: (_, record) =>
                `${record.bank} ${record.account_number} ${record.account_holder}`,
            },
            {
              ellipsis: true,
              title: t('clearing.supply price'),
              render: (_, record) => record.supply_amount.toLocaleString(),
            },
            {
              ellipsis: true,
              title: t('clearing.vat'),
              render: (_, record) => record.vat_amount.toLocaleString(),
            },
            {
              ellipsis: true,
              title: t('clearing.price'),
              render: (_, record) => record.clearing_amount.toLocaleString(),
            },
          ]}
        />
      </MainContent>
    </TurtleModal>
  );
}

export default LoadClearingModal;

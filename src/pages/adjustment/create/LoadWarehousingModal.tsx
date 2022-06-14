import moment from 'moment';
import { t } from 'i18next';
import { DatePicker, message, Row, Table, Tag } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { MainContent } from '@layout/main';
import { AdjustmentItem } from '@apis/adjustmentAPI';
import warehousingAPI, {
  RequestGetSheet,
  WarehousingItem,
} from '@apis/warehousingAPI';
import {
  TurtleButton,
  TurtleModal,
  TurtleTableTitle,
} from '@components/common';
import { storeState } from '@store/storeState';
import { NewSearchFilter } from '@components/combine';

interface Props {
  visible: boolean;
  closeModal: () => void;
  addItem: (item: AdjustmentItem) => boolean;
}

function LoadWarehousingModal({ visible, closeModal, addItem }: Props) {
  const store = useRecoilValue(storeState);
  const [selectedSheetId, selectSheetId] = useState<number>(-1);
  const [selectedItems, selectItems] = useState<Array<WarehousingItem>>([]);
  const [searchQuery, setSearchQuery] = useState<RequestGetSheet>({
    rt_store_id: -1,
    is_confirmed: '',
    start_date: moment().subtract(1, 'weeks').format('YYYY-MM-DD'),
    end_date: moment().format('YYYY-MM-DD'),
    page: 1,
  });
  const [searchState, setSearchState] = useState({
    type: 'name',
    search_string: '',
  });

  // 입고장 리스트 요청
  const getSheetQuery = useQuery(
    ['getWarehousingSheet', searchQuery],
    () => warehousingAPI.getSheet(searchQuery),
    {
      enabled: visible && !!store.id,
    },
  );

  // 입고장 상세내역 리스트 요청
  const getItemQuery = useQuery(
    ['getWarehousingItem', selectedSheetId],
    () => warehousingAPI.getItem({ sheet_id: selectedSheetId }),
    {
      enabled: visible && selectedSheetId !== -1,
    },
  );

  // 상태 초기화
  const resetStates = useCallback(() => {
    if (visible) return;
    selectItems([]);
    selectSheetId(-1);
    setSearchQuery({
      rt_store_id: store.id!,
      is_confirmed: '',
      start_date: moment().subtract(1, 'weeks').format('YYYY-MM-DD'),
      end_date: moment().format('YYYY-MM-DD'),
      page: 1,
    });
    setSearchState({
      type: 'name',
      search_string: '',
    });
  }, [store.id, visible]);

  const onClickItemRow = useCallback(
    (record: WarehousingItem) => {
      if (selectedItems.find((item) => item.id === record.id)) {
        selectItems((selectedItems) =>
          selectedItems.filter((item) => item.id !== record.id),
        );
        return;
      }
      selectItems((selectedItems) => [...selectedItems, record]);
    },
    [selectItems, selectedItems],
  );

  // 모달열릴때 마다 상태 초기화
  useEffect(() => {
    resetStates();
  }, [visible, resetStates]);

  // 상품 미리보기테이블에 추가
  const onClickAddItem = useCallback(() => {
    if (selectedItems.length === 0) {
      message.info('선택된 상품이 없습니다.');
      return;
    }

    // WarehousingItem -> AdjustmentProduct 타입 변환해서 넣어줌
    selectedItems.forEach((item) => {
      addItem({
        vendor_id: item.vendor_info.id,
        vendor_name: item.vendor_info.vendor_name,
        vendor_address: item.vendor_info.vendor_address,
        warehousing_item_id: item.id,
        product_id: item.product_info.id,
        product_name: item.product_info.name,
        vendor_product_name: item.product_info.vendor_product_name,
        product_option: item.product_info.option,
        product_price: item.product_info.supply_price,
        product_count: 0,
        product_count_max: item.count,
        product_code: item.product_info.product_code,
        is_vat_included: item.is_vat_included,
        type: '',
        memo: '',
      });
    });
    closeModal();
  }, [selectedItems, addItem, closeModal]);

  const filteredList = useMemo(
    () =>
      getItemQuery.data?.data.item_list.filter((item) => {
        const { type, search_string } = searchState;
        if (type === 'name') {
          return item.product_info.name.toLowerCase().includes(search_string);
        }
        if (type === 'vendor_product_name') {
          return item.product_info.vendor_product_name
            .toLowerCase()
            .includes(search_string);
        }
        if (type === 'vendor_name') {
          return item.vendor_info.vendor_name
            .toLowerCase()
            .includes(search_string);
        }
        return true;
      }),
    [getItemQuery.data?.data.item_list, searchState],
  );

  return (
    <TurtleModal
      centered
      width="90%"
      title={t('warehousing.load')}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      getContainer={false}
      bodyStyle={{ height: '90vh', overflowY: 'auto' }}
    >
      {/*
       * 입고서 리스트 테이블
       */}
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
        dataSource={getSheetQuery.data?.sheet_list}
        loading={getSheetQuery.isLoading}
        pagination={false}
        scroll={{ y: 'auto' }}
        rowKey={(record) => record.id}
        onRow={(record) => ({
          onClick: () => {
            selectSheetId(record.id);
          },
        })}
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
            title: t('product.supply amount'),
            render: (_, record) => record.total_amount.toLocaleString(),
          },
          {
            ellipsis: true,
            align: 'right',
            title: t('product.vat amount'),
            render: (_, record) => record.total_vat_amount.toLocaleString(),
          },
        ]}
      />

      {/*
       *입고 상품 리스트 테이블
       */}
      <MainContent title={t('warehousing.lists')}>
        <Table
          size="small"
          loading={getItemQuery.isLoading}
          pagination={{ position: ['bottomCenter'], showSizeChanger: false }}
          dataSource={filteredList}
          rowKey={(record) => record.id}
          scroll={{ y: 'auto' }}
          title={() => (
            <TurtleTableTitle
              count={getItemQuery.data?.data.total_count ?? 0}
              searchCount={filteredList?.length ?? 0}
              selectedCount={selectedItems?.length ?? 0}
            >
              <NewSearchFilter
                searchQuery={searchState}
                setSearchQuery={setSearchState}
              />
            </TurtleTableTitle>
          )}
          rowSelection={{
            selectedRowKeys: selectedItems.map((item) => item.id),
            onSelect: onClickItemRow,
            hideSelectAll: true,
          }}
          onRow={(record) => ({
            onClick: () => {
              onClickItemRow(record);
            },
          })}
          columns={[
            {
              ellipsis: true,
              title: t('vendor.name'),
              render: (_, record) => record.vendor_info.vendor_name,
            },
            {
              ellipsis: true,
              title: t('vendor.address'),
              render: (_, record) => record.vendor_info.vendor_address,
            },
            {
              ellipsis: true,
              title: t('product.code'),
              render: (_, record) => record.product_info.product_code,
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
              title: t('product.supply price'),
              render: (_, record) => record.supply_price.toLocaleString(),
            },
            {
              ellipsis: true,
              align: 'right',
              title: t('product.vat price'),
              render: (_, record) => record.vat_price.toLocaleString(),
            },
            {
              ellipsis: true,
              align: 'right',
              title: t('product.count'),
              render: (_, record) => record.count,
            },
          ]}
        />
      </MainContent>

      <Row justify="end">
        <TurtleButton type="default" onClick={onClickAddItem}>
          {t('button.add product')}
        </TurtleButton>
      </Row>
    </TurtleModal>
  );
}

export default LoadWarehousingModal;

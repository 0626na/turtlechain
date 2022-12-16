import warehousingAPI, {
  WarehousingItem,
  WarehousingSheet,
} from '@apis/warehousingAPI';
import { SearchFilter, TurtleContentModal } from '@components/combine';
import {
  PrimaryButton,
  TurtleConfirmModal,
  TurtleIcon,
  TurtleTableNumberInput,
  TurtleTableTitle,
} from '@components/element';
import TurtleStatistics from '@components/element/TurtleStatistics';
import useModal from '@hooks/useModal';
import { Checkbox, Row, Table } from 'antd';
import { t } from 'i18next';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { message } from '@utils/message';
interface Props {
  visible: boolean;
  onClose(): void;
  selectedRow?: WarehousingSheet;
}

function DetailModal({ visible, onClose, selectedRow }: Props) {
  const queryClient = useQueryClient();
  const [itemList, setItemList] = useState<WarehousingItem[]>([]);
  const [searchQuery, setSearchQuery] = useState({
    search_string: '',
  });
  const [isUpdated, setIsUpdated] = useState(false);
  const [confirmModalVisible, openConfirmModal, closeConfirmModal] = useModal();
  const [closeModalVisible, openCloseModal, closeCloseModal] = useModal();

  // 입고장 상세내역 리스트 요청
  const getWarehousingItemQuery = useQuery(
    ['getWarehousingItemQuery'],
    () => warehousingAPI.getItem({ sheet_id: selectedRow?.id }),
    {
      enabled: visible && !!selectedRow?.id,
      onSuccess: (data) => {
        setItemList(data.data.item_list);
      },
    },
  );

  // 입고장 상세내역 수정 요청
  const updateWarehousingItemMutation = useMutation(warehousingAPI.updateItem, {
    onSuccess: () => {
      message.success('입고서를 수정했습니다.');
      queryClient.refetchQueries('getWarehousingSheetQuery');
      closeConfirmModal();
      setIsUpdated(false);
    },
  });

  // itemList 값 수정
  const updateItemList = useCallback((type: string, index, value) => {
    setItemList((itemList) =>
      itemList.map((item) =>
        item.id === index ? { ...item, [type]: value } : item,
      ),
    );
    setIsUpdated(true);
  }, []);

  // 상품 삭제
  const deleteProduct = useCallback((record) => {
    setItemList((itemList) =>
      itemList.map((item) =>
        item.id === record.id ? { ...item, is_inactive: true } : item,
      ),
    );
    setIsUpdated(true);
  }, []);

  // 모달 열릴때마다 변경사항 여부 초기화
  useEffect(() => {
    if (visible) return;
    setIsUpdated(false);
    setSearchQuery({
      search_string: '',
    });
  }, [visible]);

  const filteredList = useMemo(
    () =>
      itemList
        .filter((item) => !item.is_inactive)
        .filter(
          (item) =>
            item.product_info.name
              .toLowerCase()
              .includes(searchQuery.search_string) ||
            item.product_info.vendor_product_name
              .toLowerCase()
              .includes(searchQuery.search_string) ||
            item.vendor_info.vendor_name.includes(searchQuery.search_string),
        ),
    [itemList, searchQuery],
  );

  const loading =
    getWarehousingItemQuery.isLoading ||
    updateWarehousingItemMutation.isLoading;

  const confirmClose = () => {
    if (!isUpdated) {
      onClose();
      return;
    }

    openCloseModal();
  };

  return (
    <>
      {/**
       * 수정 컨펌 모달
       */}
      <TurtleConfirmModal
        visible={confirmModalVisible}
        title="정말 수정할까요?"
        description={['해당 입고서를 수정합니다.']}
        onCancel={closeConfirmModal}
        loading={loading}
        okText="수정"
        onOk={() => {
          updateWarehousingItemMutation.mutate({
            sheet_id: selectedRow?.id as number,
            items: itemList.map(({ id, is_inactive, is_reserved, count }) => ({
              id,
              is_inactive,
              is_reserved,
              count,
            })),
          });
        }}
      />
      {/**
       * 모달 닫기 컨펌 모달
       */}
      <TurtleConfirmModal
        visible={closeModalVisible}
        title="정말 닫을까요?"
        description={['수정내용이 있습니다. 지금 닫으면 저장되지 않아요.']}
        onCancel={closeCloseModal}
        onOk={() => {
          closeCloseModal();
          onClose();
        }}
        okText="닫기"
      />
      {/**
       * main modal
       */}
      <TurtleContentModal
        size="large"
        visible={visible}
        title="입고내역 상세보기"
        onClose={confirmClose}
      >
        <TurtleStatistics
          value={[
            {
              title: t('table.createdDate'),
              value: `${selectedRow?.created_date}`,
            },
            {
              title: t('table.totalWarehousingCount'),
              value: `${selectedRow?.total_item_count}건`,
            },
            {
              title: t('table.totalVendorCount'),
              value: `${selectedRow?.total_store_count}개`,
            },

            {
              title: t('table.totalAmount'),
              value: `${selectedRow?.total_amount.toLocaleString()}원`,
            },
          ]}
        />

        <Table
          size="small"
          loading={getWarehousingItemQuery.isLoading}
          dataSource={filteredList}
          rowKey={(record) => record.id}
          scroll={{ x: 950, y: 'auto' }}
          pagination={{
            position: ['bottomCenter'],
            showSizeChanger: false,
          }}
          title={() => (
            <TurtleTableTitle
              totalCount={itemList.filter((item) => !item.is_inactive).length}
              searchCount={filteredList.length}
              searchAmount={filteredList.reduce(
                (cur, acc) => cur + acc.price * acc.count,
                0,
              )}
              rightContent={
                <SearchFilter
                  placeholder={t(
                    'placeholder.search by product name, inventory name, vendor name',
                  )}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              }
            />
          )}
          columns={[
            {
              ellipsis: true,
              title: t('table.warehousingDate'),
              width: 110,
              render: (_, record) => record.warehousing_date,
            },
            {
              ellipsis: true,
              title: t('table.vendorName'),
              render: (_, record) => record.vendor_info.vendor_name,
            },
            {
              ellipsis: true,
              title: t('table.vendorAddress'),
              render: (_, record) => record.vendor_info.vendor_address,
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
              width: 100,
              title: t('table.price'),
              render: (_, record) => record.price.toLocaleString(),
            },
            {
              ellipsis: true,
              align: 'right',
              width: 80,
              title: t('table.warehousingCount'),
              render: (_, record) => (
                <TurtleTableNumberInput
                  disabled={selectedRow?.is_confirmed}
                  min={1}
                  value={record.count}
                  onChange={(value) => {
                    updateItemList('count', record.id, value);
                  }}
                />
              ),
            },
            {
              ellipsis: true,
              width: 80,
              align: 'center',
              title: t('table.isReserveWarehousing'),
              render: (_, record) => (
                <Checkbox
                  checked={record.is_reserved}
                  disabled={selectedRow?.is_confirmed}
                  onChange={() => {
                    updateItemList(
                      'is_reserved',
                      record.id,
                      !record.is_reserved,
                    );
                  }}
                />
              ),
            },
            {
              width: 50,
              align: 'center',
              onCell: (record) => ({
                style: { cursor: 'pointer' },
                onClick: (e) => {
                  e.stopPropagation();
                  deleteProduct(record);
                },
              }),
              render: (_) => (
                <>
                  {!selectedRow?.is_confirmed && <TurtleIcon name="delete" />}
                </>
              ),
            },
          ]}
        />
        <Row justify="end">
          <PrimaryButton onClick={openConfirmModal} disabled={!isUpdated}>
            저장하기
          </PrimaryButton>
        </Row>
      </TurtleContentModal>
    </>
  );
}

export default DetailModal;

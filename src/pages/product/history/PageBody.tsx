import React, { useEffect, useState } from 'react';
import productAPI, { ProductShow, RequestGetList } from '@apis/productAPI';
import SearchFilter from '@components/combine/SearchFilter';
import {
  MemoIcon,
  TurtleConfirmModal,
  TurtleDropdown,
  TurtleIcon,
  TurtleTableTitle,
} from '@components/element';
import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';
import { PageContent, PageTitle } from '@layout/page';
import { Pagination, Row, Table, Typography } from 'antd';
import { message } from '@utils/message';
import { t } from 'i18next';
import { useMutation, useQuery } from 'react-query';
import InputModal from '@components/combine/modal/InputModal';
import { css } from '@emotion/react';
import UpdateProductModal from './modal/UpdateProductModal';

function PageBody() {
  const [selectedRow, selectRow] = useState<ProductShow>();
  const { store } = useStore();
  const [searchQuery, setSearchQuery] = useState<RequestGetList>({
    rt_store_id: store.selected?.id,
    page: 1,
    search_string: '',
  });
  const [removeModalVisible, openRemoveModal, closeRemoveModal] = useModal();
  const [updateModalVisible, openUpdateModal, closeUpdateModal] = useModal();
  const [memoModalVisible, openMemoModal, closeMemoModal] = useModal();

  // 상품 리스트 불러오기 요청
  const getProductListQuery = useQuery(
    ['getProductListQuery', searchQuery],
    () => productAPI.getList(searchQuery),
    {
      enabled: !!searchQuery.rt_store_id,
    },
  );

  //리스트내 상품 삭제
  const removeProductMutation = useMutation(productAPI.remove, {
    onSuccess: () => {
      closeRemoveModal();
      message.success(`상품을 삭제했어요`);
      getProductListQuery.refetch();
    },
  });

  // 상품 수정 요청
  const updateProductQuery = useMutation('updateProduct', productAPI.update, {
    onSuccess: () => {
      message.success('상품 메모를 수정했어요');
      closeMemoModal();
      getProductListQuery.refetch();
    },
  });

  const loading =
    getProductListQuery.isLoading ||
    removeProductMutation.isLoading ||
    updateProductQuery.isLoading;

  // 쇼핑몰 바뀔때 상품 리스트 재검색
  useEffect(() => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      rt_store_id: store.selected?.id,
      page: 1,
    }));
  }, [store.selected]);

  return (
    <>
      {/**
       * 상품정보 수정 모달
       */}
      <UpdateProductModal
        visible={updateModalVisible}
        closeModal={closeUpdateModal}
        selectedRow={selectedRow as ProductShow}
      />
      {/**
       * 메모 수정 모달
       */}
      <InputModal
        visible={memoModalVisible}
        loading={loading}
        onCancel={loading ? () => {} : closeMemoModal}
        defaultValue={selectedRow?.memo}
        onOk={(value) => {
          updateProductQuery.mutate({
            id: selectedRow?.id ?? -1,
            memo: value,
          });
        }}
        title="메모"
        description={[
          '해당 건과 관련해 중요한 내용을 기록해보세요.',
          '개인 메모로도 자유롭게 활용할 수 있어요👀',
        ]}
      />
      {/**
       * 삭제 confirm 모달
       */}
      <TurtleConfirmModal
        title="정말 삭제할까요?"
        description={['삭제 후에는 이전으로 되돌릴 수 없어요.']}
        okText="삭제"
        visible={removeModalVisible}
        loading={loading}
        onCancel={closeRemoveModal}
        onOk={() => {
          removeProductMutation.mutate({
            id: selectedRow?.id ?? -1,
            is_inactive: true,
          });
        }}
      />

      <PageTitle title="상품 리스트" />
      <PageContent>
        <Table
          size="small"
          loading={getProductListQuery.isLoading}
          dataSource={getProductListQuery.data?.data.product_list}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{ y: 'auto', x: 1400 }}
          title={() => (
            <TurtleTableTitle
              totalCount={getProductListQuery.data?.data.total_count ?? 0}
              rightContent={
                <SearchFilter
                  placeholder="거래처명, 상품명, 거래처 상품명 검색"
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              }
            />
          )}
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={getProductListQuery.data?.data.total_count}
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
              title: t('table.vendorCode'),
              render: (_, record) => record.vendor_info.vendor_code,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.vendorName'),
              render: (_, record) => record.vendor_info.vendor_name,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.vendorAddress'),
              render: (_, record) => record.vendor_info.vendor_address,
            },
            {
              ellipsis: true,
              width: 250,
              title: t('table.productName'),
              render: (_, record) => record.name,
            },
            {
              ellipsis: true,
              width: 200,
              title: t('table.vendorProductName'),
              render: (_, record) => record.vendor_product_name,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.productCode'),
              render: (_, record) => record.product_code,
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.option'),
              render: (_, record) => record.option,
            },
            {
              ellipsis: true,
              width: 150,
              align: 'right',
              title: t('table.price'),
              render: (_, record) => record.price.toLocaleString(),
            },
            {
              ellipsis: true,
              width: 150,
              title: t('table.imageUrl'),
              render: (_, record) => (
                <Typography.Link
                  href={record.image_url}
                  target="_blank"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {record.image_url}
                </Typography.Link>
              ),
            },
            {
              width: 50,
              align: 'center',
              title: t('table.memo'),
              render: (_, record) => (
                <MemoIcon
                  onClick={() => {
                    selectRow(record);
                    openMemoModal();
                  }}
                  value={record.memo}
                />
              ),
            },
            {
              width: 30,
              align: 'center',
              render: (record) => (
                <TurtleDropdown
                  items={[
                    {
                      key: '1',
                      label: '상품정보 수정',
                      icon: <TurtleIcon name="updateVendorName" />,
                      onClick: () => {
                        selectRow(record);
                        openUpdateModal();
                      },
                    },
                    {
                      key: '3',
                      type: 'divider',
                    },
                    {
                      key: '4',
                      label: (
                        <span
                          css={css`
                            color: red;
                          `}
                        >
                          삭제
                        </span>
                      ),
                      icon: <TurtleIcon name="delete" danger />,
                      onClick: () => {
                        selectRow(record);
                        openRemoveModal();
                      },
                    },
                  ]}
                  triggerButton={<TurtleIcon name="more" />}
                />
              ),
            },
          ]}
        />
      </PageContent>
    </>
  );
}

export default PageBody;

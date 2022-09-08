import React, { useEffect, useState } from 'react';
import { FileTextOutlined } from '@ant-design/icons';
import productAPI, { ProductShow, RequestGetList } from '@apis/productAPI';
import SearchFilter from '@components/combine/SearchFilter';
import {
  TurtleConfirmModal,
  TurtleIcon,
  TurtleTableTitle,
} from '@components/element';
import useModal from '@hooks/useModal';
import useStore from '@hooks/useStore';
import { PageContent, PageTitle } from '@layout/page';
import { message, Pagination, Row, Table, Typography } from 'antd';
import { t } from 'i18next';
import { useMutation, useQuery } from 'react-query';

function PageBody() {
  const [selectedRow, selectRow] = useState<ProductShow>();
  const { store } = useStore();
  const [searchQuery, setSearchQuery] = useState<RequestGetList>({
    rt_store_id: -1,
    page: 1,
    search_string: '',
    type: 'name',
  });
  const [removeModalVisible, openRemoveModal, closeRemoveModal] = useModal();

  // 상품 리스트 불러오기 요청
  const getProductListQuery = useQuery(
    ['getProductListQuery', searchQuery],
    () => productAPI.getList({ ...searchQuery, rt_store_id: store.id ?? -1 }),
  );

  //리스트내 상품 삭제
  const removeMutation = useMutation(productAPI.remove, {
    onSuccess: () => {
      getProductListQuery.refetch();
      (closeRemoveModal as () => void)();
      message.success(`상품이 삭제되었습니다`);
    },
  });

  const loading = getProductListQuery.isLoading || removeMutation.isLoading;

  // 쇼핑몰 바뀔때 상품 리스트 재검색
  useEffect(() => {
    setSearchQuery((searchQuery) => ({
      ...searchQuery,
      rt_store_id: store.id,
      page: 1,
    }));
  }, [store.id]);

  return (
    <>
      <TurtleConfirmModal
        title="정말 삭제할까요?"
        description={['삭제 후에는 이전으로 되도릴 수 없어요.']}
        okText="네"
        visible={removeModalVisible as boolean}
        loading={loading}
        onCancel={closeRemoveModal as () => void}
        onOk={() => {
          removeMutation.mutate({
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
          expandable={{
            expandedRowRender: (record) => <div>{record.memo}</div>,
            columnWidth: 25,
            expandIcon: ({ onExpand, record }) => {
              return (
                <FileTextOutlined
                  style={record.memo ? {} : { opacity: '0.4', cursor: 'auto' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    record.memo && onExpand(record, e);
                  }}
                />
              );
            },
          }}
          columns={[
            {
              ellipsis: true,
              width: 90,
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
            Table.EXPAND_COLUMN,
            {
              width: 80,
              render: (_, record) => (
                <TurtleIcon
                  name="delete"
                  onClick={() => {
                    selectRow(record);
                    (openRemoveModal as () => void)();
                  }}
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

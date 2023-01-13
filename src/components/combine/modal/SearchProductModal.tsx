import { t } from 'i18next';
import React from 'react';
import { Pagination, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { TurtleTableTitle } from '@components/element';
import { css } from '@emotion/react';
import TurtleContentModal from '@components/element/modal/TurtleContentModal';
import SearchFilter from '../SearchFilter';
import useStore from '@hooks/useStore';
import productAPI, { ProductShow, RequestGetList } from '@apis/productAPI';

interface Props {
  visible: boolean;
  closeModal: () => void;
  onClickSelect: (product: ProductShow) => void;
}

function SearchProductModal({ visible, closeModal, onClickSelect }: Props) {
  const { store } = useStore();

  const [searchQuery, setSearchQuery] = useState<RequestGetList>({
    rt_store_id: store.selected?.id,
    page: 1,
    search_string: '',
  });

  // 상품 리스트 요청
  const getProductListQuery = useQuery(
    ['getProductListQuery', searchQuery],
    () =>
      productAPI.getList({
        ...searchQuery,
        rt_store_id: store.selected?.id ?? -1,
      }),
    {
      enabled: visible,
    },
  );

  useEffect(() => {
    if (visible) return;
    setSearchQuery({
      page: 1,
      search_string: '',
      rt_store_id: store.selected?.id,
    });
  }, [visible, store.selected]);

  const selectPage = (page: number) => {
    setSearchQuery((searchQuery) => ({ ...searchQuery, page }));
  };

  return (
    <div
      css={css`
        z-index: 3;
      `}
    >
      <TurtleContentModal
        size="middle"
        visible={visible}
        title={t('title.search product')}
        onClose={closeModal}
      >
        <Table
          size="small"
          scroll={{ y: 'auto' }}
          loading={getProductListQuery.isLoading}
          dataSource={getProductListQuery.data?.data.product_list}
          rowKey={(record) => record.id}
          pagination={false}
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
                onChange={selectPage}
              />
            </Row>
          )}
          onRow={(record) => {
            return {
              onClick: (event) => {
                onClickSelect(record);
              },
            };
          }}
          columns={[
            {
              ellipsis: true,
              title: t('table.vendorName'),
              render: (_, record) => record.vendor_info.vendor_name,
            },
            {
              ellipsis: true,
              title: t('table.productName'),
              render: (_, record) => record.name,
            },
            {
              ellipsis: true,
              title: t('table.vendorProductName'),
              render: (_, record) => record.vendor_product_name,
            },
            {
              ellipsis: true,
              title: t('table.option'),
              render: (_, record) => record.option,
            },
            {
              ellipsis: true,
              align: 'right',
              title: t('table.price'),
              render: (_, record) => record.price.toLocaleString(),
            },
          ]}
        />
      </TurtleContentModal>
    </div>
  );
}

export default SearchProductModal;

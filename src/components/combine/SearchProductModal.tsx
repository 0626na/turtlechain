import styled from 'styled-components';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { Modal, Pagination, Row, Table } from 'antd';
import { TurtleTableTitle } from '@components/common';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { storeState } from '@store/storeState';
import productAPI, { RequestGetList } from '@apis/productAPI';
import { NewSearchFilter } from '.';

interface Props {
  visible: boolean;
  closeModal: () => void;
  onClickSelect: (
    product_id: number,
    product_name: string,
    vendor_product_name: string,
    product_code: string,
    product_option: string,
    product_price: number,
  ) => void;
  vendorId?: number;
}

function SearchProductModal({
  visible,
  closeModal,
  onClickSelect,
  vendorId,
}: Props) {
  const store = useRecoilValue(storeState);

  const [searchQuery, setSearchQuery] = useState<RequestGetList>({
    rt_store_id: -1,
    vendor_id: -1,
    page: 1,
    search_string: '',
    type: 'name',
  });

  // 상품 리스트 요청
  const getProductListQuery = useQuery(
    ['getProductList', searchQuery],
    () =>
      productAPI.getList({
        ...searchQuery,
        rt_store_id: store.id ?? -1,
        vendor_id: vendorId,
      }),
    {
      enabled: visible && !!vendorId,
    },
  );

  // 쇼핑몰, 거래처 바뀔때 상품 리스트 재검색
  useEffect(() => {
    if (visible) return;
    setSearchQuery(() => ({
      rt_store_id: store.id,
      vendor_id: vendorId,
      search_string: '',
      type: 'name',
      page: 1,
    }));
  }, [visible, store.id, vendorId]);

  return (
    <StyledModal
      centered
      width="55%"
      title={t('product.search')}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      bodyStyle={{ height: '60vh' }}
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
            count={getProductListQuery.data?.data.total_count ?? 0}
          >
            <NewSearchFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </TurtleTableTitle>
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
        onRow={(record) => {
          return {
            onClick: (event) => {
              onClickSelect(
                record.id,
                record.name,
                record.product_code,
                record.vendor_product_name,
                record.option,
                record.price,
              );
              setSearchQuery({
                rt_store_id: -1,
                vendor_id: -1,
                page: 1,
                search_string: '',
                type: 'all',
              });
            },
          };
        }}
        columns={[
          {
            ellipsis: true,
            title: t('product.code'),
            render: (_, record) => record.product_code,
          },
          {
            ellipsis: true,
            title: t('product.name'),
            render: (_, record) => record.name,
          },
          {
            ellipsis: true,
            title: t('product.vendor product name'),
            render: (_, record) => record.vendor_product_name,
          },
          {
            ellipsis: true,
            title: t('product.option'),
            render: (_, record) => record.option,
          },
          {
            ellipsis: true,
            title: t('product.price'),
            render: (_, record) => record.price.toLocaleString(),
          },
        ]}
      />
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
  .ant-modal-header {
    background-color: #f3f6f9;
  }
`;

export default SearchProductModal;

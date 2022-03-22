import { message, Modal, Pagination, Row, Table } from "antd";
import productAPI, { RequestGetProductList } from "apis/productAPI";
import { AxiosError } from "axios";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import styled from "styled-components";
import SearchFilter from "./SearchFilter";

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

function SearchProductModal({ visible, closeModal, onClickSelect, vendorId }: Props) {
  const store = useRecoilValue(storeState);

  const [searchQuery, setSearchQuery] = useState<RequestGetProductList>({
    rt_store_id: -1,
    vendor_id: -1,
    page: 1,
    search_string: "",
    type: "all",
  });

  const getProductListQuery = useQuery(
    ["getProductList", searchQuery], //
    () =>
      productAPI.getProductList({
        ...searchQuery,
        rt_store_id: store.id ?? -1,
        vendor_id: vendorId,
      }),
    {
      enabled: visible && !!vendorId,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: () => {},
    },
  );

  // 쇼핑몰, 거래처 바뀔때 상품 리스트 재검색
  useEffect(() => {
    setSearchQuery({
      ...searchQuery,
      rt_store_id: store.id,
      vendor_id: vendorId,
      search_string: "",
      type: "all",
    });
  }, [store.id, vendorId]);

  // 검색 버튼 클릭
  const searchProductList = useCallback(
    ({ type, search_string }) => {
      setSearchQuery({
        ...searchQuery,
        page: 1,
        type,
        search_string,
      });
    },
    [searchQuery],
  );

  // 페이지 선택
  const selectPage = useCallback(
    (page) => {
      setSearchQuery({ ...searchQuery, page });
    },
    [searchQuery],
  );

  return (
    <StyledModal
      centered
      width="45%"
      title={t("product.search")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      bodyStyle={{ height: "60vh" }}
    >
      <Table
        size="small"
        scroll={{ y: "auto" }}
        loading={getProductListQuery.isLoading}
        dataSource={getProductListQuery.data?.data.product_list}
        rowKey={(record) => record.id}
        pagination={false}
        title={() => (
          <Row justify="space-between">
            {`총 ${getProductListQuery.data?.data.total_count ?? 0}개`}
            <SearchFilter type="product" onSearch={searchProductList} />
          </Row>
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
                search_string: "",
                type: "all",
              });
            },
          };
        }}
        columns={[
          {
            ellipsis: true,
            title: t("product.code"),
            render: (_, record) => record.product_code,
          },
          {
            ellipsis: true,
            title: t("product.name"),
            render: (_, record) => record.name,
          },
          {
            ellipsis: true,
            title: t("product.vendor product name"),
            render: (_, record) => record.vendor_product_name,
          },
          {
            ellipsis: true,
            title: t("product.option"),
            render: (_, record) => record.option,
          },
          {
            ellipsis: true,
            title: t("product.price"),
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

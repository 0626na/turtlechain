import { message, Pagination, Row, Table } from "antd";
import productAPI, { RequestGetProductList } from "apis/productAPI";
import { AxiosError } from "axios";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import TurtleText from "components/common/TurtleText";
import SearchFilter from "components/SearchFilter";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { storeIdState } from "store/storeIdState";
import { FileTextOutlined } from "@ant-design/icons";

function ProductList() {
  const storeId = useRecoilValue(storeIdState);

  const [searchQuery, setSearchQuery] = useState<RequestGetProductList>({
    rt_store_id: -1,
    page: 1,
    search_string: "",
    type: "all",
  });

  const getProductListQuery = useQuery(
    ["getProductList", searchQuery], //
    () => productAPI.getProductList({ ...searchQuery, rt_store_id: storeId ?? -1 }),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: () => {},
    },
  );

  // 쇼핑몰 바뀔때 상품 리스트 재검색
  useEffect(() => {
    setSearchQuery({ ...searchQuery, rt_store_id: storeId });
  }, [storeId]);

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
    <>
      <div>
        <TurtleText>{t("product.lists")}</TurtleText>
        <SearchFilter type="product" onSearch={searchProductList} />
      </div>
      <Table
        size="small"
        loading={getProductListQuery.isLoading}
        dataSource={getProductListQuery.data?.data.product_list}
        rowKey={(record) => record.id}
        pagination={false}
        expandable={{
          expandedRowRender: (record) => <div>{record.memo}</div>,
          columnWidth: 25,
          expandIcon: ({ expanded, onExpand, record }) => {
            return (
              <FileTextOutlined
                style={record.memo ? {} : { opacity: "0.4" }}
                onClick={(e) => {
                  record.memo && onExpand(record, e);
                }}
              />
            );
          },
        }}
        columns={[
          {
            ellipsis: true,
            title: "거래처 코드",
            render: (_, record) => record.vendor_info.vendor_code,
          },
          {
            ellipsis: true,
            title: "거래처명",
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: "거래처주소",
            render: (_, record) => record.vendor_info.vendor_address,
          },
          {
            ellipsis: true,
            title: "상품명",
            render: (_, record) => record.name,
          },
          {
            ellipsis: true,
            title: "거래처 상품명",
            render: (_, record) => record.vendor_product_name,
          },
          {
            ellipsis: true,
            title: "상품 바코드",
            render: (_, record) => record.product_code,
          },
          {
            ellipsis: true,
            title: "옵션",
            render: (_, record) => record.option,
          },
          {
            ellipsis: true,
            title: "공급가(원)",
            render: (_, record) => record.price,
          },
          Table.EXPAND_COLUMN,
          {
            ellipsis: true,
            title: "메모",
          },
          {
            ellipsis: true,
            title: "상품이미지URL",
            render: (_, record) => record.image_url,
          },
          {
            ellipsis: true,
            title: "수정",
            render: (_, record) => (
              <TurtleButtonSub //
                size="small"
                color="green"
                onClick={() => {}}
              >
                수정하기
              </TurtleButtonSub>
            ),
          },
        ]}
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
      />
    </>
  );
}

export default ProductList;

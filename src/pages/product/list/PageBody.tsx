import { message, Pagination, Row, Table } from "antd";
import productAPI, { ProductShow, RequestGetList } from "apis/productAPI";
import { AxiosError } from "axios";
import { t } from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import { FileTextOutlined } from "@ant-design/icons";
import { MainContent, MenuBar } from "layouts/main";
import { TurtleTableTitle, TurtleText } from "components/common";
import { NewSearchFilter, SearchFilter } from "components/combine";
import UpdateProductModal from "./UpdateProductModal";

function PageBody() {
  const store = useRecoilValue(storeState);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedRow, selectRow] = useState<ProductShow>();
  const [searchQuery, setSearchQuery] = useState<RequestGetList>({
    rt_store_id: -1,
    page: 1,
    search_string: "",
    type: "all",
  });

  // 상품 리스트 불러오기 요청
  const getListQuery = useQuery(
    ["getProductList", searchQuery], //
    () => productAPI.getList({ ...searchQuery, rt_store_id: store.id ?? -1 }),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: () => {},
    },
  );

  // 쇼핑몰 바뀔때 상품 리스트 재검색
  useEffect(() => {
    setSearchQuery((searchQuery) => ({ ...searchQuery, rt_store_id: store.id, page: 1 }));
  }, [store.id]);

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
      <MenuBar />

      <MainContent title={t("product.lists")}>
        <Table
          size="small"
          loading={getListQuery.isLoading}
          dataSource={getListQuery.data?.data.product_list}
          rowKey={(record) => record.id}
          pagination={false}
          scroll={{ y: "auto" }}
          title={() => (
            <TurtleTableTitle count={getListQuery.data?.data.total_count ?? 0}>
              <NewSearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </TurtleTableTitle>
          )}
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={getListQuery.data?.data.total_count}
                showSizeChanger={false}
                current={searchQuery.page}
                onChange={selectPage}
              />
            </Row>
          )}
          onRow={(record) => {
            return {
              onClick: (event) => {
                selectRow(record);
                setUpdateModalVisible(true);
              },
            };
          }}
          expandable={{
            expandedRowRender: (record) => <div>{record.memo}</div>,
            columnWidth: 25,
            expandIcon: ({ expanded, onExpand, record }) => {
              return (
                <FileTextOutlined
                  style={record.memo ? {} : { opacity: "0.4", cursor: "auto" }}
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
              title: t("vendor.code"),
              render: (_, record) => record.vendor_info.vendor_code,
            },
            {
              ellipsis: true,
              width: "8%",
              title: t("vendor.name"),
              render: (_, record) => record.vendor_info.vendor_name,
            },
            {
              ellipsis: true,
              width: "10%",
              title: t("vendor.address"),
              render: (_, record) => record.vendor_info.vendor_address,
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
              width: 120,
              title: t("product.code"),
              render: (_, record) => record.product_code,
            },
            {
              ellipsis: true,
              width: "10%",
              title: t("product.option"),
              render: (_, record) => record.option,
            },
            {
              ellipsis: true,
              width: 100,
              title: t("product.price"),
              render: (_, record) => record.price.toLocaleString(),
            },
            {
              ellipsis: true,
              title: t("product.image url"),
              render: (_, record) => record.image_url,
            },
            Table.EXPAND_COLUMN,
          ]}
        />

        {/* 상품 수정 모달 */}
        <UpdateProductModal
          visible={updateModalVisible}
          closeModal={() => {
            getListQuery.refetch();
            setUpdateModalVisible(false);
          }}
          selectedRow={selectedRow}
        />
      </MainContent>
    </>
  );
}

export default PageBody;

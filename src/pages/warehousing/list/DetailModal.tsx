import { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "react-query";
import warehousingAPI, { WarehousingItemShow, WarehousingSheet } from "apis/warehousingAPI";
import { DeleteOutlined, SyncOutlined } from "@ant-design/icons";
import {
  Modal,
  Table,
  message,
  InputNumber,
  Button,
  Popconfirm,
  notification,
  Statistic,
  Card,
  Row,
  Col,
  Space,
} from "antd";
import { t } from "i18next";
import { TurtleModal, TurtleTableTitle } from "components/common";

interface Props {
  visible: boolean;
  onClose: () => void;
  sheet?: WarehousingSheet;
}

function DetailModal({ visible, onClose, sheet }: Props) {
  const queryClient = useQueryClient();
  const [productList, setProductList] = useState<Array<WarehousingItemShow>>([]);
  const [isUpdated, setIsUpdated] = useState(false);

  // 입고장 상세내역 리스트 요청
  const getProductQuery = useQuery(
    ["getWarehousingItem"],
    () => warehousingAPI.getItem({ sheet_id: sheet?.id! }),
    {
      enabled: visible && !!sheet?.id,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        setProductList(data.data.item_list);
      },
    },
  );

  // 입고장 상세내역 수정 요청
  const updateProductQuery = useMutation(
    ["updateWarehousingItem"], //
    warehousingAPI.updateItem,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: () => {
        notification.open({
          type: "success",
          message: t("message.success update warehousing detail list"),
        });
        queryClient.refetchQueries("getWarehousingSheet");
        onClose();
      },
    },
  );

  // 모달 열릴때마다 변경사항 여부 초기화
  useEffect(() => {
    setIsUpdated(false);
  }, [visible]);

  // 필터된 리스트
  const filteredList = useMemo(
    () => productList.filter((product) => !product.is_inactive),
    [productList],
  );

  // // 검색
  // const searchProductList = useCallback(
  //   ({ type, search_string }) => {
  //     console.log(type, search_string);
  //     setProductListShow(
  //       productList.filter((product) => {
  //         if (type === "name") {
  //           return product.product_info.name.includes(search_string);
  //         }
  //         if (type === "vendor_product_name") {
  //           return product.product_info.vendor_product_name.includes(search_string);
  //         }
  //         if (type === "vendor_name") {
  //           return product.vendor_info.vendor_name.includes(search_string);
  //         }
  //         return (
  //           product.product_info.name.includes(search_string) ||
  //           product.product_info.vendor_product_name.includes(search_string) ||
  //           product.vendor_info.vendor_name.includes(search_string)
  //         );
  //       }),
  //     );
  //   },
  //   [productList],
  // );

  // const totalItemCount = useMemo(
  //   () => list.reduce((sum, current) => sum + current.count, 0),
  //   [list, searchType, searchText],
  // );

  // const totalItemAmount = useMemo(
  //   () => list.reduce((sum, current) => sum + current.count * current.price, 0),
  //   [list, searchType, searchText],
  // );

  // 모달창 닫기
  const confirmClose = () => {
    if (!isUpdated) {
      onClose();
      return;
    }
    Modal.confirm({
      title: t("description.changed data"),
      cancelText: t("button.return"),
      okText: t("button.close"),
      onCancel: () => {},
      onOk: () => {
        onClose();
      },
    });
  };

  // 수량 변경
  const setCount = useCallback(
    (record, value) => {
      setProductList(
        productList.map((product) =>
          product.id === record.id ? { ...product, count: value } : product,
        ),
      );
      setIsUpdated(true);
    },
    [productList],
  );

  // 상품 삭제
  const deleteProduct = useCallback(
    (record) => {
      setProductList(
        productList?.map((product) =>
          product.id === record.id ? { ...product, is_inactive: true } : product,
        ),
      );
      setIsUpdated(true);
    },
    [productList],
  );

  return (
    <TurtleModal //
      centered
      width="90%"
      bodyStyle={{ height: "80vh", overflow: "auto" }}
      title={`${t("warehousing.detail list")}`}
      visible={visible}
      onCancel={confirmClose}
      footer={
        !sheet?.is_confirmed && [
          <Popconfirm
            title={t("description.really update")}
            okText={t("yes")}
            cancelText={t("no")}
            onConfirm={() => {
              updateProductQuery.mutate({
                sheet_id: sheet?.id!,
                items: productList.map((product) => ({
                  id: product.id,
                  is_inactive: product.is_inactive,
                  count: product.count,
                })),
              });
            }}
          >
            <Button //
              type="primary"
              icon={<SyncOutlined />}
              loading={updateProductQuery.isLoading}
            >
              {t("reflect update")}
            </Button>
          </Popconfirm>,
        ]
      }
    >
      <Row gutter={16}>
        <Col span={5}>
          <Card>
            <Statistic //
              title={t("warehousing.date")}
              value={sheet?.created_date}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic //
              title={t("warehousing.total count")}
              value={`${sheet?.total_item_count}건`}
            />
          </Card>
        </Col>
        <Col span={5}>
          <Card>
            <Statistic //
              title={t("total supply price")}
              value={`${sheet?.total_price.toLocaleString()}원`}
            />
          </Card>
        </Col>
      </Row>

      <Table
        size="small"
        loading={getProductQuery.isLoading}
        pagination={false}
        dataSource={filteredList}
        rowKey={(product) => product.id}
        style={{ height: "60vh", paddingTop: 30 }}
        title={() => (
          <TurtleTableTitle count={filteredList.length ?? 0}>
            {/* <SearchFilter
              type="product"
              onSearch={({ type, search_string }) => searchProductList({ type, search_string })}
            /> */}
          </TurtleTableTitle>
        )}
        columns={[
          {
            ellipsis: true,
            title: t("vendor.name"),
            render: (_, record) => record.vendor_info.vendor_name,
          },
          {
            ellipsis: true,
            title: t("vendor.address"),
            render: (_, record) => record.vendor_info.vendor_address,
          },
          {
            ellipsis: true,
            title: t("product.code"),
            render: (_, record) => record.product_info.product_code,
          },
          {
            ellipsis: true,
            title: t("product.name"),
            render: (_, record) => record.product_info.name,
          },
          {
            ellipsis: true,
            title: t("product.vendor product name"),
            render: (_, record) => record.product_info.vendor_product_name,
          },
          {
            ellipsis: true,
            title: t("product.option"),
            render: (_, record) => record.product_info.option,
          },
          {
            ellipsis: true,
            title: t("product.price"),
            render: (_, record) => record.price.toLocaleString(),
          },
          {
            ellipsis: true,
            title: t("warehousing.count"),
            render: (_, record) => (
              <InputNumber //
                disabled={sheet?.is_confirmed}
                min={1}
                size="small"
                defaultValue={record.count}
                onChange={(value) => {
                  setCount(record, value);
                }}
              />
            ),
          },
          {
            width: 100,
            align: "center",
            title: "",
            dataIndex: "action",
            render: (_, record) => (
              <Space>
                {!sheet?.is_confirmed && (
                  <DeleteOutlined
                    style={{ cursor: "pointer", color: "#A1A2A6" }}
                    onClick={() => {
                      deleteProduct(record);
                    }}
                  />
                )}
              </Space>
            ),
          },
        ]}
      />
    </TurtleModal>
  );
}

export default DetailModal;

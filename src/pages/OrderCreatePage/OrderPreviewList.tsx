import { Button, Row, Table } from "antd";
import { CreateOrderItem } from "apis/orderAPI";
import TurtleText from "components/common/TurtleText";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import TurtleButton from "components/common/TurtleButton";
import { t } from "i18next";
import { useMemo } from "react";

interface Props {
  list: Array<CreateOrderItem>;
  deleteItem: (id: number) => void;
}
const OrderPreviewList = function ({ list, deleteItem }: Props) {
  const makeType = (type: string) => {
    if (type === "order") return "주문";
    else if (type === "reserve") return "미송";
    else if (type === "takeback") return "반품";
    else if (type === "exchange") return "교환";
    else if (type === "sample") return "샘플";
    else if (type === "pickup") return "픽업";
    else return "기타";
  };

  return (
    <Row>
      <TurtleText>{t("order.preview list")}</TurtleText>
      <Table
        size="small"
        scroll={{ x: 1000, y: 400 }}
        pagination={false}
        dataSource={list}
        rowKey={(record) => record.product_id}
        columns={[
          {
            ellipsis: true,
            title: t("vendor.name"),
            dataIndex: "vendor_name",
          },
          {
            ellipsis: true,
            title: t("vendor.address"),
            dataIndex: "vendor_address",
          },
          {
            ellipsis: true,
            title: t("vendor.store phone"),
            dataIndex: "vendor_phone",
          },
          {
            ellipsis: true,
            title: t("product.code"),
            dataIndex: "product_code",
          },
          {
            ellipsis: true,
            title: t("product.name"),
            dataIndex: "product_name",
          },
          {
            ellipsis: true,
            title: t("product.option"),
            dataIndex: "product_option",
          },
          {
            ellipsis: true,
            title: t("product.count"),
            dataIndex: "count",
          },
          {
            ellipsis: true,
            title: t("product.price"),
            dataIndex: "price",
          },
          {
            ellipsis: true,
            title: t("order.type."),
            dataIndex: "type",
            render: (_, record) => makeType(record.type),
          },
          {
            title: t("order.memo"),
            dataIndex: "memo",
          },
          {
            width: 100,
            align: "center",
            title: "",
            dataIndex: "action",
            render: (_, record) => (
              <TurtleButtonSub //
                size="small"
                color="red"
                onClick={() => {
                  deleteItem(record.product_id);
                }}
              >
                {t("button.delete")}
              </TurtleButtonSub>
            ),
          },
        ]}
        footer={() => (
          <Row justify="end">
            <TurtleButton
            //disabled={!list.length /* || isLoading */}
            //loading={isLoading}
            >
              {t("order.create")}
            </TurtleButton>
          </Row>
        )}
      />
    </Row>
  );
};

export default OrderPreviewList;

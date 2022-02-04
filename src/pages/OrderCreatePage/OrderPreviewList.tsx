import { useTranslation } from "react-i18next";
import { UploadOutlined, DeleteFilled } from "@ant-design/icons";
import { Button, Row, Table } from "antd";
import { CreateOrderItem } from "apis/orderAPI";
import TurtleText from "components/common/TurtleText";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import TurtleButton from "components/common/TurtleButton";

interface Props {
  list: Array<CreateOrderItem>;
  setList: React.Dispatch<React.SetStateAction<CreateOrderItem[]>>;
}

const OrderPreviewList = function ({ list, setList }: Props) {
  const { t } = useTranslation();

  return (
    <Row>
      <TurtleText>{t("order.preview list")}</TurtleText>
      <Table
        size="small"
        scroll={{ x: 1000, y: 400 }}
        pagination={false}
        dataSource={list}
        rowKey={(record) => record.product_code}
        columns={[
          {
            title: t("vendor.name"),
            dataIndex: "vendor_name",
          },
          {
            title: t("vendor.address"),
            dataIndex: "vendor_address",
          },
          {
            title: t("vendor.phone"),
            dataIndex: "vendor_phone",
          },
          {
            title: t("product.code"),
            dataIndex: "product_code",
          },
          {
            title: t("product.name"),
            dataIndex: "product_name",
          },
          {
            title: t("product.option"),
            dataIndex: "product_option",
          },
          {
            title: t("product.count"),
            dataIndex: "product_count",
          },
          {
            title: t("product.price"),
            dataIndex: "product_price",
          },
          {
            title: t("order.type."),
            dataIndex: "order_type",
          },
          {
            title: t("order.memo"),
            dataIndex: "order_memo",
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
                  const newList = list.filter((item) => item.product_code !== record.product_code);
                  setList(newList);
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

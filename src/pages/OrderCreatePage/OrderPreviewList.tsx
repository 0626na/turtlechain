import styled from "styled-components";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { UploadOutlined, DeleteFilled } from "@ant-design/icons";
import { Button, Row, Space, Table, Typography } from "antd";
import { CreateOrderItem } from "apis/orderAPI";
import TurtleText from "components/common/TurtleText";

interface Props {
  list: Array<CreateOrderItem>;
  setList: React.Dispatch<React.SetStateAction<CreateOrderItem[]>>;
}

const OrderPreviewList = function ({ list, setList }: Props) {
  const { t } = useTranslation();

  return (
    <Row>
      <TurtleText>{`${t("order sheet")} ${t("preview")}`}</TurtleText>
      <Table
        size="small"
        scroll={{ x: 1000, y: 400 }}
        pagination={false}
        dataSource={list}
        rowKey={(record) => record.product_code}
        columns={[
          {
            title: t("product code"),
            dataIndex: "product_code",
          },
          {
            title: t("client name"),
            dataIndex: "store_name",
          },
          {
            title: t("client address"),
            dataIndex: "address",
          },
          {
            title: t("phone"),
            dataIndex: "phone",
          },
          {
            title: t("product name"),
            dataIndex: "product_name",
          },
          {
            title: t("option"),
            dataIndex: "option",
          },
          {
            title: t("order count"),
            dataIndex: "order_count",
          },
          {
            title: t("supply price"),
            dataIndex: "price",
          },
          {
            title: t("order type"),
            dataIndex: "order_type",
          },
          {
            title: t("memo"),
            dataIndex: "memo",
          },
          {
            width: 100,
            align: "center",
            title: "",
            dataIndex: "action",
            render: (_, record) => (
              <Button //
                danger
                size="small"
                shape="round"
                type="primary"
                icon={<DeleteFilled />}
                onClick={() => {
                  const newList = list.filter((item) => item.product_code !== record.product_code);
                  setList(newList);
                }}
              >
                {t("delete")}
              </Button>
            ),
          },
        ]}
        footer={() => (
          <Row justify="end">
            <Button //
              icon={<UploadOutlined />}
              disabled={!list.length /* || isLoading */}
              //loading={isLoading}
              type="primary"
            >
              {t("order create")}
            </Button>
          </Row>
        )}
      />
    </Row>
  );
};

export default OrderPreviewList;

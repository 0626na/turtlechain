import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { DeleteFilled, UploadOutlined } from "@ant-design/icons";
import { Table, Button, Popconfirm, Input } from "antd";
import { AdjustmentItem } from "apis/adjustmentAPI";
import React, { useMemo } from "react";
import { numberTextFormat } from "utils/general";



interface Props {

  isLoading:boolean;
  adjList:Array<AdjustmentItem>;
  setAdjList: React.Dispatch<React.SetStateAction<AdjustmentItem[]>>;
  onSubmit: () => void;
}

const WarehousingSheetList = function ({isLoading, adjList, setAdjList, onSubmit}: Props) {
  const { t } = useTranslation();

    // 매입조정 합계
    const totalAdjValue = useMemo(
      () => adjList.reduce((acc, cur) => acc + cur.adj_count * cur.product_price, 0),
      [adjList]
    );
    
  return (
    <Table
      size="small"
      scroll={{ x: "auto", y: 400 }}
      pagination={false}
      dataSource={adjList}
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
          title: t("account info"),
          dataIndex: "account_info",
        },
        {
          width: 100,
          align: "center",
          title: t("adjustment type"),
          dataIndex: "type",
        },
        {
          title: t("supply price"),
          render:(_, record) => numberTextFormat(record.product_price, "currency")  
        },
        {
          width: 100,
          align: "center",
          title: " ",
          dataIndex: "action",
          render: (_, record) => (
            <Button //
              danger
              icon={<DeleteFilled />}
              size="small"
              shape="round"
              type="primary"
            >
              {t("delete")}
            </Button>
          ),
        },
      ]}
      footer={() => (
        <Footer>
          <b>
            {`${t("total supply price")} : `}
            {numberTextFormat(totalAdjValue, "currency")}
          </b>
          <Popconfirm
            title={t("description.really register")}
            okText={t("yes")}
            cancelText={t("no")}
            onConfirm={() => {
              onSubmit();
            }}
          >
            <Button //
              icon={<UploadOutlined />}
              disabled={!adjList.length || isLoading}
              loading={isLoading}
              type="primary"
            >
              {t("adjustment create")}
            </Button>
          </Popconfirm>
        </Footer>
      )}
    />
  );
};

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default WarehousingSheetList;

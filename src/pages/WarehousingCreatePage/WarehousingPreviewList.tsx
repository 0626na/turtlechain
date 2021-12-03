import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { Button, Table, Popconfirm, Typography } from "antd";

const WarehousingPreviewList = function () {
  const { t } = useTranslation();
  return (
    <Table
      size="small"
      pagination={false}
      dataSource={[]}
      columns={[
        {
          title: t("wholesaler name"),
          dataIndex: "store_name",
        },
        {
          title: t("wholesaler address"),
          dataIndex: "address",
        },
        {
          title: t("product code"),
          dataIndex: "product_code",
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
          title: t("warehousing quantity"),
          dataIndex: "count",
        },
        {
          title: t("product price"),
          dataIndex: "price",
        },
      ]}
      title={() => (
        <TopContainer>
          <Typography.Text strong>
            {t("warehousing")} {t("list")} {t("preview")}
          </Typography.Text>
        </TopContainer>
      )}
      footer={() => (
        <BottomContainer>
          <Popconfirm
            title={t("description.really register")}
            okText={t("yes")}
            cancelText={t("no")}
          >
            <Button type="primary">{t("warehousing create")}</Button>
          </Popconfirm>
        </BottomContainer>
      )}
    />
  );
};

const TopContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export default WarehousingPreviewList;

import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { CreateSheetItem } from "apis/warehousingAPI";

import { UploadOutlined } from "@ant-design/icons";
import { Button, Table, Popconfirm, Typography } from "antd";

interface Props {
  previewList: Array<CreateSheetItem>;
  isCreating: boolean;
  onCreate: () => void;
}

const WarehousingPreviewList = function ({
  previewList,
  isCreating,
  onCreate,
}: Props) {
  const { t } = useTranslation();
  const columns = [
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
  ];

  return (
    <Table
      size="small"
      pagination={false}
      dataSource={previewList}
      columns={columns}
      title={() => (
        <TopContainer>
          <Typography.Text strong>
            {t("warehousing")} {t("list")} {t("preview")}{" "}
            {`(${previewList.length.toLocaleString()})`}
          </Typography.Text>
        </TopContainer>
      )}
      footer={() => (
        <BottomContainer>
          <Popconfirm
            disabled={!previewList.length || isCreating}
            title={t("description.really register")}
            okText={t("yes")}
            cancelText={t("no")}
            onConfirm={onCreate}
          >
            <Button //
              icon={<UploadOutlined />}
              disabled={!previewList.length || isCreating}
              loading={isCreating}
              type="primary"
            >
              {t("warehousing create")}
            </Button>
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

import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { CreateSheetItem } from "apis/warehousingAPI";

import { UploadOutlined, DeleteFilled } from "@ant-design/icons";
import {
  Button,
  Table,
  Popconfirm,
  Typography,
  Input,
  InputNumber,
} from "antd";

interface SheetItem extends CreateSheetItem {
  temp_id: number;
}

interface Props {
  isLoading: boolean;
  list: Array<SheetItem>;
  setList: React.Dispatch<React.SetStateAction<SheetItem[]>>;
  onSubmit: () => void;
}

const WarehousingPreviewList = function ({
  isLoading,
  list,
  setList,
  onSubmit,
}: Props) {
  const { t } = useTranslation();
  return (
    <Table
      size="small"
      pagination={false}
      dataSource={list}
      rowKey={(record) => record.temp_id}
      columns={[
        {
          title: t("wholesaler name"),
          dataIndex: "store_name",
          render: (_, record) => {
            return (
              <Input //
                size="small"
                defaultValue={record.store_name}
                onChange={(e) => {
                  setList(
                    list.map((item) =>
                      item.temp_id === record.temp_id
                        ? { ...item, store_name: e.target.value }
                        : item
                    )
                  );
                }}
              />
            );
          },
        },
        {
          title: t("wholesaler address"),
          dataIndex: "address",
          render: (_, record) => {
            return (
              <Input //
                size="small"
                defaultValue={record.address}
                onChange={(e) => {
                  setList(
                    list.map((item) =>
                      item.temp_id === record.temp_id
                        ? { ...item, address: e.target.value }
                        : item
                    )
                  );
                }}
              />
            );
          },
        },
        {
          title: t("product code"),
          dataIndex: "product_code",
          render: (_, record) => {
            return (
              <Input //
                size="small"
                value={record.product_code}
                onChange={(e) => {
                  setList(
                    list.map((item) =>
                      item.temp_id === record.temp_id
                        ? { ...item, product_code: e.target.value }
                        : item
                    )
                  );
                }}
              />
            );
          },
        },
        {
          title: t("product name"),
          dataIndex: "product_name",
          render: (_, record) => {
            return (
              <Input //
                size="small"
                defaultValue={record.product_name}
                onChange={(e) => {
                  setList(
                    list.map((item) =>
                      item.temp_id === record.temp_id
                        ? { ...item, product_name: e.target.value }
                        : item
                    )
                  );
                }}
              />
            );
          },
        },
        {
          title: t("option"),
          dataIndex: "option",
          render: (_, record) => {
            return (
              <Input //
                size="small"
                value={record.option}
                onChange={(e) => {
                  setList(
                    list.map((item) =>
                      item.temp_id === record.temp_id
                        ? { ...item, option: e.target.value }
                        : item
                    )
                  );
                }}
              />
            );
          },
        },
        {
          title: t("warehousing quantity"),
          dataIndex: "count",
          render: (_, record) => {
            return (
              <InputNumber //
                size="small"
                value={record.count}
                onChange={(value) => {
                  setList(
                    list.map((item) =>
                      item.temp_id === record.temp_id
                        ? { ...item, count: value }
                        : item
                    )
                  );
                }}
              />
            );
          },
        },
        {
          title: t("product price"),
          dataIndex: "price",
          render: (_, record) => {
            return (
              <InputNumber //
                size="small"
                defaultValue={record.price}
                onChange={(value) => {
                  setList(
                    list.map((item) =>
                      item.temp_id === record.temp_id
                        ? { ...item, price: value }
                        : item
                    )
                  );
                }}
              />
            );
          },
        },
        {
          title: "",
          dataIndex: "action",
          align: "center",
          render: (_, record) => {
            return (
              <Button //
                danger
                icon={<DeleteFilled />}
                size="small"
                shape="round"
                type="primary"
                onClick={() => {
                  setList(
                    list.filter((item) => item.temp_id !== record.temp_id)
                  );
                }}
              >
                {t("delete")}
              </Button>
            );
          },
        },
      ]}
      title={() => (
        <TopContainer>
          <Typography.Text strong>
            {t("warehousing")} {t("list")} {t("preview")}{" "}
            {`(${list.length.toLocaleString()})`}
          </Typography.Text>
        </TopContainer>
      )}
      footer={() => (
        <BottomContainer>
          <Popconfirm
            disabled={!list.length || isLoading}
            title={t("description.really register")}
            okText={t("yes")}
            cancelText={t("no")}
            onConfirm={onSubmit}
          >
            <Button //
              icon={<UploadOutlined />}
              disabled={!list.length || isLoading}
              loading={isLoading}
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

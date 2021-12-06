import styled from "styled-components";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateSheetItem } from "apis/warehousingAPI";

import { UploadOutlined, DeleteFilled } from "@ant-design/icons";
import {
  Button,
  Table,
  Popconfirm,
  Typography,
  InputNumber,
  Form,
  Select,
  Input,
} from "antd";

type SearchType = "store_name" | "address" | "product_code" | "product_name";

interface Props {
  isLoading: boolean;
  list: Array<CreateSheetItem>;
  setList: React.Dispatch<React.SetStateAction<CreateSheetItem[]>>;
  onSubmit: () => void;
}

const WarehousingPreviewList = function ({
  isLoading,
  list,
  setList,
  onSubmit,
}: Props) {
  const { t } = useTranslation();

  const [searchType, setSearchType] = useState<SearchType>("store_name");
  const [searchText, setSearchText] = useState("");

  // 필터된 리스트
  const filteredList = useMemo(
    () =>
      list.filter((item) =>
        item[searchType].toString().indexOf(searchText) !== -1 ? true : false
      ),
    [list, searchType, searchText]
  );

  // 입고 수량 합계
  const totalItemCount = useMemo(
    () => list.reduce((acc, cur) => acc + cur.count, 0),
    [list]
  );

  // 입고 금액 합계
  const totalItemPrice = useMemo(
    () => list.reduce((acc, cur) => acc + cur.count * cur.price, 0),
    [list]
  );

  return (
    <TableContainer>
      <Typography.Text strong>
        {t("warehousing")} {t("list")} {t("preview")}{" "}
        {`(${list.length.toLocaleString()})`}
      </Typography.Text>
      <Form layout="inline">
        <Form.Item>
          <Select
            style={{ width: 150 }}
            value={searchType}
            onChange={(value) => {
              setSearchType(value);
            }}
          >
            <Select.Option value="store_name">
              {t("wholesaler name")}
            </Select.Option>
            <Select.Option value="address">
              {t("wholesaler address")}
            </Select.Option>
            <Select.Option value="product_code">
              {t("product code")}
            </Select.Option>
            <Select.Option value="product_name">
              {t("product name")}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Input
            value={searchText}
            placeholder={t("search text")}
            onChange={(e) => {
              setSearchText(e.target.value);
            }}
          />
        </Form.Item>
      </Form>
      <Table
        size="small"
        scroll={{ y: 400 }}
        pagination={false}
        dataSource={filteredList}
        rowKey={(record) => record.product_code}
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
            align: "right",
            title: t("warehousing quantity"),
            dataIndex: "count",
            render: (_, record) => {
              return (
                <InputNumber //
                  size="small"
                  defaultValue={record.count}
                  onChange={(value) => {
                    const newList = list.map((item) =>
                      item.product_code === record.product_code
                        ? { ...item, count: value }
                        : item
                    );
                    setList(newList);
                  }}
                />
              );
            },
          },
          {
            align: "right",
            title: t("product price"),
            dataIndex: "price",
          },
          {
            align: "center",
            title: "",
            dataIndex: "action",
            render: (_, record) => {
              return (
                <Button //
                  danger
                  icon={<DeleteFilled />}
                  size="small"
                  shape="round"
                  type="primary"
                  onClick={() => {
                    const newList = list.filter(
                      (item) => item.product_code !== record.product_code
                    );
                    setList(newList);
                  }}
                >
                  {t("delete")}
                </Button>
              );
            },
          },
        ]}
        footer={() => (
          <BottomContainer>
            <StatisticContainer>
              <Typography.Text strong>
                {`${t(
                  "warehousing total quantity"
                )} : ${totalItemCount.toLocaleString()}`}
              </Typography.Text>
              <Typography.Text strong>
                {`${t(
                  "warehousing total amount"
                )} : ${totalItemPrice.toLocaleString()}`}
              </Typography.Text>
            </StatisticContainer>
            <Popconfirm
              disabled={!list.length || isLoading}
              title={t("description.really register")}
              okText={t("yes")}
              cancelText={t("no")}
              onConfirm={() => {
                setSearchText("");
                setSearchType("store_name");
                onSubmit();
              }}
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
    </TableContainer>
  );
};

const TableContainer = styled.div`
  display: flex;
  flex-direction: column;
  display: flex;
  & > * + * {
    margin-top: 20px;
  }
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StatisticContainer = styled.div`
  display: flex;
  & > * + * {
    margin-left: 10px;
  }
`;

export default WarehousingPreviewList;

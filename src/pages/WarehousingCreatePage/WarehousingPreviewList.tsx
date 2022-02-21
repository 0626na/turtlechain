import styled from "styled-components";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreateSheetItems, WarehousingSheetItem } from "apis/warehousingAPI";
import { UploadOutlined, DeleteFilled } from "@ant-design/icons";
import { numberTextFormat } from "utils/general";
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
import TurtleText from "components/common/TurtleText";

interface Props {
  isLoading: boolean;
  list: Array<WarehousingSheetItem>;
  setList: React.Dispatch<React.SetStateAction<WarehousingSheetItem[]>>;

  
  onSubmit: () => void;
}

const WarehousingPreviewList = function ({
  isLoading,
  list,
  setList,
  onSubmit,
}: Props) {
  const { t } = useTranslation();

  type SearchType = "vendor_name" | "vendor_address" | "product_code" | "product_name";
  const [searchType, setSearchType] = useState<SearchType>("vendor_name");
  const [searchText, setSearchText] = useState("");
  const search_options = [
    {
      value: "vendor_name",
      label: t("vendor.name"),
    },
    {
      value: "vendor_address",
      label: t("vendor.address"),
    },
    {
      value: "product_code",
      label: t("product code"),
    },
    {
      value: "product_name",
      label: t("product name"),
    },
  ];

  // 필터된 리스트
  const filteredList = useMemo(
    () =>
      list.filter((item) =>
      item[searchType].toString().indexOf(searchText) !== -1 ? true : false
      ),    [list, searchType, searchText]
  );

  // 입고 수량 합계
  const totalItemCount = useMemo(
    () => list.reduce((acc, cur) => acc + cur.product_count, 0),
    [list]
  );

  // 공급가 합계
  const totalItemPrice = useMemo(
    () => list.reduce((acc, cur) => acc + cur.product_count * cur.product_price, 0),
    [list]
  );

  return (
    <TableContainer>
      <TurtleText>
        {t("warehousing.section_title2")} 
        {`(${list.length.toLocaleString()})`}
      </TurtleText>
      <Form layout="inline">
        <Form.Item>
          <Select
            style={{ width: 150 }}
            value={searchType}
            onChange={(value) => {


              setSearchType(value);
            }}
          >
            {search_options.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
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
        scroll={{ x: "auto", y: 400 }}
        pagination={false}
        dataSource={filteredList}
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
            align: "right",
            title: t("product.count"),
            dataIndex: "product_count",
            render: (_, record) => (
              <InputNumber //
                size="small"
                defaultValue={record.product_count}
                onChange={(value) => {
                  const newList = list.map((item) =>
                    item.product_code === record.product_code
                      ? { ...item, count: value }
                      : item
                  );
                  setList(newList);
                }}
              />
            ),
          },
          {
            align: "right",
            title: t("product.price"),
            render: (_, record) => numberTextFormat(record.product_price, "currency"),
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
                  const newList = list.filter(
                    (item) => item.product_code !== record.product_code
                  );
                  setList(newList);
                }}
              >
                {t("delete")}
              </Button>
            ),
          },
        ]}
        footer={() => (
          <Footer>
            <TotalContainer>
              <b>
                {`${t("warehousing.total count")} : `}
                {numberTextFormat(totalItemCount, "count")}
              </b>
              <b>
                {`${t("total supply price")} : `}
                {numberTextFormat(totalItemPrice, "currency")}
              </b>
            </TotalContainer>
            <Popconfirm
              disabled={!list.length || isLoading}
              title={t("description.really register")}
              okText={t("yes")}
              cancelText={t("no")}
              onConfirm={() => {
                setSearchText("");
                setSearchType("vendor_name");
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
          </Footer>
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

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TotalContainer = styled.div`
  display: flex;
  & > * + * {
    margin-left: 20px;
  }
`;

export default WarehousingPreviewList;

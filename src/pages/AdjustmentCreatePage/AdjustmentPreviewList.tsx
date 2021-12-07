import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { DeleteFilled, UploadOutlined } from "@ant-design/icons";
import { Table, Button, Popconfirm, Input } from "antd";

// MOCK DATA
const MOCK_LIST = [
  {
    client_name: "세기모자",
    client_address: "뉴존 2F 522",
    account_info: "기업 01050221059 죠르디",
    adjustment_type: "미송",
    supply_price: 10000,
  },
  {
    client_name: "카시오",
    client_address: "디오트 D 3F 522",
    account_info: "기업 01050221059 라이언",
    adjustment_type: "주문",
    supply_price: 20000,
  },
];

const MOCK_TOTAL_SUPPLY_PRICE = MOCK_LIST.reduce(
  (acc, cur) => acc + cur.supply_price,
  0
);

interface Props {}

const WarehousingSheetList = function ({}: Props) {
  const { t } = useTranslation();

  return (
    <Table
      size="small"
      scroll={{ x: "auto", y: 400 }}
      pagination={false}
      dataSource={MOCK_LIST}
      columns={[
        {
          title: t("client name"),
          dataIndex: "client_name",
        },
        {
          title: t("client address"),
          dataIndex: "client_address",
        },
        {
          title: t("account info"),
          dataIndex: "account_info",
        },
        {
          width: 100,
          align: "center",
          title: t("adjustment type"),
          dataIndex: "adjustment_type",
        },
        {
          title: t("supply price"),
          dataIndex: "supply_price",
          render: (_, record) => <Input value={record.supply_price} />,
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
            {MOCK_TOTAL_SUPPLY_PRICE.toLocaleString()}
          </b>
          <Popconfirm
            title={t("description.really register")}
            okText={t("yes")}
            cancelText={t("no")}
          >
            <Button //
              icon={<UploadOutlined />}
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

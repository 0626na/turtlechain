import styled from "styled-components";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { DeleteFilled, CheckOutlined } from "@ant-design/icons";
import { Table, Tag, Button, Popconfirm } from "antd";
import SimplePagination from "components/SimplePagination";
import { AdjustmentItem } from "apis/adjustmentAPI";

interface Props {
  isLoading: boolean;
  list:Array<AdjustmentItem>;
  totalCount: number;
  currentPage: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectRow: (row: AdjustmentItem) => void;
  onDelete: (row: AdjustmentItem) => void;
  onConfirm: (row: AdjustmentItem) => void;
}

const AdjustmentList = function ({
  isLoading,
  list,
  totalCount,
  currentPage,
  onPrev,
  onNext,
  onSelectRow,
  onDelete,
  onConfirm,
}: Props) {
  const { t } = useTranslation();
  return (
    <Table
      size="small"
      scroll={{ x: "auto", y: 400 }}
      pagination={false}
      dataSource={list}
      columns={[
        {
          width: 100,
          align: "center",
          title: t("progress"),
          dataIndex: "is_confirmed",
          render: (_, record) => {
            const { is_cleared} = record;
            const color = is_cleared? "green" : "red";
            const text = is_cleared? t("confirmed") : t("waiting");
            return <Tag color={color}>{text}</Tag>;
          },
        },
        {
          width: 120,
          align: "center",
          title: t("adjustment date"),
          dataIndex: "created_time",
          render: (_, record) =>
            moment(record.created_time).format("YYYY-MM-DD"),
        },
        {
          title: t("mall name"),
          dataIndex: "mall_name",
        },
        {
          title: t("client name"),
          dataIndex: "client_name",
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
          align: "right",
          title: t("supply price"),
          dataIndex: "price",
          render: (_, record) => record.supply_price.toLocaleString(),
        },
        {
          width: 300,
          align: "center",
          title: "",
          dataIndex: "action",
          render: (_, record) => {
            return (
              <ActionContainer onClick={() => {}}>
                <Button //
                  size="small"
                  shape="round"
                  onClick={() => {}}
                >
                  {t("view details")}
                </Button>
                {!record.is_confirmed && (
                  <>
                    <Popconfirm
                      title={t("description.really delete")}
                      okText={t("yes")}
                      cancelText={t("no")}
                    >
                      <Button
                        icon={<DeleteFilled />}
                        danger
                        type="primary"
                        size="small"
                        shape="round"
                      >
                        {t("delete")}
                      </Button>
                    </Popconfirm>
                    <Popconfirm
                      title={t("description.really confirmed")}
                      okText={t("yes")}
                      cancelText={t("no")}
                    >
                      <Button //
                        icon={<CheckOutlined />}
                        type="primary"
                        size="small"
                        shape="round"
                      >
                        {t("confirmed")}
                      </Button>
                    </Popconfirm>
                  </>
                )}
              </ActionContainer>
            );
          },
        },
      ]}
      title={() => (
        <b>
          {`${t("adjustment")} ${t("list")}`}
          {`(${MOCK_LIST.length.toLocaleString()})`}
        </b>
      )}
      footer={() => (
        <Footer>
          <SimplePagination />
        </Footer>
      )}
    />
  );
};

const Footer = styled.div`
  display: flex;
  justify-content: center;
`;

const ActionContainer = styled.div`
  & > * + * {
    margin-left: 10px;
  }
`;

export default AdjustmentList;

import styled from "styled-components";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { DeleteFilled, CheckOutlined } from "@ant-design/icons";
import { Table, Typography, Tag, Button, Popconfirm } from "antd";
import SimplePagination from "components/SimplePagination";

interface Props {
  isLoading: boolean;
  list: any[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectRow: () => void;
  onDelete: () => void;
  onConfirm: () => void;
}

const AdjustmentList = function ({
  isLoading,
  list,
  totalCount,
  currentPage,
  pageSize,
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
      // onRow={() => {}}
      loading={isLoading}
      dataSource={list}
      // rowKey={(record) => record.id}
      columns={[
        {
          width: 80,
          align: "center",
          title: t("progress"),
          dataIndex: "is_confirmed",
          render: (_, record) => {
            const { is_confirmed } = record;
            const color = is_confirmed ? "green" : "red";
            const text = is_confirmed ? t("confirmed") : t("waiting");
            return <Tag color={color}>{text}</Tag>;
          },
        },
        {
          width: 120,
          align: "center",
          title: t("adjustment date"),
          dataIndex: "created_time",
          render: (_, record) => {
            const { created_time } = record;
            return moment(created_time).format("YYYY-MM-DD");
          },
        },
        {
          title: t("mall name"),
          dataIndex: "mall_name",
        },
        {
          width: 80,
          align: "center",
          title: t("adjustment type"),
          dataIndex: "adjustment_type",
        },
        {
          title: t("wholesaler name"),
          dataIndex: "store_name",
        },
        {
          title: t("account info"),
          dataIndex: "account_info",
        },
        {
          align: "right",
          title: t("supply price"),
          dataIndex: "price",
          render: (_, record) => record.price.toLocaleString(),
        },
        {
          width: 280,
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
                      onConfirm={() => {}}
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
                      onConfirm={() => {}}
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
        <Typography.Title level={5}>
          {t("adjustment")} {t("list")} {`(${totalCount.toLocaleString()})`}
        </Typography.Title>
      )}
      footer={() => (
        <Footer>
          <SimplePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={totalCount}
            isLoading={isLoading}
            onPrev={onPrev}
            onNext={onNext}
          />
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

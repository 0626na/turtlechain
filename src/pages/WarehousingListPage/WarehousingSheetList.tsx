import styled from "styled-components";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Sheet } from "apis/warehousingAPI";

import { DeleteFilled, CheckOutlined } from "@ant-design/icons";
import { Table, Typography, Tag, Button, Popconfirm } from "antd";

import SimplePagination from "components/SimplePagination";

interface Props {
  isLoading: boolean;
  list: Array<Sheet>;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectRow: (row: Sheet) => void;
  onDelete: (row: Sheet) => void;
  onConfirm: (row: Sheet) => void;
}

const WarehousingSheetList = function ({
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
      scroll={{ y: 400 }}
      pagination={false}
      onRow={(record) => {
        return {
          onClick: () => {
            onSelectRow(record);
          },
        };
      }}
      loading={isLoading}
      dataSource={list}
      rowKey={(record) => record.id}
      columns={[
        {
          width: 100,
          title: t("progress"),
          dataIndex: "is_confirmed",
          render: (_, record) => {
            const { is_confirmed } = record;
            const color = is_confirmed ? "green" : "red";
            const text = is_confirmed
              ? t("warehousing confirmed")
              : t("warehousing unconfirmed");
            return <Tag color={color}>{text}</Tag>;
          },
        },
        {
          title: t("mall name"),
          dataIndex: "mall_name",
        },
        {
          width: 200,
          title: t("warehousing time"),
          dataIndex: "created_time",
          render: (_, record) => {
            const { created_time } = record;
            return moment(created_time).format("YYYY-MM-DD HH:MM:SS");
          },
        },
        {
          title: t("warehousing total quantity"),
          dataIndex: "total_item_count",
          align: "right",
          render: (_, record) => {
            const { total_item_count } = record;
            return total_item_count.toLocaleString();
          },
        },
        {
          title: t("warehousing total amount"),
          dataIndex: "total_price",
          align: "right",
          render: (_, record) => {
            const { total_price } = record;
            return total_price.toLocaleString();
          },
        },
        {
          width: 350,
          align: "center",
          title: "",
          dataIndex: "action",
          render: (_, record) => {
            return (
              <ActionContainer
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Button //
                  size="small"
                  shape="round"
                  onClick={() => {
                    onSelectRow(record);
                  }}
                >
                  {t("view details")}
                </Button>
                {!record.is_confirmed && (
                  <>
                    <Popconfirm
                      title={t("description.really delete")}
                      okText={t("yes")}
                      cancelText={t("no")}
                      onConfirm={() => {
                        onDelete(record);
                      }}
                    >
                      <Button
                        icon={<DeleteFilled />}
                        danger
                        type="primary"
                        size="small"
                        shape="round"
                      >
                        {t("warehousing")} {t("delete")}
                      </Button>
                    </Popconfirm>
                    <Popconfirm
                      title={t("description.really confirmed")}
                      okText={t("yes")}
                      cancelText={t("no")}
                      onConfirm={() => {
                        onConfirm(record);
                      }}
                    >
                      <Button //
                        icon={<CheckOutlined />}
                        type="primary"
                        size="small"
                        shape="round"
                      >
                        {t("warehousing confirmed")}
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
          {t("warehousing")} {t("list")} {`(${totalCount.toLocaleString()})`}
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

export default WarehousingSheetList;

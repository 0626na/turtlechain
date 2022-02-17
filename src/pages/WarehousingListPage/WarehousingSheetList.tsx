import styled from "styled-components";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { WarehousingSheet } from "apis/warehousingAPI";
import { DeleteFilled, CheckOutlined } from "@ant-design/icons";
import { Table, Tag, Button, Popconfirm } from "antd";
import SimplePagination from "components/SimplePagination";

interface Props {
  isLoading: boolean;
  list: Array<WarehousingSheet>;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectRow: (row: WarehousingSheet) => void;
  onDelete: (row: WarehousingSheet) => void;
  onConfirm: (row: WarehousingSheet) => void;
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
      scroll={{ x: "auto", y: 400 }}
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
          title: t("mall name"),
          dataIndex: "mall_name",
        },
        {
          width: 120,
          align: "center",
          title: t("warehousing.date"),
          dataIndex: "created_time",
          render: (_, record) =>
            moment(record.created_time).format("YYYY-MM-DD"),
        },
        {
          align: "right",
          title: t("warehousing.total count"),
          dataIndex: "total_item_count",
          render: (_, record) => record.total_item_count.toLocaleString(),
        },
        {
          align: "right",
          title: t("total supply price"),
          dataIndex: "total_price",
          render: (_, record) => record.total_price.toLocaleString(),
        },
        {
          width: 300,
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
                        {t("delete")}
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
          {`${t("warehousing")} ${t("list")}`}
          {`(${totalCount.toLocaleString()})`}
        </b>
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

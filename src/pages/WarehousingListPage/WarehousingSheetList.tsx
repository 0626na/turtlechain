import styled from "styled-components";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Sheet } from "apis/warehousingAPI";
import { Table, Typography, Tag } from "antd";
import SimplePagination from "components/SimplePagination";

interface Props {
  isFetching: boolean;
  list: Array<Sheet>;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPrev: () => void;
  onNext: () => void;
}

const WarehousingSheetList = function ({
  isFetching,
  list,
  totalCount,
  currentPage,
  pageSize,
  onPrev,
  onNext,
}: Props) {
  const { t } = useTranslation();
  return (
    <Table
      size="small"
      scroll={{ y: 400 }}
      pagination={false}
      loading={isFetching}
      dataSource={list}
      rowKey={(record) => record.id}
      columns={[
        {
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
            isLoading={isFetching}
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

export default WarehousingSheetList;

import styled from "styled-components";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { AxiosError } from "axios";
import { useQuery } from "react-query";
import warehousingAPI, { RequestGetSheet } from "apis/warehousingAPI";

import { Table, Button, Typography, Tag, message } from "antd";
import SimplePagination from "components/SimplePagination";

interface Props {
  searchQuery: RequestGetSheet;
  currentPage: number;
  pageSize: number;
  onPrev: (last_id: number) => void;
  onNext: (last_id: number) => void;
}

const WarehousingList = function ({
  searchQuery,
  currentPage,
  pageSize,
  onPrev,
  onNext,
}: Props) {
  const { t } = useTranslation();

  // 입고장 리스트 요청
  const getSheetQuery = useQuery(
    ["getSheet", searchQuery],
    () => warehousingAPI.getSheet(searchQuery),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    }
  );

  // 입고장 리스트
  const dataSource = useMemo(() => {
    if (getSheetQuery.data) {
      return getSheetQuery.data.data;
    } else {
      return [];
    }
  }, [getSheetQuery.data]);

  // 전체 데이터 수
  const totalCount = useMemo(() => {
    if (getSheetQuery.data) {
      return getSheetQuery.data.total_count;
    } else {
      return 0;
    }
  }, [getSheetQuery.data]);

  return (
    <Table
      size="small"
      pagination={false}
      loading={getSheetQuery.isLoading}
      dataSource={dataSource}
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
          title: t("warehousing quantity"),
          dataIndex: "total_item_count",
          align: "right",
          render: (_, record) => {
            const { total_item_count } = record;
            return total_item_count.toLocaleString();
          },
        },
        {
          title: t("warehousing amount"),
          dataIndex: "total_price",
          align: "right",
          render: (_, record) => {
            const { total_price } = record;
            return total_price.toLocaleString();
          },
        },
        {
          title: "",
          dataIndex: "action",
          align: "center",
          render: () => (
            <Button //
              size="small"
              shape="round"
              type="primary"
            >
              {t("view details")}
            </Button>
          ),
        },
      ]}
      title={() => (
        <TopContainer>
          <Typography.Text strong>
            {t("warehousing")} {t("list")} {`(${totalCount.toLocaleString()})`}
          </Typography.Text>
        </TopContainer>
      )}
      footer={() => (
        <BottomContainer>
          <SimplePagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={totalCount}
            isLoading={getSheetQuery.isLoading}
            onPrev={() => {
              onPrev(dataSource[0].id);
            }}
            onNext={() => {
              onNext(dataSource[dataSource.length - 1].id);
            }}
          />
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
  justify-content: center;
`;

export default WarehousingList;

import styled from "styled-components";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { RequestGetSheet, WarehousingSheet } from "apis/warehousingAPI";
import { DeleteFilled, CheckOutlined } from "@ant-design/icons";
import { Table, Tag, Button, Popconfirm, Pagination, Row } from "antd";
import SimplePagination from "components/SimplePagination";
import { useState } from "react";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import { getLocalDateTimeString } from "utils/general";
import TurtleText from "components/common/TurtleText";

interface Props {
  isLoading: boolean;
  list: Array<WarehousingSheet>;
  totalCount: number;
  currentPage: number;
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
  onPrev,
  onNext,
  onSelectRow,
  onDelete,
  onConfirm,
}: Props) {
  const { t } = useTranslation();
  const store = useRecoilValue(storeState);
  const [getSheetQuery, setGetSheetQuery] = useState<RequestGetSheet>({
    rt_store_id: -1,
    is_confirmed: "",
    start_date: "",
    end_date: "",
    page: 1,
  });

  let adjTypes = {
    exchange: "교환",
    reserve: "미송",
    balance: "잔",
    takeback: "반품",
  };
  useEffect(() => {}, [store]);

  return (
    <Row>
      <TurtleText>
        {`${t("warehousing.list")} `}
        {`(${totalCount.toLocaleString()})`}
      </TurtleText>
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
        style={{ height: "580px" }}
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
            width: 120,
            align: "center",
            title: t("warehousing.date"),
            dataIndex: "created_time",
            render: (_, record) => getLocalDateTimeString(record.created_time),
            // moment(record.created_time).format("YYYY-MM-DD"),
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
                      {/* <Popconfirm
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
                      </Popconfirm> */}
                    </>
                  )}
                </ActionContainer>
              );
            },
          },
        ]}
        footer={() => (
          <Footer>
            <Pagination
              size="small"
              total={totalCount}
              showSizeChanger={false}
              current={getSheetQuery.page}
            />
          </Footer>
        )}
      />
    </Row>
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

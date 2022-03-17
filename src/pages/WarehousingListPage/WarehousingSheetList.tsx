import warehousingAPI, { RequestGetSheet, WarehousingSheet } from "apis/warehousingAPI";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Table,
  Tag,
  Popconfirm,
  Pagination,
  Row,
  Space,
  Select,
  DatePicker,
  Divider,
  message,
  notification,
} from "antd";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import TurtleText from "components/common/TurtleText";
import { t } from "i18next";
import Toolbar from "components/Toolbar";
import { useMutation, useQuery } from "react-query";
import moment from "moment";
import { AxiosError } from "axios";
import WarehousingDetailModal from "./WarehousingDetailModal";

const WarehousingSheetList = function () {
  const store = useRecoilValue(storeState);
  const [selectedRow, selectRow] = useState<WarehousingSheet>();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState<RequestGetSheet>({
    rt_store_id: -1,
    is_confirmed: "",
    start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    page: 1,
  });

  // 입고장 리스트 요청
  const getSheetQuery = useQuery(
    ["getWarehousingSheet", searchQuery],
    () => warehousingAPI.getSheet(searchQuery),
    {
      enabled: !!store.id,
    },
  );

  // 입고장 수정, 삭제 요청
  const updateSheetQuery = useMutation(["updateWarehousingSheet"], warehousingAPI.updateSheet, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      notification.open({
        type: "success",
        message: t("message.success delete warehousing"),
      });
      setSearchQuery({ ...searchQuery, page: 1 });
      getSheetQuery.refetch();
    },
  });

  // 쇼핑몰 바뀔때 마다 입고서 리스트 재요청
  useEffect(() => {
    setSearchQuery({ ...searchQuery, rt_store_id: store.id ?? -1 });
  }, [store.id]);

  // 페이지 선택
  const selectPage = useCallback(
    (page) => {
      setSearchQuery({ ...searchQuery, page });
    },
    [searchQuery],
  );

  // 행 선택
  const openDetailModal = useCallback((record) => {
    setDetailModalVisible(true);
    selectRow(record);
  }, []);

  return (
    <>
      <Toolbar />

      <Row style={{ paddingBottom: 0 }}>
        <TurtleText>{t("warehousing.lists")}</TurtleText>
      </Row>

      <Row>
        <Table
          size="small"
          dataSource={getSheetQuery.data?.sheet_list}
          loading={getSheetQuery.isLoading}
          pagination={false}
          scroll={{ y: "auto" }}
          rowKey={(record) => record.id}
          onRow={(record) => ({
            onClick: (e) => {
              openDetailModal(record);
            },
          })}
          title={() => (
            <Row justify="space-between">
              <span>
                총 <span style={{ color: "#32ACDD" }}>{getSheetQuery.data?.total_count ?? 0}</span>
                건
              </span>
              <Space>
                <Select
                  size="small"
                  style={{ width: 100 }}
                  value={searchQuery.is_confirmed}
                  onChange={(is_confirmed) => {
                    setSearchQuery({ ...searchQuery, is_confirmed });
                  }}
                >
                  <Select.Option value="">{t("all")}</Select.Option>
                  <Select.Option value={0}>{t("waiting")}</Select.Option>
                  <Select.Option value={1}>{t("confirmed")}</Select.Option>
                </Select>

                <Divider type="vertical" style={{ margin: 0 }} />

                <DatePicker.RangePicker
                  size="small"
                  allowClear={false}
                  value={[moment(searchQuery.start_date), moment(searchQuery.end_date)]}
                  onChange={(_, dateStrings) => {
                    const start_date = dateStrings[0];
                    const end_date = dateStrings[1];
                    setSearchQuery({ ...searchQuery, start_date, end_date });
                  }}
                />
              </Space>
            </Row>
          )}
          footer={() => (
            <Row justify="center">
              <Pagination
                size="small"
                total={getSheetQuery.data?.total_count}
                showSizeChanger={false}
                current={searchQuery.page}
                onChange={selectPage}
              />
            </Row>
          )}
          columns={[
            {
              ellipsis: true,
              width: 100,
              align: "center",
              title: t("progress"),
              render: (_, record) => {
                const { is_confirmed } = record;
                const color = is_confirmed ? "geekblue" : "orange";
                const text = is_confirmed ? t("confirmed") : t("waiting");
                return <Tag color={color}>{text}</Tag>;
              },
            },
            {
              ellipsis: true,
              align: "center",
              title: t("warehousing.date"),
              render: (_, record) => record.created_date,
            },
            {
              ellipsis: true,
              align: "center",
              title: t("warehousing.total count"),
              render: (_, record) => record.total_item_count.toLocaleString(),
            },
            {
              ellipsis: true,
              align: "center",
              title: t("total supply price"),
              render: (_, record) => record.total_price.toLocaleString(),
            },
            {
              ellipsis: true,
              render: (_, record) => (
                <Space>
                  {!record.is_confirmed && (
                    <Popconfirm
                      title={t("description.really delete")}
                      okText={t("yes")}
                      cancelText={t("no")}
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        updateSheetQuery.mutate({
                          ...record,
                          is_inactive: true,
                        });
                      }}
                    >
                      <DeleteOutlined
                        style={{ cursor: "pointer", color: "#A1A2A6" }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      />
                    </Popconfirm>
                  )}
                </Space>
              ),
            },
          ]}
        />
      </Row>
      <WarehousingDetailModal
        visible={detailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
        }}
        sheet={selectedRow}
      />
    </>
  );
};

export default WarehousingSheetList;

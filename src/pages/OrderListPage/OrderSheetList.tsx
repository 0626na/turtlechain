import moment from "moment";
import { Table, Button, Popconfirm, Row, message } from "antd";
import SimplePagination from "components/SimplePagination";
import TurtleText from "components/common/TurtleText";
import orderAPI, { RequestGetOrderList } from "apis/orderAPI";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import { t } from "i18next";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import { useState } from "react";
import { useQuery } from "react-query";
import { AxiosError } from "axios";

const OrderSheetList = function () {
  const store = useRecoilValue(storeState);

  const [searchQuery, setSearchQuery] = useState<RequestGetOrderList>({
    rt_store_id: 0,
    start_date: moment(new Date(2022, 0, 1)).format("YYYY-MM-DD"),
    end_date: moment(new Date(2022, 2, 15)).format("YYYY-MM-DD"),
  });

  const getOrderListQuery = useQuery(
    ["getOrderList", searchQuery],
    () => orderAPI.getOrderList({ ...searchQuery, rt_store_id: store.id ?? 0 }),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: () => {},
    },
  );

  return (
    <Row>
      <TurtleText>{t("order.sheet.list")}</TurtleText>
      <Table
        size="small"
        pagination={false}
        //loading={isLoading}
        //dataSource={list}
        //rowKey={(record) => fakeKey++}
        columns={[
          {
            ellipsis: true,
            title: t("order.status"),
            dataIndex: "order_status",
          },
          {
            ellipsis: true,
            title: t("order.time"),
            render: (_, record) => moment(record.order_time).format("YYYY.MM.DD"),
          },
          {
            ellipsis: true,
            title: t("order.content"),
            dataIndex: "order_content",
          },
          {
            ellipsis: true,
            title: t("order.sheet.status"),
            dataIndex: "order_sheet_status",
          },
          {
            ellipsis: true,
            title: t("order.sheet.resend"),
            render: (_, record) => {
              return (
                <Popconfirm
                  title={t("description.really resend")}
                  okText={t("yes")}
                  cancelText={t("no")}
                  onConfirm={() => {}}
                >
                  <TurtleButtonSub size="small">{t("button.resend")}</TurtleButtonSub>
                </Popconfirm>
              );
            },
          },
          {
            ellipsis: true,
            title: t("view details"),
            dataIndex: "action",
            render: (_, record) => (
              <TurtleButtonSub size="small" color="green">
                {t("button.details")}
              </TurtleButtonSub>
            ),
          },
        ]}
        footer={() => (
          <Row justify="center">
            <SimplePagination />
          </Row>
        )}
      />
    </Row>
  );
};

export default OrderSheetList;

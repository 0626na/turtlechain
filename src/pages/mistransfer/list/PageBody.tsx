import { message, Popconfirm, Table, Tag } from "antd";
import { mistransferAPI } from "apis";
import { RequestGet } from "apis/mistransferAPI";
import { AxiosError } from "axios";
import { TurtleIcon, TurtleTableTitle } from "components/common";
import { t } from "i18next";
import { MainContent, MenuBar } from "layouts/main";
import moment from "moment";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";

function PageBody() {
  const store = useRecoilValue(storeState);
  const [searchQuery, setSearchQuery] = useState<RequestGet>({
    rt_store_id: store.id,
    start_date: moment().subtract(1, "months").format("YYYY-MM-DD"),
    end_date: moment().format("YYYY-MM-DD"),
    type: "mistransfer",
  });

  const getQuery = useQuery(
    ["getMistransfer", searchQuery],
    () => mistransferAPI.get(searchQuery),
    {
      enabled: !!searchQuery.rt_store_id,
      onError: (err: AxiosError) => {
        message.warn(err.response?.data.msg);
      },
      onSuccess: (data) => {
        console.log(data);
      },
    },
  );

  const updateQuery = useMutation("updateMistransfer", mistransferAPI.update, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      getQuery.refetch();
      message.success(t("message.success delete mistransfer"));
    },
  });

  // 쇼핑몰 바뀔때 리스트 재요청
  useEffect(() => {
    setSearchQuery((searchQuery) => ({ ...searchQuery, rt_store_id: store.id }));
  }, [store.id]);

  return (
    <>
      <MenuBar />

      <MainContent title={t("mistransfer.lists")}>
        <Table
          size="small"
          dataSource={getQuery.data?.data.refund_list}
          loading={getQuery.isLoading}
          pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
          rowKey={(record) => record.id}
          scroll={{ y: "auto" }}
          title={() => <TurtleTableTitle count={getQuery.data?.data.total_count ?? 0} />}
          columns={[
            {
              ellipsis: true,
              width: 100,
              align: "center",
              title: t("mistransfer.status."),
              render: (_, record) => {
                const { status } = record;
                const color =
                  status === "request" ? "green" : status === "pending" ? "orange" : "geekblue";
                const text = t(`mistransfer.status.${status}`);
                return <Tag color={color}>{text}</Tag>;
              },
            },
            {
              ellipsis: true,
              title: t("mistransfer.created date"),
              render: (_, record) => record.created_date,
            },
            {
              ellipsis: true,
              title: t("vendor.name"),
              render: (_, record) => record.ws_store_name,
            },
            {
              ellipsis: true,
              title: t("vendor.address"),
              render: (_, { ws_bank, ws_account_number, ws_account_holder }) =>
                `${ws_bank} ${ws_account_number} ${ws_account_holder}`,
            },
            {
              ellipsis: true,
              title: t("mistransfer.deposit price"),
              render: (_, record) => record.transfer_amount.toLocaleString(),
            },
            {
              ellipsis: true,
              title: t("mistransfer.recipient print"),
              render: (_, record) => record.recipient_print,
            },
            {
              ellipsis: true,
              title: t("mistransfer.memo"),
              render: (_, record) => record.memo,
            },
            {
              ellipsis: true,
              render: (_, record) => (
                <>
                  {record.status === "request" && (
                    <Popconfirm
                      title={t("description.really delete")}
                      okText={t("yes")}
                      cancelText={t("no")}
                      onCancel={(e) => {
                        e?.stopPropagation();
                      }}
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        updateQuery.mutate({
                          item_id: record.id,
                          is_inactive: 1,
                        });
                      }}
                    >
                      <TurtleIcon type="delete" />
                    </Popconfirm>
                  )}
                </>
              ),
            },
          ]}
        />
      </MainContent>
    </>
  );
}

export default PageBody;

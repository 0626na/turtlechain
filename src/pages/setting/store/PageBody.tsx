import { Button, message, Row, Table, Tag } from "antd";
import retailerStoreAPI, { StoreShow } from "apis/retailerStoreAPI";
import { AxiosError } from "axios";
import { TurtleTableTitle } from "components/common";
import { t } from "i18next";
import { MainContent } from "layouts/main";
import { useState } from "react";
import { useQuery } from "react-query";
import { PlusOutlined } from "@ant-design/icons";
import CreateModal from "./CreateModal";
import UpdateModal from "./UpdateModal";

function PageBody() {
  const [selectedRow, selectRow] = useState<StoreShow>();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // 쇼핑몰 리스트 요청
  const getListQuery = useQuery(
    ["getStoreList"],
    () =>
      retailerStoreAPI.getList({
        offset: 1000,
        last_id: -1,
        switch_type: "next",
        search_type: "",
        search_query: "",
      }),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  // 로우 클릭
  const onClickRow = (record: StoreShow) => {
    selectRow(record);
    setUpdateModalVisible(true);
  };

  return (
    <>
      <Row justify="end">
        <Button //
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          {t("button.add store")}
        </Button>
      </Row>
      <MainContent title={t("store.lists")}>
        <Table
          size="small"
          dataSource={getListQuery.data?.data.data}
          loading={getListQuery.isLoading}
          pagination={{ position: ["bottomCenter"], showSizeChanger: false }}
          rowKey={(record) => record.id}
          scroll={{ y: "auto" }}
          onRow={(record) => ({
            onClick: () => {
              onClickRow(record);
            },
          })}
          title={() => (
            <TurtleTableTitle count={getListQuery.data?.data.total_count ?? 0}></TurtleTableTitle>
          )}
          columns={[
            {
              title: t("biz status"),
              dataIndex: "is_closed",
              width: 100,
              render: (text, record) => {
                const { is_closed } = record;
                const color = is_closed ? "red" : "green";
                const str = is_closed ? t("status.closed") : t("status.open");
                return <Tag color={color}>{str}</Tag>;
              },
            },
            {
              title: t("store.name"),
              dataIndex: "name",
            },
            {
              title: t("store.url"),
              dataIndex: "mall_url",
            },
            {
              title: t("store.phone"),
              dataIndex: "phone",
            },
            {
              title: "재고관리 프로그램",
              dataIndex: "order_formats",
              render: (order_formats) =>
                order_formats === 1 ? "셀메이트" : order_formats === 2 ? "이지어드민" : "터틀체인",
            },
            {
              title: t("store.alimtalk name"),
              dataIndex: "alimtalk_name",
            },
          ]}
        />
        <CreateModal
          visible={createModalVisible}
          closeModal={() => {
            setCreateModalVisible(false);
          }}
        />
        <UpdateModal
          visible={updateModalVisible}
          closeModal={() => {
            setUpdateModalVisible(false);
          }}
          selectedRow={selectedRow}
        />
      </MainContent>
    </>
  );
}

export default PageBody;

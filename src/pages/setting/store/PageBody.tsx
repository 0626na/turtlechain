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
import { phonePattern } from "utils/pattern";

function PageBody() {
  const [selectedRow, selectRow] = useState<StoreShow>();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  // 쇼핑몰 리스트 요청
  const getListQuery = useQuery(["getStoreList"], retailerStoreAPI.getList, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

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
          style={{ width: 140 }}
        >
          {t("button.add store")}
        </Button>
      </Row>
      <MainContent title={t("store.lists")}>
        <Table
          size="small"
          dataSource={getListQuery.data?.store_list}
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
            <TurtleTableTitle count={getListQuery.data?.total_count ?? 0}></TurtleTableTitle>
          )}
          columns={[
            {
              title: t("biz status"),
              dataIndex: "is_closed",
              width: 100,
              align: "center",
              render: (_, record) => {
                const { is_closed } = record;
                const color = is_closed ? "red" : "green";
                const str = is_closed ? t("status.closed") : t("status.open");
                return <Tag color={color}>{str}</Tag>;
              },
            },
            {
              title: t("store.name"),
              render: (_, record) => record.name,
            },
            {
              title: t("store.phone"),
              render: (_, record) =>
                record.store_phone[0]?.phone.replace(phonePattern, "$1-$2-$3") ?? "",
            },
            {
              title: "결제 계좌정보",
              ellipsis: true,
              render: (_, record) =>
                `${record.store_account[0]?.bank ?? ""} ${
                  record.store_account[0]?.account_number ?? ""
                } ${record.store_account[0]?.account_holder ?? ""}`,
            },
            {
              title: "WP가상계좌",
            },
            {
              title: "받는분 통장인쇄내용",
              ellipsis: true,
              render: (_, record) => record.sender_name,
            },
            {
              title: "이체내역 착신 이메일",
              ellipsis: true,
              render: (_, record) => record.email,
            },
            {
              title: "재고관리 프로그램",
              render: (_, record) =>
                record.inventory_type === 1
                  ? "셀메이트"
                  : record.inventory_type === 2
                  ? "이지어드민"
                  : "터틀체인",
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

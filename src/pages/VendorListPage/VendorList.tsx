import { Button, Input, Popconfirm, Row, Space, Switch, Table } from "antd";
import { Vendor } from "apis/vendorAPI";
import TurtleButton from "components/common/TurtleButton";
import TurtleText from "components/common/TurtleText";
import SearchFilter from "components/SearchFilter";
import SimplePagination from "components/SimplePagination";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: Vendor[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
  },
  getCheckboxProps: (record: Vendor) => ({
    name: record.ws_store_info.name,
  }),
};

function VendorList() {
  const { t } = useTranslation();

  let fakeId = 1;
  const fakeVendor: Vendor = {
    id: 1,
    vendor_id: "SS101",
    ws_store_id: 12,
    is_taxed: true,
    memo: "테스트메모",
    ws_store_info: {
      store_account: [
        {
          id: 8495,
          account_number: "110477669022",
          account_holder: "최예원",
          bank: "신한",
          is_proxy: false,
          is_deleted: true,
        },
        {
          id: 8496,
          account_number: "110477669002",
          account_holder: "최예원",
          bank: "신한",
          is_proxy: false,
          is_deleted: false,
        },
      ],
      store_phone: [
        {
          id: 8412,
          is_deleted: false,
          phone: "01075300324",
          send_alimtalk: true,
          tag: "매장",
        },
      ],
      name: "아를(A;RLES)",
      phone: "0222325223",
      building: "제일평화",
      floor: "3",
      col: "",
      loc: "24",
      ext: "",
    },
  };

  const fakeList: Array<Vendor> = [];
  for (let i = 0; i < 10; i++) {
    fakeList.push({ ...fakeVendor, id: fakeId++ });
  }

  return (
    <>
      <StyledDiv>
        <TurtleText>{t("vendor.lists")}</TurtleText>
        <SearchFilter />
      </StyledDiv>
      <Table
        size="small"
        rowSelection={{ ...rowSelection }}
        expandable={{
          expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.memo}</p>,
        }}
        //loading={isLoading}
        pagination={false}
        dataSource={fakeList}
        rowKey={(record) => record.id}
        columns={[
          {
            align: "center",
            title: t("vendor.code"),
            dataIndex: "vendor_id",
          },
          {
            align: "center",
            title: t("vendor.name"),
            dataIndex: ["ws_store_info", "name"],
            //render: (_, record) => moment(record.order_time).format("YYYY.MM.DD"),
          },
          {
            align: "center",
            title: t("vendor.phone"),
            dataIndex: ["ws_store_info", "phone"],
          },
          {
            align: "center",
            title: t("vendor.address"),
            dataIndex: ["ws_store_info", "building"],
          },
          {
            align: "center",
            title: t("vendor.account"),
            dataIndex: ["ws_store_info", "store_account", "account_number"],
          },
          Table.EXPAND_COLUMN,
          {
            align: "center",
            title: t("vendor.memo"),
            dataIndex: "",
          },
          {
            align: "center",
            title: t("vendor.include tax"),
            dataIndex: "is_taxed",
            render: (_, record) => {
              return (
                <Popconfirm
                  title={t("description.really update")}
                  okText={t("yes")}
                  cancelText={t("no")}
                  onConfirm={() => {}}
                >
                  <Switch
                    checkedChildren="포함"
                    unCheckedChildren="미포함"
                    checked={record.is_taxed}
                  />
                </Popconfirm>
              );
            },
          },
          {
            align: "center",
            title: t("common.update"),
            dataIndex: "action",
            render: (_, record) => {
              return (
                <TurtleButton size="small" type="default">
                  {t("button.update")}
                </TurtleButton>
              );
            },
          },
        ]}
        footer={() => (
          <Row justify="center">
            <SimplePagination />
          </Row>
        )}
        // end of Table
      />
    </>
  );
}

const StyledDiv = styled.div`
  padding-bottom: 0;
`;
export default VendorList;

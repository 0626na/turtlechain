import { message, Popconfirm, Row, Switch, Table } from "antd";
import { vendorAPI } from "apis";
import { Vendor } from "apis/vendorAPI";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleText from "components/common/TurtleText";
import SearchFilter from "components/SearchFilter";
import SimplePagination from "components/SimplePagination";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
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

  // 거래처 목록 불러오기 요청
  const getVendorsQuery = useQuery(
    ["getVendors"],
    () =>
      vendorAPI.getVendors({
        page: 1,
        type: "",
        search_query: "",
        rt_store_id: 1,
      }),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

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
        dataSource={getVendorsQuery.data?.data.data}
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

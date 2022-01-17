import { message, Pagination, Popconfirm, Row, Switch, Table, Tooltip } from "antd";
import { vendorAPI } from "apis";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleText from "components/common/TurtleText";
import SearchFilter from "components/SearchFilter";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import styled from "styled-components";
import { QuestionCircleFilled } from "@ant-design/icons";

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
        expandable={{
          expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.memo}</p>,
        }}
        loading={getVendorsQuery.isLoading}
        dataSource={getVendorsQuery.data?.data.data}
        rowKey={(record) => record.ws_store_id}
        pagination={false}
        columns={[
          {
            width: "9%",
            ellipsis: true,
            title: t("vendor.code"),
            dataIndex: "vendor_id",
            render: (id) => (
              <Tooltip placement="topLeft" title={id}>
                {id}
              </Tooltip>
            ),
          },
          {
            ellipsis: true,
            title: t("vendor.name"),
            dataIndex: ["ws_store_info", "name"],
            render: (name) => (
              <Tooltip placement="topLeft" title={name}>
                {name}
              </Tooltip>
            ),
          },
          {
            width: "13%",
            ellipsis: true,
            title: t("vendor.address"),
            dataIndex: "",
            render: (_, { ws_store_info: { building, floor, col, loc, ext } }) => {
              const address = `${building} ${floor} ${col} ${loc} ${ext}`;
              return (
                <Tooltip placement="topLeft" title={address}>
                  {address}
                </Tooltip>
              );
            },
          },
          {
            width: "12%",
            ellipsis: true,
            title: t("vendor.phone"),
            dataIndex: "",
            render: (_, { ws_store_info: { store_phone } }) => {
              const phones: Array<string> = [];
              store_phone.forEach(({ phone }) => {
                phones.push(phone);
              });

              return (
                <Tooltip placement="topLeft" title={phones}>
                  {phones[0]}
                </Tooltip>
              );
            },
          },
          {
            width: "20%",
            ellipsis: true,
            title: t("vendor.account"),
            dataIndex: "",
            render: (_, { ws_store_info: { store_account } }) => {
              const accounts: Array<any> = [];
              store_account.forEach(({ bank, account_holder, account_number }) => {
                accounts.push({ bank, account_holder, account_number });
              });

              const makeContent = ({ bank, account_holder, account_number }: any) => {
                return `${bank} ${account_number} ${account_holder}`;
              };

              const contents = accounts.map((account) => {
                return <p>{makeContent(account)}</p>;
              });

              return (
                <Tooltip placement="topLeft" title={contents}>
                  {makeContent(accounts[0])}
                </Tooltip>
              );
            },
          },
          {
            align: "center",
            width: "12%",
            ellipsis: true,
            title: t("vendor.include tax"),
            dataIndex: "is_taxed",
            render: (_, record) => {
              return (
                <Popconfirm
                  title={t("description.really update")}
                  okText={t("yes")}
                  cancelText={t("no")}
                  onConfirm={() => {
                    record.is_taxed = !record.is_taxed;
                  }}
                >
                  <Switch
                    checkedChildren={t("button.include")}
                    //unCheckedChildren={t("button.exclude")}
                    checked={record.is_taxed}
                  />
                </Popconfirm>
              );
            },
          },
          {
            width: "15%",
            ellipsis: true,
            align: "center",
            title: () => {
              return (
                <>
                  <Tooltip title={t("tooltip.request update")}>
                    {t("common.request update")} <QuestionCircleFilled />
                  </Tooltip>
                </>
              );
            },
            dataIndex: "action",
            render: (_, record) => {
              return (
                <TurtleButton size="small" ghost>
                  {t("button.request update")}
                </TurtleButton>
              );
            },
          },
        ]}
        footer={() => (
          <Row justify="center">
            <Pagination size="small" total={100} showSizeChanger={false} />
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

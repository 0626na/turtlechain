import { Button, message, Popconfirm, Popover, Row, Switch, Table, Tag, Tooltip } from "antd";
import { vendorAPI } from "apis";
import { Vendor, VendorAccount } from "apis/vendorAPI";
import { AxiosError } from "axios";
import TurtleButton from "components/common/TurtleButton";
import TurtleText from "components/common/TurtleText";
import SearchFilter from "components/SearchFilter";
import SimplePagination from "components/SimplePagination";
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
      cacheTime: 0,
      staleTime: 0,
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
        scroll={{ y: "auto" }}
        expandable={{
          expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.memo}</p>,
        }}
        loading={getVendorsQuery.isLoading}
        dataSource={getVendorsQuery.data?.data.data}
        rowKey={(record) => record.ws_store_id}
        pagination={false}
        columns={[
          {
            width: "10%",
            title: t("vendor.code"),
            dataIndex: "vendor_id",
            ellipsis: true,
          },
          {
            width: "15%",
            title: t("vendor.name"),
            dataIndex: ["ws_store_info", "name"],
            ellipsis: true,
          },
          {
            width: "15%",
            title: t("vendor.address"),
            dataIndex: "",
            render: (_, { ws_store_info: { building, floor, col, loc, ext } }) => {
              return `${building} ${floor} ${col} ${loc} ${ext}`;
            },
          },
          {
            width: "15%",
            title: t("vendor.phone"),
            dataIndex: "",
            render: (_, { ws_store_info: { store_phone } }) => {
              if (store_phone.length === 1) {
                return store_phone[0].phone;
              }

              const phones: Array<string> = [];
              store_phone.forEach(({ phone }) => {
                phones.push(phone);
              });

              return (
                <Popover content={phones} trigger="click">
                  <Button>다중번호</Button>
                </Popover>
              );
            },
          },
          {
            width: "22%",
            ellipsis: true,
            title: t("vendor.account"),
            dataIndex: "",
            render: (_, { ws_store_info: { store_account } }) => {
              if (store_account.length === 1) {
                const { bank, account_holder, account_number } = store_account[0];
                return `${bank} ${account_number} ${account_holder}`;
              }

              const accounts: Array<any> = [];
              store_account.forEach(({ bank, account_holder, account_number }) => {
                accounts.push({ bank, account_holder, account_number });
              });

              const content = accounts.map(({ bank, account_holder, account_number }) => {
                return (
                  <p>
                    {bank} {account_number} {account_holder}
                  </p>
                );
              });

              return (
                <Popover content={content} title="계좌정보" trigger="click">
                  <Button>다중계좌</Button>
                </Popover>
              );
            },
          },
          Table.EXPAND_COLUMN,
          {
            align: "left",
            title: t("vendor.memo"),
            dataIndex: "",
            render: (_, { memo }) => {
              return (
                <Popover content={memo} trigger="click">
                  메모내용
                </Popover>
              );
            },
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
                  onConfirm={() => {
                    record.is_taxed = !record.is_taxed;
                  }}
                >
                  <Switch
                    checkedChildren={t("button.include")}
                    unCheckedChildren={t("button.exclude")}
                    checked={record.is_taxed}
                  />
                </Popconfirm>
              );
            },
          },
          {
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

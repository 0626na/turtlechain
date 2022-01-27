import { Form, Input, Select, Space, Collapse, Row, Table, message, Tooltip } from "antd";
import TurtleInput from "components/common/TurtleInput";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleText from "components/common/TurtleText";
import TurtleTextArea from "components/common/TurtleTextArea";
import TurtleButton from "components/common/TurtleButton";
import { t } from "i18next";
import StoreSelect from "components/StoreSelect";
import { RequestGetClearingSheet } from "apis/clearingAPI";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { warehousingAPI } from "apis";
import { AxiosError } from "axios";
import { idText } from "typescript";

const { Panel } = Collapse;

function ClearingCreateAccordion() {
  const [activePanelId, setActivePanelId] = useState<string | string[]>("1");
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>([]);

  const handleChange = (activeKey: string | string[]) => {
    setActivePanelId(activeKey);
  };

  const handleCheckBox = (id: number) => {
    setSelectedRowKeys([...selectedRowKeys, id])
  }

  const getWarehousingSheetQuery = useQuery(
    ["getSheet"], //
    () =>
      warehousingAPI.getSheet({
        rt_store_id: 8655,
        is_confirmed: 1,
        start_date: "",
        end_date: "",
        offset: 100,
        last_id: -1,
        switch_type: "next",
        did_settlement: 0,
      }),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  return (
    <>
      <Collapse accordion activeKey={activePanelId} onChange={handleChange}>
        <Panel header="1 입고 결제 대기" key="1">
          <Table
            // onRow={() => {
            // row 클릭 시 상세내역 나와야함.
            // }}
        size="small"
            rowSelection={{}}
            dataSource={getWarehousingSheetQuery.data?.data}
            rowKey={"id"}
            columns={[
              Table.SELECTION_COLUMN,
              {
                // width: "9%",
                ellipsis: true,
                title: t("warehousing date"),
                dataIndex: "created_date",
                key: "id"
                // render: (id) => (
                //   <Tooltip placement="topLeft" title={id} key={id}>
                //     {id}
                //   </Tooltip>
                // ),
              },
              {
                // width: "9%",
                ellipsis: true,
                title: "거래처 수",
                dataIndex: "total_store_count",
                key: "id"
                // render: (id) => (
                //   <Tooltip placement="topLeft" title={id} key={id}>
                //     {id}
                //   </Tooltip>
                // ),
              },

              {
                // width: "9%",
                ellipsis: true,
                title: "입고금액",
                dataIndex: "total_price",
                key: "id"
                // render: (id) => (
                //   <Tooltip placement="topLeft" title={id} key={id}>
                //     {id}
                //   </Tooltip>
                // ),
              },
              // {
              //   ellipsis: true,
              //   title: t("vendor.name"),
              //   dataIndex: ["ws_store_info", "name"],
              //   render: (name) => (
              //     <Tooltip placement="topLeft" title={name}>
              //       {name}
              //     </Tooltip>
              //   ),
              // },
              // {
              //   width: "13%",
              //   ellipsis: true,
              //   title: t("vendor.address"),
              //   dataIndex: "",
              //   render: (_, { ws_store_info: { building, floor, col, loc, ext } }) => {
              //     const address = `${building} ${floor} ${col} ${loc} ${ext}`;
              //     return (
              //       <Tooltip placement="topLeft" title={address}>
              //         {address}
              //       </Tooltip>
              //     );
              //   },
              // },
              // {
              //   width: "12%",
              //   ellipsis: true,
              //   title: t("vendor.store phone"),
              //   dataIndex: "",
              //   render: (_, { ws_store_info: { store_phone } }) => {
              //     const phones: Array<string> = [];
              //     store_phone.forEach(({ phone }) => {
              //       phones.push(phone);
              //     });

              //     const contents = phones.map((phone) => {
              //       return <p key={phone}>{phone}</p>;
              //     });

              //     return (
              //       <TurtleBadge count={phones.length}>
              //         <Tooltip placement="topLeft" title={contents}>
              //           {phones[0]}
              //         </Tooltip>
              //       </TurtleBadge>
              //     );
              //   },
              // },
              // {
              //   width: "20%",
              //   ellipsis: true,
              //   title: t("vendor.account"),
              //   dataIndex: "",
              //   render: (_, { ws_store_info: { store_account } }) => {
              //     const accounts: Array<any> = [];
              //     store_account.forEach(({ bank, account_holder, account_number }) => {
              //       accounts.push({ bank, account_holder, account_number });
              //     });

              //     const makeContent = ({ bank, account_holder, account_number }: any) => {
              //       return `${bank} ${account_number} ${account_holder}`;
              //     };

              //     const contents = accounts.map((account) => {
              //       return <p key={account.account_number}>{makeContent(account)}</p>;
              //     });

              //     return (
              //       <TurtleBadge count={contents.length}>
              //         <Tooltip placement="topLeft" title={contents}>
              //           {makeContent(accounts[0])}
              //         </Tooltip>
              //       </TurtleBadge>
              //     );
              //   },
              // },
              // {
              //   align: "center",
              //   width: "12%",
              //   ellipsis: true,
              //   title: t("vendor.include tax"),
              //   dataIndex: "is_taxed",
              //   render: (_, record) => {
              //     return (
              //       <Popconfirm
              //         title={t("description.update tax included")}
              //         okText={t("yes")}
              //         cancelText={t("no")}
              //         onConfirm={() => {
              //           updateVendorQuery.mutate({
              //             id: record.id,
              //             is_taxed: record.is_taxed,
              //             memo: record.memo,
              //           });
              //           getVendorsQuery.refetch();
              //         }}
              //       >
              //         <Switch
              //           checkedChildren={t("button.include")}
              //           checked={record.is_taxed}
              //           style={{ width: "52px" }}
              //         />
              //       </Popconfirm>
              //     );
              //   },
              // },
              // {
              //   width: "15%",
              //   ellipsis: true,
              //   align: "center",
              //   title: () => {
              //     return (
              //       <>
              //         {t("common.request update")}
              //         <TurtleQuestionTooltip content={t("tooltip.request update")} />
              //       </>
              //     );
              //   },
              //   dataIndex: "action",
              //   render: (_, record) => {
              //     return (
              //       <TurtleButton //
              //         size="small"
              //         ghost
              //         onClick={() => openModal(record)}
              //       >
              //         {t("button.request update")}
              //       </TurtleButton>
              //     );
              //   },
              // },
            ]
          }
          />
          <Row justify="center">
            <Space align="center">
              <TurtleButton
                children={"다음 단계로 이동"}
                onClick={() => {
                  setActivePanelId("2");
                }}
              />
            </Space>
          </Row>
        </Panel>
        <Panel header="2 매입 조정 대기" key="2">
          이것은 매입조정 대기
          <Row justify="center">
            <Space align="center">
              <TurtleButton
                children={"다음 단계로 이동"}
                onClick={() => {
                  setActivePanelId("2");
                }}
              />
            </Space>
          </Row>
        </Panel>
        <Panel header="3 정산 금액 미리보기" key="3">
          이것은 정산 금액 미리보기
        </Panel>
      </Collapse>
    </>
  );
}

export default ClearingCreateAccordion;

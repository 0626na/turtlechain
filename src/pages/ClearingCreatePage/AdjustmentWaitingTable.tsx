import { useState, Dispatch, SetStateAction, useRef } from "react";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { Select, Space, Table, message, Tooltip } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import { t } from "i18next";
import { AdjustmentItem } from "apis/adjustmentAPI";
import { adjustmentAPI } from "apis";

import { useRecoilValue } from "recoil";
import { storeIdState } from "store/storeIdState";
/*
  Parent : ClearingCreateAccordion
  Children : None

  ** 매입 행 선택 시
  선택한 행의 도매에 차감 금액이 존재한다면 차감 최대 금액 전까지만 차감 가능
  (e.g. 도매 차감금액이 10000원이고 매입건이 3000원이라면 3개까지만 차감 가능)
  차감 금액이 존재하지 않는다면 환불 / 매입처리 최대갯수로 설정

  * State
    adjustmentList = 매입 리스트 (미처리 된 건들만)
    
  * Custom Function
    getAdjustmentQuery = 매입 리스트를 받아오는 함수
    onSelectRow = 정산 행 선택에 따른 데이터처리 함수
    deleteAdjustmentData = 부가세 포함 된 행들의 부가세 합계를 구하는 함수
    replaceRowData = '처리방식' 혹은 '처리수량' 변경에 따른 데이터처리 함수

  * Custom Component
    CustomRow = adjustablePrice에 있는 도매라면 마우스 hover시에 차감가능 금액이 뜨게하는 component
*/

interface AdjustmentItemExtended extends AdjustmentItem {
  process_type?: string;
  process_count?: number;
  checked: boolean;
}

interface Props {
  clearingCart: any;
  setClearingCart: Dispatch<SetStateAction<any>>;
  adjustablePrice: { [key: number]: number };
}

function AdjustmentWaitingTable({
  
  clearingCart,
  setClearingCart,
  adjustablePrice,
}: Props) {
  const storeId = useRecoilValue(storeIdState)

  const [adjustmentList, setAdjustmentList] = useState<Array<AdjustmentItemExtended>>([]);
  const getAdjustmentQuery = useQuery(
    ["getAdjustment", storeId], //
    () =>
      adjustmentAPI.getAdjustment({
        rt_store_id: storeId,
        is_cleared: 0,
        offset: 1000,
        last_id: -1,
        switch_type: "next",
      }),
    {
      enabled: storeId !== undefined,
      onSuccess: (data) => {
        const responseData = data ? data.data.data : [];
        setAdjustmentList(
          responseData.map(
            (value) =>
              ({
                ...value,
                checked: false,
                process_type: undefined,
                process_count: undefined,
              } as AdjustmentItemExtended),
          ),
        );
      },
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  const deleteAdjustmentData = (record: AdjustmentItemExtended) => {
    const answer = window.confirm(t("message.confirm exclude"));
    if (answer) {
      // 매입 데이터 변경
      let newAdjustmentList = [...adjustmentList];
      const rowDataIndex = adjustmentList.findIndex((value) => value.id === record.id);
      newAdjustmentList[rowDataIndex] = {
        ...newAdjustmentList[rowDataIndex],
        checked: false,
        process_count: undefined,
        process_type: undefined,
      };
      setAdjustmentList(newAdjustmentList);
      // 해당 매입 장바구니에서 제거
      const newClearingCart = clearingCart.filter(
        (cartItem: any) => cartItem.type !== "adjustment" || cartItem.original_id !== record.id,
      );
      setClearingCart(newClearingCart);
    }
  };

  const onSelectRow = (record: AdjustmentItemExtended, selected: boolean) => {
    // 선택된 리스트 키값을 변경
    if (selected) {
      // 입고 금액이 있는지 확인
      if (adjustablePrice[record.ws_store_id]) {
        // 해당 거래처에서 차감할 수 있는 최대 갯수
        const max_adjustable_count = parseInt(
          (adjustablePrice[record.ws_store_id] / record.price).toString(),
        );
        // 거래처에서 차감할 수 있는 최대 갯수를 넘어서면 알림처리
        if (max_adjustable_count === 0) {
          return alert(
            `입고 금액보다 차감금액이 커서 차감이 불가능합니다.\n해당 도매 입고금액: ${adjustablePrice[
              record.ws_store_id
            ].toLocaleString()}원`,
          );
        }
        // 정산에 맞는 입고 아이템 형식으로 변경
        const refinedAdjustmentItem = {
          type: "adjustment",
          original_id: record.id,
          ws_store_id: record.ws_store_id,
          vendor_id: record.vendor_id,
          vendor_name: record.vendor_name,
          bank: record.bank,
          account_number: record.account_number,
          account_holder: record.account_holder,
          is_vat_included: record.is_vat_included,
          adjustment_process_type: record.process_type ? record.process_type : "subtract",
          // 처리가 차감이거나 선택되어있지 않다면 갯수를 차감최대갯수로 변경
          process_count:
            record.process_type === "subtract" || record.process_type === undefined
              ? max_adjustable_count
              : record.count_left,
          price: record.price,
        };
        // 정산 장바구니에 정보를 넣는다
        setClearingCart([...clearingCart, refinedAdjustmentItem]);
        // 매입 데이터 변경
        let newAdjustmentList = [...adjustmentList];
        const rowDataIndex = adjustmentList.findIndex((value) => value.id === record.id);
        newAdjustmentList[rowDataIndex] = {
          ...newAdjustmentList[rowDataIndex],
          checked: true,
          process_count:
            record.process_type === "subtract" || record.process_type === undefined
              ? max_adjustable_count
              : record.count_left,
          process_type: record.process_type ? record.process_type : "subtract",
        };
        setAdjustmentList(newAdjustmentList);
      } else {
        // 정산에 맞는 입고 아이템 형식으로 변경
        const refinedAdjustmentItem = {
          type: "adjustment",
          original_id: record.id,
          ws_store_id: record.ws_store_id,
          vendor_id: record.vendor_id,
          vendor_name: record.vendor_name,
          bank: record.bank,
          account_number: record.account_number,
          account_holder: record.account_holder,
          is_vat_included: record.is_vat_included,
          adjustment_process_type: "refund",
          process_count: record.process_count ? record.process_count : record.count_left,
          price: record.price,
        };
        // 정산 장바구니에 정보를 넣는다
        setClearingCart([...clearingCart, refinedAdjustmentItem]);
        // 매입 데이터 변경
        let newAdjustmentList = [...adjustmentList];
        const rowDataIndex = adjustmentList.findIndex((value) => value.id === record.id);
        newAdjustmentList[rowDataIndex] = {
          ...newAdjustmentList[rowDataIndex],
          checked: true,
          process_type: "refund",
          process_count: record.process_count ? record.process_count : record.count_left,
        };
        setAdjustmentList(newAdjustmentList);
      }
    } else {
      deleteAdjustmentData(record);
    }
  };

  const replaceRowData = (record: AdjustmentItemExtended, replaceData: { [key: string]: any }) => {
    // 해당 거래처에서 차감할 수 있는 최대 갯수
    const max_adjustable_count = parseInt(
      (adjustablePrice[record.ws_store_id] / record.price).toString(),
    );

    // 초기 예외처리
    // 처리가 "차감"일 때 처리 수량이 차감 최대 갯수를 넘으면 오류
    if (
      (record.process_type === "subtract" && replaceData["process_count"] > max_adjustable_count) ||
      (record.process_count &&
        record.process_count > max_adjustable_count &&
        replaceData["process_type"] === "subtract")
    ) {
      alert(`최대 차감 가능 갯수는 ${max_adjustable_count}개 입니다.`);
      let newAdjustmentList = [...adjustmentList];
      const rowDataIndex = adjustmentList.findIndex((value) => value.id === record.id);
      let replacingRow = newAdjustmentList[rowDataIndex];
      replacingRow = { ...replacingRow, ...replaceData, process_count: max_adjustable_count };
      newAdjustmentList[rowDataIndex] = replacingRow;
      setAdjustmentList(newAdjustmentList);
      return;
    }

    // 정보가 바뀔 행 찾기
    let newAdjustmentList = [...adjustmentList];
    const rowDataIndex = adjustmentList.findIndex((value) => value.id === record.id);
    let replacingRow = newAdjustmentList[rowDataIndex];
    replacingRow = { ...replacingRow, ...replaceData };
    // 매입처리와 수량이 다 선택되었다면 자동 체크
    if (replacingRow.process_type && replacingRow.process_count) {
      replacingRow.checked = true;
    }
    // 화면에 보이는 리스트 변경
    newAdjustmentList[rowDataIndex] = replacingRow;
    setAdjustmentList(newAdjustmentList);

    let newClearingCart = [...clearingCart].filter((value) => value.type !== "adjustment");
    let newAdjustmentForCart = newAdjustmentList
      .filter((value) => value.checked)
      .map((value) => ({
        type: "adjustment",
        original_id: value.id,
        ws_store_id: value.ws_store_id,
        vendor_id: value.vendor_id,
        vendor_name: value.vendor_name,
        bank: value.bank,
        account_number: value.account_number,
        account_holder: value.account_holder,
        is_vat_included: value.is_vat_included,
        adjustment_process_type: value.process_type,
        process_count: value.process_count,
        price: value.price,
      }));
    setClearingCart([...newClearingCart, ...newAdjustmentForCart]);
  };

  function CustomRow(props: any) {
    if (props.className.includes("ant-table-row")) {
      if (adjustablePrice[props.children[0].props.record.ws_store_id]) {
        return (
          <Tooltip
            title={`해당 도매 차감 가능 금액: ${
              adjustablePrice[props.children[0].props.record.ws_store_id]
            }`}
          >
            <tr {...props} />
          </Tooltip>
        );
      }
    }
    return <tr {...props} />;
  }

  return (
    <>
      <Table
        sticky={true}
        onRow={(record) => {
          return {
            onClick: () => {
              if (record.checked) {
                deleteAdjustmentData(record);
              } else {
                onSelectRow(record, true);
              }
            },
          };
        }}
        components={{
          body: {
            row: CustomRow,
          },
        }}
        pagination={false}
        scroll={{ y: "40vh" }}
        style={{ marginBottom: 12 }}
        size="small"
        rowSelection={{
          selectedRowKeys: adjustmentList.filter((value) => value.checked).map((value) => value.id),
          onSelect: onSelectRow,
          hideSelectAll: true,
        }}
        loading={getAdjustmentQuery.isLoading}
        dataSource={adjustmentList}
        rowKey={"id"}
        columns={[
          {
            ellipsis: true,
            title: "Temporary id remove this",
            dataIndex: "id",
          },
          Table.SELECTION_COLUMN,
          {
            ellipsis: true,
            title: t("adjustment.date"),
            dataIndex: "created_date",
          },
          {
            ellipsis: true,
            title: t("adjustment.vendor_info"),
            dataIndex: ["vendor_name", "address"],
            render: (text, row) => {
              return (
                <Space>
                  {row["vendor_name"]}
                  {row["address"]}
                </Space>
              );
            },
          },
          {
            ellipsis: true,
            title: t("adjustment.type.default"),
            dataIndex: "type",
            render: (value) => {
              return <Space>{t("adjustment.type." + value)}</Space>;
            },
          },
          {
            ellipsis: true,
            title: t("adjustment.process_type.default"),
            render: (_value, record) => (
              <Select
                placeholder={t("placeholder.process_type")}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(value) => {
                  replaceRowData(record, { process_type: value });
                }}
                value={record.process_type}
              >
                <Select.Option key={"subtract"} value={"subtract"}>
                  {t("adjustment.process_type.subtract")}
                </Select.Option>
                <Select.Option key={"refund"} value={"refund"}>
                  {t("adjustment.process_type.refund")}
                </Select.Option>
              </Select>
            ),
          },
          {
            ellipsis: true,
            title: t("adjustment.process_count"),
            render: (_value, record) => {
              const options = [];
              for (var i = record.count_left; i > 0; i--) {
                options.push(
                  <Select.Option key={i} value={i}>
                    {i}
                  </Select.Option>,
                );
              }
              return (
                <Select
                  placeholder={t("placeholder.process_count")}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onChange={(value) => {
                    replaceRowData(record, { process_count: value });
                  }}
                  value={record.process_count}
                >
                  {options}
                </Select>
              );
            },
          },
          {
            ellipsis: true,
            title: t("adjustment.price"),
            dataIndex: "price",
            render: (value) => <span>{value.toLocaleString()}</span>,
          },
          {
            ellipsis: true,
            title: t("adjustment.is_vat_included"),
            dataIndex: "is_vat_included",
            render: (value) => <Space>{!!value ? "O" : ""}</Space>,
          },
          {
            ellipsis: true,
            title: t("adjustment.memo"),
            dataIndex: "memo",
            render: (value) => (
              <span>
                {!!value ? (
                  <Tooltip title={value}>
                    <FileTextOutlined />
                  </Tooltip>
                ) : (
                  <FileTextOutlined style={{ opacity: 0.4 }} />
                )}
              </span>
            ),
          },
        ]}
      />
    </>
  );
}

export default AdjustmentWaitingTable;

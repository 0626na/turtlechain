import { Form, Input, Select, Space, Collapse, Row, Table, message, Switch, Modal } from "antd";
import TurtleInput from "components/common/TurtleInput";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleText from "components/common/TurtleText";
import TurtleTextArea from "components/common/TurtleTextArea";
import TurtleButton from "components/common/TurtleButton";
import { t } from "i18next";
import StoreSelect from "components/StoreSelect";
import { RequestGetClearingSheet, warehousingItem, adjustmentItem } from "apis/clearingAPI";
import { WarehousingSheet, WarehousingSheetItem } from "apis/warehousingAPI";
import { AdjustmentItem } from "apis/adjustmentAPI";
import React, { useState, useEffect, useRef, useMemo, Dispatch, SetStateAction } from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { warehousingAPI, adjustmentAPI } from "apis";
import { AxiosError } from "axios";
import WarehousingItemListModal from "./WarehousingItemListModal";
import { WarehousingSheetItem4Clearing } from "./index";
/*
  Parent : ClearingCreateAccordion
  Children : None

  * Custom Function
*/

interface AdjustmentItemExtended extends AdjustmentItem {
  process_type: string;
  process_count: number;
}

interface Props {
  selectedRtStoreId: number | "";
  clearingCart: any;
  setClearingCart: Dispatch<SetStateAction<any>>;
  selectedAdjustmentRowKeys: Array<number>;
  setSelectedAdjustmentRowKeys: Dispatch<SetStateAction<Array<number>>>;
}

function AdjustmentWaitingTable({
  selectedRtStoreId,
  clearingCart,
  setClearingCart,
  selectedAdjustmentRowKeys,
  setSelectedAdjustmentRowKeys,
}: Props) {
  const [adjustmentList, setAdjustmentList] = useState<Array<AdjustmentItemExtended>>([]);
  const getAdjustmentQuery = useQuery(
    ["getAdjustment", selectedRtStoreId], //
    () =>
      adjustmentAPI.getAdjustment({
        rt_store_id: selectedRtStoreId,
        is_cleared: 0,
        offset: 1000,
        last_id: -1,
        switch_type: "next",
      }),
    {
      enabled: selectedRtStoreId !== "",
      onSuccess: (data) => {
        const responseData = data ? data.data.data : [];
        setAdjustmentList(
          responseData.map(
            (value) =>
              ({
                ...value,
                process_type: "",
                process_count: 0,
              } as unknown as AdjustmentItemExtended),
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
      // 선택 된 매입 체크박스 해제
      const idx = selectedAdjustmentRowKeys?.findIndex((i) => i === record.id);
      const newSelectedRowKeys = selectedAdjustmentRowKeys && [...selectedAdjustmentRowKeys];
      newSelectedRowKeys?.splice(idx ? idx : 0, 1);
      setSelectedAdjustmentRowKeys(newSelectedRowKeys);
      // 매입 데이터 변경
      let newAdjustmentList = [...adjustmentList];
      const rowDataIndex = adjustmentList.findIndex((value) => value.id === record.id);
      newAdjustmentList[rowDataIndex] = {
        ...newAdjustmentList[rowDataIndex],
        process_count: 0,
        process_type: "",
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
        adjustment_process_type: "subtract",
        process_count: record.process_count,
        price: record.price,
      };
      // 매입 데이터 변경
      let newAdjustmentList = [...adjustmentList];
      const rowDataIndex = adjustmentList.findIndex((value) => value.id === record.id);
      newAdjustmentList[rowDataIndex] = {
        ...newAdjustmentList[rowDataIndex],
        process_count: record.count_left,
        process_type: "subtract",
      };
      setAdjustmentList(newAdjustmentList);
      // 정산 장바구니에 정보를 넣는다
      setClearingCart([...clearingCart, refinedAdjustmentItem]);
      // 해당 정산 체크표시
      setSelectedAdjustmentRowKeys([...selectedAdjustmentRowKeys, record.id]);
    } else {
      deleteAdjustmentData(record);
    }
  };

  const replaceRowData = (index: number, replaceData: { [key: string]: any }) => {
    // 화면에 보이는 리스트 변경
    let newAdjustmentList = [...adjustmentList];
    const rowDataIndex = adjustmentList.findIndex((value) => value.id === index);
    newAdjustmentList[rowDataIndex] = { ...newAdjustmentList[rowDataIndex], ...replaceData };
    setAdjustmentList(newAdjustmentList);

    // 정산 장바구니 변경
    // let newClearingCart = [...clearingCart];
    // // const rowDataIndex = adjustmentList.findIndex(value => value.id === index);
    // newAdjustmentList[rowDataIndex] = { ...newAdjustmentList[rowDataIndex], ...replaceData };
    // setAdjustmentList(newAdjustmentList);
  };

  return (
    <>
      <Table
        sticky={true}
        onRow={(record, rowIndex) => {
          return {
            onClick: (e) => {
              if (selectedAdjustmentRowKeys.includes(record.id)) {
                deleteAdjustmentData(record);
              } else {
                onSelectRow(record, true);
              }
            },
          };
        }}
        pagination={false}
        scroll={{ y: "40vh" }}
        style={{ marginBottom: 12 }}
        size="small"
        rowSelection={{
          selectedRowKeys: selectedAdjustmentRowKeys,
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
            title: t("adjustment.type"),
            dataIndex: "type",
            render: (value) => {
              const adjustmentType: any = {
                reserve: "미송",
                refund: "환불",
                exchange: "교환",
                takeback: "반품",
              };
              return <Space>{adjustmentType[value]}</Space>;
            },
          },
          {
            ellipsis: true,
            title: t("adjustment.process_type"),
            render: (_value, record, index) => (
              <Select
                placeholder={"처리방식"}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onChange={(value) => {
                  replaceRowData(index, { process_type: value });
                }}
                value={record.process_type ? record.process_type : undefined}
              >
                <Select.Option key={"subtract"} value={"subtract"}>
                  차감
                </Select.Option>
                <Select.Option key={"refund"} value={"refund"}>
                  환불
                </Select.Option>
              </Select>
            ),
          },
          {
            ellipsis: true,
            title: t("adjustment.process_count"),
            render: (_value, record, index) => {
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
                  placeholder={"처리수량"}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onChange={(value) => {
                    replaceRowData(index, { process_count: value });
                  }}
                  value={record.process_count ? record.process_count : undefined}
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
          },
          {
            ellipsis: true,
            title: t("adjustment.is_vat_included"),
            dataIndex: "is_vat_included",
            render: (value) => <Space>{value ? "O" : ""}</Space>,
          },
        ]}
      />
    </>
  );
}

export default AdjustmentWaitingTable;

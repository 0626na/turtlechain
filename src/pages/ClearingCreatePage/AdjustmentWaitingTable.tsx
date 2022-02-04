import { Form, Input, Select, Space, Collapse, Row, Table, message, Popconfirm, Modal } from "antd";
import TurtleInput from "components/common/TurtleInput";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleText from "components/common/TurtleText";
import TurtleTextArea from "components/common/TurtleTextArea";
import TurtleButton from "components/common/TurtleButton";
import { t } from "i18next";
import StoreSelect from "components/StoreSelect";
import { RequestGetClearingSheet, warehousingItem, adjustmentItem } from "apis/clearingAPI";
import { WarehousingSheet, WarehousingSheetItem } from "apis/warehousingAPI";
import { AdjustmentSheetItem } from "apis/adjustmentAPI";
import React, { useState, useEffect, useRef, useMemo, Dispatch, SetStateAction } from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { warehousingAPI } from "apis";
import { AxiosError } from "axios";
import WarehousingItemListModal from "./WarehousingItemListModal";
import { WarehousingSheetItem4Clearing } from "./index";
/*
  Parent : ClearingCreateAccordion
  Children : None

  * Custom Function
*/

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
  const getWarehousingSheetQuery = useQuery(
    ["getWarehousingSheet", selectedRtStoreId], //
    () =>
      warehousingAPI.getSheet({
        rt_store_id: selectedRtStoreId,
        is_confirmed: 1,
        start_date: "",
        end_date: "",
        offset: 100,
        last_id: -1,
        switch_type: "next",
        did_settlement: 0,
      }),
    {
      enabled: selectedRtStoreId !== "",
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  const deleteWarehousingData = (record: AdjustmentSheetItem) => {
    const answer = window.confirm(t("message.confirm exclude"));
    if (answer) {
      // 선택 된 입고장 체크박스 해제
      const idx = selectedAdjustmentRowKeys?.findIndex((i) => i === record.id);
      const newSelectedRowKeys = selectedAdjustmentRowKeys && [...selectedAdjustmentRowKeys];
      newSelectedRowKeys?.splice(idx ? idx : 0, 1);
      setSelectedAdjustmentRowKeys(newSelectedRowKeys);
      // 해당 입고장 관련된 입고 아이템 제거
      const newClearingCart = clearingCart.filter(
        (cartItem: any) => cartItem.type !== "warehousing" || cartItem.sheet_id !== record.id,
      );
      setClearingCart(newClearingCart);
    }
  };

  const onSelectRow = (record: AdjustmentSheetItem, selected: boolean) => {
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
      // total_price: record.total_price,
      // deposit_price: record.
      // supply_price: record.
      // vat_price: record.
      // adjustment_type: "reserve",
      adjustment_process_type: "subtract",
    };
    // 정산 장바구니에 정보를 넣는다
    setClearingCart([...clearingCart, refinedAdjustmentItem]);
      setSelectedAdjustmentRowKeys([...selectedAdjustmentRowKeys, record.id]);
    } else {
      deleteWarehousingData(record);
    }
  };

  return (
    <>
      <Table
        sticky={true}
        onRow={(record, rowIndex) => {
          return {
            onClick: (e) => {
              // if (selectedWarehousingSheetRowKeys.includes(record.id)) {
              //   deleteWarehousingData(record);
              // } else {
              //   openWarehousingDetailModal(record);
              // }
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
        loading={getWarehousingSheetQuery.isLoading}
        dataSource={getWarehousingSheetQuery.data?.data}
        rowKey={"id"}
        columns={[
          {
            ellipsis: true,
            title: "Temporary id remove this",
            dataIndex: "id",
            key: "id",
          },
          Table.SELECTION_COLUMN,
          {
            ellipsis: true,
            title: t("warehousing.date"),
            dataIndex: "created_date",
            key: "id",
          },
          {
            ellipsis: true,
            title: "거래처 수",
            dataIndex: "total_store_count",
            key: "id",
          },
          {
            ellipsis: true,
            title: t("warehousing.price"),
            dataIndex: "total_price",
            key: "id",
          },
        ]}
      />
    </>
  );
}

export default AdjustmentWaitingTable;

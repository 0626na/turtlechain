import { useState, Dispatch, SetStateAction } from "react";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { Select, Space, Table, message, Switch } from "antd";
import { t } from "i18next";
import { AdjustmentItem } from "apis/adjustmentAPI";
import { adjustmentAPI } from "apis";

/*
  Parent : ClearingCreateAccordion
  Children : None

  * State
    adjustmentList = 매입 리스트 (미처리 된 건들만)
    
  * Custom Function
    getAdjustmentQuery = 매입 리스트를 받아오는 함수
    onSelectRow = 정산 행 선택에 따른 데이터처리 함수
    deleteAdjustmentData = 부가세 포함 된 행들의 부가세 합계를 구하는 함수
    replaceRowData = '처리방식' 혹은 '처리수량' 변경에 따른 데이터처리 함수
*/

interface AdjustmentItemExtended extends AdjustmentItem {
  process_type?: string;
  process_count?: number;
  checked: boolean;
}

interface Props {
  selectedRtStoreId: number | "";
  clearingCart: any;
  setClearingCart: Dispatch<SetStateAction<any>>;
}

function AdjustmentWaitingTable({ selectedRtStoreId, clearingCart, setClearingCart }: Props) {
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
        process_count: record.process_count ? record.process_count : record.count_left,
        process_type: record.process_type ? record.process_type : "subtract",
      };
      setAdjustmentList(newAdjustmentList);
    } else {
      deleteAdjustmentData(record);
    }
  };

  const replaceRowData = (record: AdjustmentItemExtended, replaceData: { [key: string]: any }) => {
    // 정보가 바뀔 행 선택
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
            title: t("adjustment.type.default"),
            dataIndex: "type",
            render: (value) => {
              const adjustmentType: any = {
                reserve: t("adjustment.type.reserve"),
                refund: t("adjustment.type.refund"),
                exchange: t("adjustment.type.exchange"),
                takeback: t("adjustment.type.takeback"),
              };
              return <Space>{adjustmentType[value]}</Space>;
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
          },
          {
            ellipsis: true,
            title: t("adjustment.is_vat_included"),
            dataIndex: "is_vat_included",
            render: (value) => (
              <Switch checkedChildren="O" defaultChecked checked={!!value} disabled />
            ),
          },
        ]}
      />
    </>
  );
}

export default AdjustmentWaitingTable;

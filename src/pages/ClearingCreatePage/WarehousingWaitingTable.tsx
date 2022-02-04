import { SetStateAction, Dispatch } from "react";
import { useQuery } from "react-query";
import { Table, message } from "antd";
import { AxiosError } from "axios";
import { t } from "i18next";
import { warehousingAPI } from "apis";
import { WarehousingSheet } from "apis/warehousingAPI";
import WarehousingItemListModal from "./WarehousingItemListModal";

/*
  Parent : ClearingCreateAccordion
  Children : WarehousingItemListModal

  * Custom Function
    getWarehousingSheetQuery = 입고 결제 대기에서 보여줄 입고장 리스트를 받아오는 함수
    openWarehousingDetailModal = 입고장 상세 아이템 모달을 여는 함수
    deleteWarehousingData = 입고장에 해당하는 데이터를 정산 배열에서 제거
    onSelectRow = 입고 결제 대기 테이블 체크박스 선택 여부에 따라 데이터를 처리하는 함수
*/

interface Props {
  selectedRtStoreId: number | "";
  selectedWarehousingSheet: WarehousingSheet | null;
  setSelectedWarehousingSheet: Dispatch<SetStateAction<WarehousingSheet | null>>;
  openDetailModal: boolean;
  setOpenDetailModal: Dispatch<SetStateAction<boolean>>;
  clearingCart: any;
  setClearingCart: Dispatch<SetStateAction<any>>;
  selectedWarehousingSheetRowKeys: Array<number>;
  setSelectedWarehousingSheetRowKeys: Dispatch<SetStateAction<Array<number>>>;
}

function WarehousingWaitingTable({
  selectedRtStoreId,
  selectedWarehousingSheet,
  setSelectedWarehousingSheet,
  openDetailModal,
  setOpenDetailModal,
  clearingCart,
  setClearingCart,
  selectedWarehousingSheetRowKeys,
  setSelectedWarehousingSheetRowKeys,
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

  const openWarehousingDetailModal = (record: WarehousingSheet) => {
    setOpenDetailModal(!openDetailModal);
    setSelectedWarehousingSheet(record);
  };

  const deleteWarehousingData = (record: WarehousingSheet) => {
    const answer = window.confirm(t("message.confirm exclude"));
    if (answer) {
      // 선택 된 입고장 체크박스 해제
      const idx = selectedWarehousingSheetRowKeys?.findIndex((i) => i === record.id);
      const newSelectedRowKeys = selectedWarehousingSheetRowKeys && [
        ...selectedWarehousingSheetRowKeys,
      ];
      newSelectedRowKeys?.splice(idx ? idx : 0, 1);
      setSelectedWarehousingSheetRowKeys(newSelectedRowKeys);

      // 해당 입고장 관련된 입고 아이템 제거
      const newClearingCart = clearingCart.filter(
        (cartItem: any) => cartItem.type !== "warehousing" || cartItem.sheet_id !== record.id,
      );
      setClearingCart(newClearingCart);
    }
  };

  const onSelectRow = (record: WarehousingSheet, selected: boolean) => {
    // 선택된 리스트 키값을 변경
    if (selected) {
      openWarehousingDetailModal(record);
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
              if (selectedWarehousingSheetRowKeys.includes(record.id)) {
                deleteWarehousingData(record);
              } else {
                openWarehousingDetailModal(record);
              }
            },
          };
        }}
        pagination={false}
        scroll={{ y: "40vh" }}
        style={{ marginBottom: 12 }}
        size="small"
        rowSelection={{
          selectedRowKeys: selectedWarehousingSheetRowKeys,
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
      <WarehousingItemListModal
        visible={openDetailModal}
        selectedWarehousingSheet={selectedWarehousingSheet}
        setOpenDetailModal={setOpenDetailModal}
        selectedWarehousingSheetRowKeys={selectedWarehousingSheetRowKeys}
        setSelectedWarehousingSheetRowKeys={setSelectedWarehousingSheetRowKeys}
        clearingCart={clearingCart}
        setClearingCart={setClearingCart}
      />
    </>
  );
}

export default WarehousingWaitingTable;

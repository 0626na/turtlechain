import { SetStateAction, Dispatch } from "react";
import { useQuery } from "react-query";
import { Table, message } from "antd";
import { AxiosError } from "axios";
import { t } from "i18next";
import { warehousingAPI } from "apis";
import { WarehousingSheet } from "apis/warehousingAPI";
import WarehousingItemListModal from "./WarehousingItemListModal";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";

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
  selectedWarehousingSheet,
  setSelectedWarehousingSheet,
  openDetailModal,
  setOpenDetailModal,
  clearingCart,
  setClearingCart,
  selectedWarehousingSheetRowKeys,
  setSelectedWarehousingSheetRowKeys,
}: Props) {
  const store = useRecoilValue(storeState)
  const getWarehousingSheetQuery = useQuery(
    ["getWarehousingSheet", store.id], //
    () =>
      warehousingAPI.getSheet({
        rt_store_id: store.id,
        is_confirmed: 1,
        start_date: "2017-01-01",
        end_date: "9999-12-31",
        did_settlement: 0,
      }),
    {
      enabled: store.id !== undefined,
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
  };

  const onSelectRow = async (record: WarehousingSheet) => {
    openWarehousingDetailModal(record);
  };

  return (
    <>
      <Table
        sticky={true}
        onRow={(record) => {
          return {
            onClick: () => {
              openWarehousingDetailModal(record);
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
        dataSource={getWarehousingSheetQuery.data?.sheet_list}
        rowKey={"id"}
        columns={[
          Table.SELECTION_COLUMN,
          {
            ellipsis: true,
            title: t("warehousing.date"),
            dataIndex: "created_date",
          },
          {
            ellipsis: true,
            title: "거래처 수",
            dataIndex: "total_store_count",
          },
          {
            ellipsis: true,
            title: t("warehousing.price"),
            dataIndex: "total_price",
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
        deleteWarehousingData={deleteWarehousingData}
      />
    </>
  );
}

export default WarehousingWaitingTable;

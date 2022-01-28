import { Form, Input, Select, Space, Collapse, Row, Table, message, Tooltip, Modal } from "antd";

import TurtleInput from "components/common/TurtleInput";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleText from "components/common/TurtleText";
import TurtleTextArea from "components/common/TurtleTextArea";
import TurtleButton from "components/common/TurtleButton";
import { t } from "i18next";
import StoreSelect from "components/StoreSelect";
import { RequestGetClearingSheet } from "apis/clearingAPI";
import { SheetItem } from "apis/warehousingAPI";
import { useState, useEffect, useRef, SetStateAction, Dispatch } from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { warehousingAPI } from "apis";
import { AxiosError } from "axios";
import { Sheet } from "apis/warehousingAPI";

interface Props {
  visible: boolean;
  selectedWarehousingSheet: Sheet | null;
  setOpenDetailModal: Dispatch<SetStateAction<boolean>>;
}

function WarehousingItemListModal({
  visible,
  selectedWarehousingSheet,
  setOpenDetailModal,
}: Props) {
  /**** State ****/
  // selectedRowKeys = 선택 된 행의 key (세액포함된 건)
  // warehousingItemList = 입고 아이템 리스트
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number> | undefined>([]);
  const [warehousingItemList, setWarehousingItemList] = useState<Array<SheetItem> | undefined>([]);

  /**** React function ****/
  // 모달이 로딩될 때 세액 포함이 된 행을 선택
  useEffect(() => {
    const list: number[] | undefined = getWarehousingItemQuery.data?.data
      .filter((i) => i.is_vat_included)
      .map((i) => i.id);
    setSelectedRowKeys(list);
    setWarehousingItemList(getWarehousingItemQuery.data?.data);
  }, []);

  /**** Custom Function ****/
  // 입고 아이템 리스트를 받아오는 함수
  const getWarehousingItemQuery = useQuery(
    ["getWarehousingItem", selectedWarehousingSheet?.id], //
    () => warehousingAPI.getSheetItem(selectedWarehousingSheet ? selectedWarehousingSheet.id : 0),
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  const replaceWarehousingItem = (record: SheetItem) => {
    if (warehousingItemList) {
      const newWarehousingItemList = warehousingItemList.map((value) =>
        value.id === record.id ? { ...value, is_vat_included: !value.is_vat_included } : value,
      );
      setWarehousingItemList(newWarehousingItemList);
    }
  };

  return (
    <Modal
      closable={false}
      centered={true}
      width={"90vw"}
      visible={visible}
      okText={"추가하기"}
      cancelText={"취소"}
      onOk={() => setOpenDetailModal(!visible)}
      onCancel={() => setOpenDetailModal(!visible)}
      keyboard={true}
    >
      <Table
        style={{ height: "70vh", overflowY: "scroll" }}
        dataSource={warehousingItemList}
        rowKey={"id"}
        pagination={false}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onSelect: (record, selected) => {
            replaceWarehousingItem(record);
            if (selected) {
              setSelectedRowKeys(selectedRowKeys && [...selectedRowKeys, record.id]);
            } else {
              const idx = selectedRowKeys?.findIndex((i) => i === record.id);
              const newSelectedRowKeys = selectedRowKeys && [...selectedRowKeys];
              newSelectedRowKeys?.splice(idx ? idx : 0, 1);
              setSelectedRowKeys(newSelectedRowKeys);
            }
          },
          hideSelectAll: true,
        }}
        columns={[
          {
            ellipsis: true,
            title: t("vendor.name"),
            dataIndex: "id",
            key: "id",
          },
          {
            ellipsis: true,
            title: t("vendor.name"),
            dataIndex: "vendor_name",
            key: "id",
          },
          {
            ellipsis: true,
            title: t("vendor.address"),
            dataIndex: "address",
            key: "id",
          },
          {
            ellipsis: true,
            title: t("product.name"),
            dataIndex: "product_name",
            key: "option",
          },
          {
            ellipsis: true,
            title: t("warehousing count"),
            dataIndex: "count",
            key: "id",
          },
          {
            ellipsis: true,
            title: t("supply price"),
            dataIndex: "price",
            key: "id",
          },
          Table.SELECTION_COLUMN,
          {
            ellipsis: true,
            title: t("vendor.is_vat_included"),
            dataIndex: "is_vat_included",
            key: "id",
            render: (_, item) => <Space>{item.is_vat_included ? "O" : ""}</Space>,
          },
        ]}
      />
    </Modal>
  );
}
export default WarehousingItemListModal;

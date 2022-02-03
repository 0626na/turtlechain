import { Space, Table, message, Modal, Descriptions } from "antd";
import { t } from "i18next";
import { SheetItem } from "apis/warehousingAPI";
import { useState, SetStateAction, Dispatch } from "react";
import { useQuery } from "react-query";
import { warehousingAPI } from "apis";
import { AxiosError } from "axios";
import { Sheet } from "apis/warehousingAPI";

interface Props {
  visible: boolean;
  selectedWarehousingSheet: Sheet | null;
  setOpenDetailModal: Dispatch<SetStateAction<boolean>>;
  selectedWarehousingSheetRowKeys: Array<number>;
  setSelectedWarehousingSheetRowKeys: Dispatch<SetStateAction<Array<number>>>;
}

function WarehousingItemListModal({
  visible,
  selectedWarehousingSheet,
  setOpenDetailModal,
  selectedWarehousingSheetRowKeys,
  setSelectedWarehousingSheetRowKeys,
}: Props) {
  /**** State ****/
  // selectedRowKeys = 선택 된 행의 key (세액포함된 건)
  // warehousingItemList = 입고 아이템 리스트
  // totalVatPrice = 세액 총 합계 금액
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>([]);
  const [warehousingItemList, setWarehousingItemList] = useState<Array<SheetItem>>([]);
  const [totalVatPrice, setTotalVatPrice] = useState<number>(0);

  /**** Custom Function ****/
  // 입고 아이템 리스트를 받아오는 함수
  const getWarehousingItemQuery = useQuery(
    ["getWarehousingItem", selectedWarehousingSheet?.id], //
    () => {
      if (selectedWarehousingSheet) {
        return warehousingAPI.getSheetItem(selectedWarehousingSheet.id);
      }
    },
    {
      // 데이터가 새로 받아와지면 세액 포함이 된 행을 선택처리
      onSuccess: (data) => {
        const responseData = data ? data.data : [];
        const list: number[] = responseData.filter((i) => i.is_vat_included).map((i) => i.id);
        setSelectedRowKeys(list);
        setWarehousingItemList(responseData);
        calculateTotalVatPrice(responseData);
      },
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  // 부가세 포함 된 행들의 부가세 합계를 구하는 함수
  const calculateTotalVatPrice = (warehousingItemList: Array<SheetItem>) => {
    const totalVat: number = warehousingItemList
      .filter((value) => value.is_vat_included)
      .map((value) => value.price * value.count)
      .reduce((acc: number, cur: number) => {
        return acc + cur * 0.1;
      }, 0);

    setTotalVatPrice(totalVat);
  };

  // 모달 내 체크박스 선택 여부에 따라 데이터를 처리하는 함수
  const onSelectRow = (record: SheetItem, selected: boolean) => {
    // state 로 들어가 있는 리스트 아이템을 변경
    if (warehousingItemList) {
      const newWarehousingItemList = warehousingItemList.map((value) =>
        value.id === record.id ? { ...value, is_vat_included: !value.is_vat_included } : value,
      );
      setWarehousingItemList(newWarehousingItemList);
      calculateTotalVatPrice(newWarehousingItemList);
    }
    // 선택된 리스트 키값을 변경
    if (selected) {
      setSelectedRowKeys(selectedRowKeys && [...selectedRowKeys, record.id]);
    } else {
      const idx = selectedRowKeys?.findIndex((i) => i === record.id);
      const newSelectedRowKeys = selectedRowKeys && [...selectedRowKeys];
      newSelectedRowKeys?.splice(idx ? idx : 0, 1);
      setSelectedRowKeys(newSelectedRowKeys);
    }
  };

  // '추가하기' 버튼 선택시 데이터 처리
  const onOk = () => {
    setOpenDetailModal(!visible);
    if (selectedWarehousingSheet) {
      setSelectedWarehousingSheetRowKeys([
        ...selectedWarehousingSheetRowKeys,
        selectedWarehousingSheet.id,
      ]);
    }
  };

  return (
    <Modal
      closable={false}
      centered={true}
      width={"90vw"}
      visible={visible}
      okText={"금액 확정하기"}
      cancelText={"취소"}
      onOk={onOk}
      onCancel={() => setOpenDetailModal(!visible)}
      keyboard={true}
      destroyOnClose={true}
    >
      <Descriptions
        size="small"
        column={4}
        title="입고 내역 상세 보기"
        layout="vertical"
        bordered
        style={{ marginBottom: 12 }}
      >
        <Descriptions.Item label="생성날짜">
          {selectedWarehousingSheet?.created_date}
        </Descriptions.Item>
        <Descriptions.Item label="입고 수량 합계">
          {selectedWarehousingSheet?.total_item_count}
        </Descriptions.Item>
        <Descriptions.Item label="공급가 합계">
          {selectedWarehousingSheet?.total_price}
        </Descriptions.Item>
        <Descriptions.Item label="부가세 합계">{totalVatPrice}</Descriptions.Item>
      </Descriptions>
      <Table
        loading={getWarehousingItemQuery.isLoading}
        style={{ height: "65vh", overflowY: "scroll" }}
        dataSource={warehousingItemList}
        rowKey={"id"}
        pagination={false}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onSelect: onSelectRow,
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

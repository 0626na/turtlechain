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
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { warehousingAPI } from "apis";
import { AxiosError } from "axios";
import WarehousingItemListModal from "./WarehousingItemListModal";
import { WarehousingSheetItem4Clearing } from "./index";
const { Panel } = Collapse;

interface Props {
  selectedRtStoreId: number | "";
}

function ClearingCreateAccordion({ selectedRtStoreId }: Props) {
  /**** State ****/
  // Collapse, Panel 관련 State
  // activePanelId = 열려있는 패널의 아이디
  // isMounted = 컴포넌트 mount 시에는 useEffect 사용을 방지하기 위해 사용
  const [activePanelId, setActivePanelId] = useState<string | string[]>("");
  const isMounted = useRef<boolean>(false);

  // 정산 관련 State
  // clearingCart = 정산에 포함될 내역을 담은 배열
  // selectedWarehousingSheetRowKeys = 정산에 포함될 입고장의 ID 배열
  // selectedAdjustmentRowKeys = 매입처리 할 아이템 ID 배열
  // openDetailModal = 입고 상세 내역 모달 노출 여부
  // selectedWarehousingSheet = 선택 된 입고장의 Sheet data
  const [clearingCart, setClearingCart] = useState<any>([]); // 정산아이템 | 입고아이템 으로 타입지정하면 배열의 기능들을 사용못해서 any로 지정..
  const [selectedWarehousingSheetRowKeys, setSelectedWarehousingSheetRowKeys] = useState<
    Array<number>
  >([]);
  const [selectedAdjustmentRowKeys, setSelectedAdjustmentRowKeys] = useState<Array<number>>([]);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [selectedWarehousingSheet, setSelectedWarehousingSheet] = useState<WarehousingSheet | null>(
    null,
  );

  /**** React function ****/
  // 선택한 쇼핑몰이 변경되면 입고결제대기 창(첫번째 패널)이 열림
  useEffect(() => {
    if (isMounted.current) {
      setActivePanelId("1");
    } else {
      isMounted.current = true;
    }
  }, [selectedRtStoreId]);

  // 입고 총 금액
  const warehousingTotal = useMemo(
    () =>
      clearingCart
        .filter((item: any) => item.type === "warehousing")
        .reduce((acc: any, cur: any) => {
          return acc + cur.price * cur.count;
        }, 0),
    [clearingCart],
  );

  // 매입 총 금액
  const adjustmentTotal = useMemo(
    () =>
      clearingCart
        .filter((item: any) => item.type === "adjustment")
        .reduce((acc: any, cur: any) => {
          return acc + cur.price * cur.count;
        }, 0),
    [clearingCart],
  );

  /**** Custom Function ****/
  // Collapse 컴포넌트에서 열려있는 패널 아이디를 변경하는 함수
  const handleActivePanelChange = (activeKey: string | string[]) => setActivePanelId(activeKey);

  // 입고 결제 대기에서 보여줄 입고장 리스트를 받아오는 함수
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

  // 입고 결제 대기 테이블 체크박스 선택 여부에 따라 데이터를 처리하는 함수
  const onSelectRow = (record: WarehousingSheet, selected: boolean) => {
    // 선택된 리스트 키값을 변경
    if (selected) {
      setOpenDetailModal(!openDetailModal);
      setSelectedWarehousingSheet(record);
    } else {
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
    }
  };

  const panelOneHeader = (
    <>
      1 입고 결제 대기 <strong>입고 총 금액 : {warehousingTotal.toLocaleString()}</strong>
    </>
  );
  const panelTwoHeader = (
    <>
      2 매입 조정 대기 <strong>매입 총 금액 : {adjustmentTotal.toLocaleString()}</strong>
    </>
  );

  return (
    <>
      <Collapse accordion activeKey={activePanelId} onChange={handleActivePanelChange}>
        <Panel header={panelOneHeader} key="1">
          <Table
            sticky={true}
            onRow={(record, rowIndex) => {
              return {
                onClick: (e) => {
                  setOpenDetailModal(!openDetailModal);
                  setSelectedWarehousingSheet(record);
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
          <Row justify="center">
            <Space align="center">
              <TurtleButton
                children={t("button.next step")}
                onClick={() => {
                  setActivePanelId("2");
                }}
              />
            </Space>
          </Row>
        </Panel>
        <Panel header={panelTwoHeader} key="2">
          이것은 매입조정 대기
          <Row justify="center">
            <Space align="center">
              <TurtleButton
                children={t("button.next step")}
                onClick={() => {
                  setActivePanelId("3");
                }}
              />
            </Space>
          </Row>
        </Panel>
        <Panel header="3 정산 금액 미리보기" key="3">
          이것은 정산 금액 미리보기
        </Panel>
      </Collapse>
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

export default ClearingCreateAccordion;

import { Input, Select, Space, Collapse, Row, Table, message, Popconfirm, Modal } from "antd";
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
import axios, { AxiosError } from "axios";
import WarehousingItemListModal from "./WarehousingItemListModal";
import WarehousingWaitingTable from "./WarehousingWaitingTable";
import AdjustmentWaitingTable from "./AdjustmentWaitingTable";
const { Panel } = Collapse;

/*
  Parent : index
  Children : WarehousingWaitingTable, AdjustmentWaitingTable

  * Collapse, Panel 관련 State
    isMounted = 컴포넌트 mount 시에는 useEffect 사용을 방지하기 위해 사용 <- 이건 ref 입니다.
    activePanelId = 열려있는 패널의 아이디
  
  * 정산 관련 State
    clearingCart = 정산에 포함될 내역을 담은 배열
    selectedWarehousingSheetRowKeys = 정산에 포함될 입고장의 ID 배열
    openDetailModal = 입고 상세 내역 모달 노출 여부
    selectedWarehousingSheet = 선택 된 입고장의 Sheet data

  * React Function
    useEffect = 선택한 쇼핑몰이 변경되면 입고결제대기 창(첫번째 패널)이 열림
    warehousingTotal = 입고 총 금액 계산
    adjustmentTotal = 매입 총 금액 계산

  * Custom Function
    handleActivePanelChange = Collapse 컴포넌트에서 열려있는 패널 아이디를 변경하는 함수

  * Custom Component
    panelOneHeader = 이름만 봐도 뭔지 아시겠지요?
    panelTwoHeader = 패널들 제목 컴포넌트들 입니다
    panelThreeHeader
*/

interface Props {
  selectedRtStoreId: number | "";
}

function ClearingCreateAccordion({ selectedRtStoreId }: Props) {
  const isMounted = useRef<boolean>(false);
  const [activePanelId, setActivePanelId] = useState<string | string[]>("");
  // 정산아이템 | 입고아이템 으로 타입지정하면 배열의 기능들을 사용못해서 any로 지정..
  const [clearingCart, setClearingCart] = useState<any>([]);
  const [selectedWarehousingSheetRowKeys, setSelectedWarehousingSheetRowKeys] = useState<
    Array<number>
  >([]);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [selectedWarehousingSheet, setSelectedWarehousingSheet] = useState<WarehousingSheet | null>(
    null,
  );

  useEffect(() => {
    if (isMounted.current) {
      setActivePanelId("1");
      setClearingCart([]);
      setSelectedWarehousingSheetRowKeys([]);
      setSelectedWarehousingSheet(null);
    } else {
      isMounted.current = true;
    }
  }, [selectedRtStoreId]);

  const warehousingTotal = useMemo(
    () =>
      clearingCart
        .filter((item: any) => item.type === "warehousing")
        .reduce((acc: any, cur: any) => {
          return acc + cur.price * cur.count;
        }, 0),
    [clearingCart],
  );

  const adjustmentTotal = useMemo(
    () =>
      clearingCart
        .filter((item: any) => item.type === "adjustment")
        .reduce((acc: any, cur: any) => {
          return acc + cur.price * cur.process_count;
        }, 0),
    [clearingCart],
  );

  const handleActivePanelChange = (activeKey: string | string[]) => setActivePanelId(activeKey);

  const panelOneHeader = (
    <Space>
      1 입고 결제 대기 <strong>입고 총 금액 : {warehousingTotal.toLocaleString()}</strong>
    </Space>
  );
  const panelTwoHeader = (
    <Space>
      2 매입 조정 대기<strong>매입 총 금액 : {adjustmentTotal.toLocaleString()}</strong>
    </Space>
  );
  const panelThreeHeader = <Space>3 정산 금액 미리보기</Space>;

  return (
    <>
      <Collapse accordion activeKey={activePanelId} onChange={handleActivePanelChange}>
        <Panel header={panelOneHeader} key="1">
          <WarehousingWaitingTable
            selectedRtStoreId={selectedRtStoreId}
            selectedWarehousingSheet={selectedWarehousingSheet}
            setSelectedWarehousingSheet={setSelectedWarehousingSheet}
            openDetailModal={openDetailModal}
            setOpenDetailModal={setOpenDetailModal}
            clearingCart={clearingCart}
            setClearingCart={setClearingCart}
            selectedWarehousingSheetRowKeys={selectedWarehousingSheetRowKeys}
            setSelectedWarehousingSheetRowKeys={setSelectedWarehousingSheetRowKeys}
          />
          <Row justify="center" align="middle">
            <TurtleButton
              children={t("button.next step")}
              onClick={() => {
                setActivePanelId("2");
              }}
            />
          </Row>
        </Panel>
        <Panel header={panelTwoHeader} key="2">
          <AdjustmentWaitingTable
            selectedRtStoreId={selectedRtStoreId}
            clearingCart={clearingCart}
            setClearingCart={setClearingCart}
          />
          <Row justify="center" align="middle">
            <TurtleButton
              children={t("button.next step")}
              onClick={() => {
                setActivePanelId("3");
              }}
            />
          </Row>
        </Panel>
        <Panel header={panelThreeHeader} key="3">
          <Row>입고 : {warehousingTotal}</Row>
          <Row>매입차감 : {adjustmentTotal}</Row>
          <Row>당일미송 : 얼마..</Row>
          <Row>합계 : {`123456789`.toLocaleString()} (입고총금액 - 매입차감 + 당일미송</Row>
        </Panel>
      </Collapse>
    </>
  );
}

export default ClearingCreateAccordion;

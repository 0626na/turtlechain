import { useState, useEffect, useRef, useMemo } from "react";
import { Space, Collapse, Row, Badge, Divider, message } from "antd";
import styled from "styled-components";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AxiosError } from "axios";
import { t } from "i18next";
import { WarehousingSheet } from "apis/warehousingAPI";
import { adjustmentAPI, clearingAPI } from "apis";
import TurtleButton from "components/common/TurtleButton";
import WarehousingWaitingTable from "./WarehousingWaitingTable";
import AdjustmentWaitingTable from "./AdjustmentWaitingTable";
import { useRecoilValue } from "recoil";
import { storeIdState } from "store/storeIdState";
const { Panel } = Collapse;

/*
  Parent : index
  Children : WarehousingWaitingTable, AdjustmentWaitingTable

  * Collapse, Panel 관련 State
    isMounted = 컴포넌트 mount 시에는 useEffect 사용을 방지하기 위해 사용 <- 이건 ref 입니다.
    activePanelId = 열려있는 패널의 아이디
  
  * 정산 관련 State
    clearingCart = 정산에 포함될 내역을 담은 배열
    adjustablePrice = clearingCart에 담긴 입고 내역에 따라 도매별로 매입차감 가능한 금액을 담아놓은 object
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

function ClearingCreateAccordion() {
  const storeId = useRecoilValue(storeIdState);
  const qc = useQueryClient();
  const isMounted = useRef<boolean>(false);
  const [activePanelId, setActivePanelId] = useState<string | string[]>("");
  // 정산아이템 | 입고아이템 으로 타입지정하면 배열의 기능들을 사용못해서 any로 지정..
  const [clearingCart, setClearingCart] = useState<any>([]);
  const [adjustablePrice, setAdjustablePrice] = useState<{ [key: number]: number }>({});
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
  }, [storeId]);

  useEffect(() => {
    if (clearingCart.length > 0) {
      var groupBy = function (xs: any, key: any) {
        return xs.reduce(function (rv: any, x: any) {
          (rv[x[key]] = rv[x[key]] || []).push(x.price * x.count);
          return rv;
        }, {});
      };
      const warehousingItems = clearingCart.filter((value: any) => value.type === "warehousing");
      const groupByWsStoreId = groupBy(warehousingItems, "ws_store_id");
      const entries: Array<[string, Array<number>]> = Object.entries(groupByWsStoreId);
      for (let [key, value] of entries) {
        groupByWsStoreId[key] = value.reduce((acc, cur) => {
          return acc + cur;
        }, 0);
      }
      setAdjustablePrice(groupByWsStoreId);
    } else {
      setAdjustablePrice({});
    }
  }, [clearingCart]);

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
          if (cur.adjustment_process_type === "subtract") {
            return acc + -(cur.price * cur.process_count);
          } else {
            return acc + 0;
          }
        }, 0),
    [clearingCart],
  );

  console.log(clearingCart);

  const handleActivePanelChange = (activeKey: string | string[]) => {
    // 선택된 쇼핑몰이 있고 매입이 선택 된 상태로 입고 결제대기로 돌아가려 할 때 warning
    const adjustmentItems = clearingCart.filter((value: any) => value.type === "adjustment");
    if (
      adjustmentItems.length > 0 &&
      (activePanelId === "2" || activePanelId === "3") &&
      activeKey === "1" &&
      !!storeId
    ) {
      const answer = window.confirm(t("message.warning previous clearing"));
      if (answer) {
        setClearingCart(clearingCart.filter((value: any) => value.type === "warehousing"));
        qc.refetchQueries("getAdjustment");
        return setActivePanelId(activeKey);
      }
    }
    return setActivePanelId(activeKey);
  };

  const getTodayReserved = useQuery(
    ["getTodayReserved", [storeId]],
    () => {
      var today = new Date();
      var todayString =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        today.getDate().toString().padStart(2, "0");
      return adjustmentAPI.getAdjustment({
        rt_store_id: storeId,
        is_cleared: 0,
        offset: 1000,
        last_id: -1,
        switch_type: "next",
        start_date: todayString,
        end_date: todayString,
        type: "reserve",
      });
    },
    {
      enabled: storeId !== undefined,
    },
  );

  const mutateCreateClearingSheet = useMutation(
    ["createClearingSheet"],
    clearingAPI.createClearingSheet,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  const mutateCreateClearingItem = useMutation(
    ["createClearingItem"],
    clearingAPI.createClearingItem,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    },
  );

  const useCreateClearing = async () => {
    if (storeId && storeId > 0) {
      await mutateCreateClearingSheet
        .mutateAsync({
          rt_store_id: storeId,
          rt_store_name: "test123",
          total_price: 10000,
        })
        .then((data) => {
          mutateCreateClearingItem.mutate({
            sheet_id: data.data as number,
            rt_store_id: storeId,
            rt_store_name: "test123",
            item_list: clearingCart,
          });
        });
    }
  };

  const panelOneHeader = (
    <Space size={5}>
      <Badge
        count={1}
        style={{ backgroundColor: "#CBE0FF", color: "#2174F1", fontSize: 12, fontWeight: 700 }}
      />
      <span style={{ fontSize: 16, color: "#242934" }}>입고 결제 대기</span>
      <Divider type="vertical" />
      <span style={{ fontSize: 16, color: "#5B5D63" }}>
        입고 총 금액 : {warehousingTotal.toLocaleString()}
      </span>
    </Space>
  );
  const panelTwoHeader = (
    <Space size={5}>
      <Badge
        count={2}
        style={{ backgroundColor: "#CBE0FF", color: "#2174F1", fontSize: 12, fontWeight: 700 }}
      />
      <span style={{ fontSize: 16, color: "#242934" }}>매입 조정 대기</span>
      <Divider type="vertical" />
      <span style={{ fontSize: 16, color: "#5B5D63" }}>
        매입 총 금액 : {adjustmentTotal.toLocaleString()}
      </span>
    </Space>
  );
  const panelThreeHeader = (
    <Space size={5}>
      <Badge
        count={3}
        style={{ backgroundColor: "#CBE0FF", color: "#2174F1", fontSize: 12, fontWeight: 700 }}
      />
      <span style={{ fontSize: 16, color: "#242934" }}>정산 금액 미리보기</span>
    </Space>
  );

  console.log(
    warehousingTotal,
    adjustmentTotal,
    getTodayReserved.data?.data.statistics.not_cleared.price,
  );
  return (
    <FormTitleContainer>
      <Collapse accordion activeKey={activePanelId} onChange={handleActivePanelChange}>
        <Panel header={panelOneHeader} key="1">
          <WarehousingWaitingTable
            selectedWarehousingSheet={selectedWarehousingSheet}
            setSelectedWarehousingSheet={setSelectedWarehousingSheet}
            openDetailModal={openDetailModal}
            setOpenDetailModal={setOpenDetailModal}
            clearingCart={clearingCart}
            setClearingCart={setClearingCart}
            selectedWarehousingSheetRowKeys={selectedWarehousingSheetRowKeys}
            setSelectedWarehousingSheetRowKeys={setSelectedWarehousingSheetRowKeys}
          />
          <Row justify="end" align="middle">
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
            clearingCart={clearingCart}
            setClearingCart={setClearingCart}
            adjustablePrice={adjustablePrice}
          />
          <Row justify="end" align="middle">
            <TurtleButton
              children={t("button.next step")}
              onClick={() => {
                setActivePanelId("3");
              }}
            />
          </Row>
        </Panel>
        <Panel header={panelThreeHeader} key="3">
          <Row>입고 : {warehousingTotal.toLocaleString()}</Row>
          <Row>매입차감 : {adjustmentTotal.toLocaleString()}</Row>
          <Row>
            당일미송 :{" "}
            {!!storeId
              ? getTodayReserved.data?.data.statistics.not_cleared.price.toLocaleString()
              : 0}
          </Row>
          <Row>
            합계 :{" "}
            {(
              warehousingTotal +
              adjustmentTotal +
              (!!storeId ? getTodayReserved.data?.data.statistics.not_cleared.price : 0)
            ).toLocaleString()}{" "}
            (입고총금액 - 매입차감 + 당일미송)
          </Row>
          <Row justify="end" align="middle">
            <TurtleButton children={t("button.request clearing")} onClick={useCreateClearing} />
          </Row>
        </Panel>
      </Collapse>
    </FormTitleContainer>
  );
}

const FormTitleContainer = styled.div`
  .ant-collapse-content-box {
    background-color: #f8f9fb;
    padding-top: 0;
  }
`;

export default ClearingCreateAccordion;

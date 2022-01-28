import { Form, Input, Select, Space, Collapse, Row, Table, message, Tooltip, Modal } from "antd";
import TurtleInput from "components/common/TurtleInput";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleText from "components/common/TurtleText";
import TurtleTextArea from "components/common/TurtleTextArea";
import TurtleButton from "components/common/TurtleButton";
import { t } from "i18next";
import StoreSelect from "components/StoreSelect";
import { RequestGetClearingSheet } from "apis/clearingAPI";
import { Sheet } from "apis/warehousingAPI";
import { useState, useEffect, useRef } from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { warehousingAPI } from "apis";
import { AxiosError } from "axios";
import WarehousingItemListModal from "./WarehousingItemListModal";
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

  // 입고 결제 대기 관련 State
  // selectedRowKeys = 정산에 포함될 입고장의 ID들
  // openDetailModal = 입고 상세 내역 모달 노출 여부
  // selectedWarehousingSheet = 선택 된 입고장의 Sheet data
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>([]);
  const [openDetailModal, setOpenDetailModal] = useState<boolean>(false);
  const [selectedWarehousingSheet, setSelectedWarehousingSheet] = useState<Sheet | null>(null);

  /**** React function ****/
  // 선택한 쇼핑몰이 변경되면 입고결제대기 창(첫번째 패널)이 열림
  useEffect(() => {
    if (isMounted.current) {
      setActivePanelId("1");
    } else {
      isMounted.current = true;
    }
  }, [selectedRtStoreId]);

  /**** Custom Function ****/
  // Collapse 컴포넌트에서 열려있는 패널 아이디를 변경하는 함수
  const handleActivePanelChange = (activeKey: string | string[]) => {
    setActivePanelId(activeKey);
  };

  const handleCheckBox = (id: number) => {
    setSelectedRowKeys([...selectedRowKeys, id]);
  };

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

  return (
    <>
      <Collapse accordion activeKey={activePanelId} onChange={handleActivePanelChange}>
        <Panel header="1 입고 결제 대기" key="1">
          <Table
            onRow={(record, rowIndex) => {
              return {
                onClick: (e) => {
                  setOpenDetailModal(!openDetailModal);
                  setSelectedWarehousingSheet(record);
                },
              };
            }}
            pagination={false}
            style={{ maxHeight: "50vh", overflowY: "scroll" }}
            size="small"
            rowSelection={{}}
            loading={getWarehousingSheetQuery.isLoading}
            dataSource={getWarehousingSheetQuery.data?.data}
            rowKey={"id"}
            columns={[
              {
                ellipsis: true,
                title: t("warehousing date"),
                dataIndex: "id",
                key: "id",
              },
              Table.SELECTION_COLUMN,
              {
                ellipsis: true,
                title: t("warehousing date"),
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
                title: "입고금액",
                dataIndex: "total_price",
                key: "id",
              },
            ]}
          />
          <Row justify="center">
            <Space align="center">
              <TurtleButton
                children={"다음 단계로 이동"}
                onClick={() => {
                  setActivePanelId("2");
                }}
              />
            </Space>
          </Row>
        </Panel>
        <Panel header="2 매입 조정 대기" key="2">
          이것은 매입조정 대기
          <Row justify="center">
            <Space align="center">
              <TurtleButton
                children={"다음 단계로 이동"}
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
      />
    </>
  );
}

export default ClearingCreateAccordion;

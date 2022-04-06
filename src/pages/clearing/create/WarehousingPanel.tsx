import { t } from "i18next";
import { Collapse, message, Row, Table, Typography, CollapsePanelProps } from "antd";
import { warehousingAPI } from "apis";
import { AxiosError } from "axios";
import { TurtleButton } from "components/common";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";
import { WarehousingSheet } from "apis/warehousingAPI";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import WarehousingDetailModal from "./WarehousingDetailModal";

interface Props extends CollapsePanelProps {
  activeKey: string | string[];
  clickNext: () => void;
}

function WarehousingPanel({ activeKey, clickNext, ...props }: Props) {
  const store = useRecoilValue(storeState);
  const [selectedKeys, selectKeys] = useState<Array<number>>([]);
  const [DetailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedSheet, selectSheet] = useState<WarehousingSheet>();

  const getWarehousingSheetQuery = useQuery(
    ["getWarehousingSheet", activeKey, store.id], //
    () =>
      warehousingAPI.getSheet({
        rt_store_id: store.id!,
        is_confirmed: 0,
        start_date: "2017-01-01",
        end_date: "9999-12-31",
        did_settlement: 0,
        page: 1,
      }),
    {
      enabled: activeKey === "1",
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: () => {
        resetStates();
      },
    },
  );

  const resetStates = useCallback(() => {
    selectKeys([]);
    selectSheet(undefined);
  }, []);

  // 입고 확정 버튼 클릭
  const checkSheet = useCallback(() => {
    selectKeys([...selectedKeys, selectedSheet?.id!]);
    setDetailModalVisible(false);
  }, [selectedSheet, selectedKeys]);

  // 입고 확정 모달 열기
  const openDetailModal = useCallback(
    (record) => {
      // 이미 체크되어 있다면 체크 해제
      if (selectedKeys.includes(record.id)) {
        selectKeys(selectedKeys.filter((key) => key !== record.id));
        return;
      }
      selectSheet(record);
      setDetailModalVisible(true);
    },
    [selectedKeys],
  );

  return (
    <Collapse.Panel
      {...props}
      extra={<Typography.Text style={{ color: "#5B5D63" }}>입고 총 금액: 0</Typography.Text>}
    >
      <Table
        size="small"
        pagination={false}
        loading={getWarehousingSheetQuery.isLoading}
        dataSource={getWarehousingSheetQuery.data?.sheet_list}
        rowKey="id"
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onSelect: openDetailModal,
          hideSelectAll: true,
        }}
        onRow={(record) => ({
          onClick: () => {
            openDetailModal(record);
          },
        })}
        columns={[
          Table.SELECTION_COLUMN,
          {
            ellipsis: true,
            title: t("warehousing.date"),
            render: (_, record) => record.created_date,
          },
          {
            ellipsis: true,
            title: "거래처 수",
            render: (_, record) => record.total_store_count,
          },
          {
            ellipsis: true,
            title: t("warehousing.price"),
            render: (_, record) => record.total_price.toLocaleString(),
          },
        ]}
      />
      <Row justify="end" align="middle" style={{ marginTop: 16 }}>
        <TurtleButton //
          children={t("button.next step")}
          onClick={clickNext}
          disabled={selectedKeys.length === 0}
        />
      </Row>

      {/* 입고 상세보기 모달 */}
      <WarehousingDetailModal
        visible={DetailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
        }}
        sheet={selectedSheet}
        onOk={checkSheet}
      />
    </Collapse.Panel>
  );
}

export default WarehousingPanel;

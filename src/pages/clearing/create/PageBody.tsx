import { Badge, Card, Collapse, message, PageHeader, Row, Table, Typography } from "antd";
import { warehousingAPI } from "apis";
import { WarehousingSheet } from "apis/warehousingAPI";
import { AxiosError } from "axios";
import { TurtleButton } from "components/common";
import { t } from "i18next";
import { MainContent, MenuBar } from "layouts/main";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import styled from "styled-components";
import WarehousingDetailModal from "./WarehousingDetailModal";

function PageBody() {
  const store = useRecoilValue(storeState);
  const [activeKey, setActiveKey] = useState("0");
  const [selectedWarehousingSheetRowKeys, setSelectedWarehousingSheetRowKeys] = useState<
    Array<number>
  >([]);
  const [warehousingDetailModalVisible, setWarehousingDetailModalVisible] = useState(false);
  const [selectedWarehousingSheet, selectWarehousingSheet] = useState<WarehousingSheet>();

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
    },
  );

  // 쇼핑몰 선택되면 입고판넬 활성화
  useEffect(() => {
    if (!store.id) return;
    setActiveKey("1");
  }, [store]);

  return (
    <>
      <MenuBar isWarning />
      <MainContent>
        <StyledCollapse
          accordion
          bordered={false}
          style={{ width: "100%" }}
          onChange={(key) => {
            // 전단계로만 이동할 수 있고 다음단계는 Panel 내부 버튼으로만 이동할 수 있다.
            if (!key || Number(key) > Number(activeKey)) {
              return;
            }
            setActiveKey(key[0]);
          }}
          activeKey={activeKey}
        >
          <Collapse.Panel
            header={
              <>
                <Badge
                  count={1}
                  style={{
                    backgroundColor: Number(activeKey) >= 1 ? "#32ACDD" : "#E2E5E9",
                    color: Number(activeKey) >= 1 ? "" : "#A1A2A6",
                    fontWeight: 500,
                  }}
                />
                <Typography.Text style={{ marginLeft: 8 }}>입고 결제대기</Typography.Text>
              </>
            }
            key="1"
            extra={<Typography.Text style={{ color: "#5B5D63" }}>입고 총 금액: 0</Typography.Text>}
          >
            <Table
              size="small"
              pagination={false}
              loading={getWarehousingSheetQuery.isLoading}
              dataSource={getWarehousingSheetQuery.data?.sheet_list}
              rowKey="id"
              rowSelection={{
                selectedRowKeys: selectedWarehousingSheetRowKeys,
                onSelect: (record) => {
                  setWarehousingDetailModalVisible(true);
                },
                hideSelectAll: true,
              }}
              onRow={(record) => {
                return {
                  onClick: () => {
                    selectWarehousingSheet(record);
                    setWarehousingDetailModalVisible(true);
                  },
                };
              }}
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
              <TurtleButton
                children={t("button.next step")}
                onClick={() => {
                  setActiveKey("2");
                }}
              />
            </Row>
          </Collapse.Panel>
          <Collapse.Panel
            header={
              <>
                <Badge
                  count={2}
                  style={{
                    backgroundColor: Number(activeKey) >= 2 ? "#32ACDD" : "#E2E5E9",
                    color: Number(activeKey) >= 2 ? "" : "#A1A2A6",
                    fontWeight: 500,
                  }}
                />
                <Typography.Text style={{ marginLeft: 8 }}>매입 결제대기</Typography.Text>
              </>
            }
            key="2"
            extra={<Typography.Text style={{ color: "#5B5D63" }}>매입 총 금액: 0</Typography.Text>}
          >
            <Row justify="end" align="middle" style={{ marginTop: 16 }}>
              <TurtleButton
                children={t("button.next step")}
                onClick={() => {
                  setActiveKey("3");
                }}
              />
            </Row>
          </Collapse.Panel>
          <Collapse.Panel //
            header={
              <>
                <Badge
                  count={3}
                  style={{
                    backgroundColor: Number(activeKey) >= 3 ? "#32ACDD" : "#E2E5E9",
                    color: Number(activeKey) >= 3 ? "" : "#A1A2A6",
                    fontWeight: 500,
                  }}
                />
                <Typography.Text style={{ marginLeft: 8 }}>정산금액 미리보기</Typography.Text>
              </>
            }
            key="3"
          >
            <Card>내용</Card>
            <Card>내용</Card>
          </Collapse.Panel>
        </StyledCollapse>
        <WarehousingDetailModal
          visible={warehousingDetailModalVisible}
          onClose={() => {
            setWarehousingDetailModalVisible(false);
          }}
          sheet={selectedWarehousingSheet}
        />
      </MainContent>
    </>
  );
}

const StyledCollapse = styled(Collapse)`
  background-color: white;
  .ant-collapse-item {
    background-color: #f4f6f9;
    border: 0;
    margin-bottom: 12px;
    border-radius: 4px;
  }
`;

export default PageBody;

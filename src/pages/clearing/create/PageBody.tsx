import { Badge, Collapse, Typography } from "antd";
import { TurtlePanelHeader } from "components/common";
import { t } from "i18next";
import { MainContent, MenuBar } from "layouts/main";
import { useCallback, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import styled from "styled-components";
import AdjustmentPanel from "./AdjustmentPanel";
import ClearingPanel from "./ClearingPanel";
import WarehousingPanel from "./WarehousingPanel";

function PageBody() {
  const store = useRecoilValue(storeState);
  const [activeKey, setActiveKey] = useState("0");

  // 쇼핑몰 선택되면 입고판넬 활성화
  useEffect(() => {
    if (!store.id) {
      setActiveKey("0");
      return;
    }
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
          <WarehousingPanel
            key="1"
            header={<TurtlePanelHeader count={1} activeKey={activeKey} title="입고 결제대기" />}
            activeKey={activeKey}
            clickNext={() => {
              setActiveKey("2");
            }}
          />
          <AdjustmentPanel
            key="2"
            header={<TurtlePanelHeader count={2} activeKey={activeKey} title="매입 결제대기" />}
            activeKey={activeKey}
            clickNext={() => {
              setActiveKey("3");
            }}
          />
          <ClearingPanel
            key="3"
            header={<TurtlePanelHeader count={3} activeKey={activeKey} title="정산 미리보기" />}
            activeKey={activeKey}
          />
        </StyledCollapse>
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

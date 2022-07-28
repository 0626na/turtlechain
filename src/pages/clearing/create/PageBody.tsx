import styled from 'styled-components';
import { Collapse } from 'antd';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { t } from 'i18next';

import { TurtleButtonSub, TurtlePanelHeader } from '@components/common';
import { MainContent, MenuBar } from '@layout/page';

import ClearingPanel from './ClearingPanel';
import AdjustmentPanel from './AdjustmentPanel';
import ExcelModal from './ExcelModal';

import { storeState } from '@store/storeState';

import useStoreExist from '@hooks/useStoreExist';

function PageBody() {
  const store = useRecoilValue(storeState);
  const isStoreExist = useStoreExist();
  const [excelModalVisible, setExcelModalVisible] = useState(false);
  const [activeKey, setActiveKey] = useState('0');

  // 쇼핑몰 선택되면 입고판넬 활성화
  useEffect(() => {
    if (!store.id) {
      setActiveKey('0');
      return;
    }
    setActiveKey('1');
  }, [store]);

  return (
    <>
      <ExcelModal
        visible={excelModalVisible}
        closeModal={() => {
          setExcelModalVisible(false);
        }}
      />
      <MenuBar isWarning>
        {store.use_service === 1 && (
          <TurtleButtonSub
            type="primary"
            color="skyblue"
            onClick={() => {
              if (!isStoreExist()) {
                return;
              }
              setExcelModalVisible(true);
            }}
          >
            정산서 업로드
          </TurtleButtonSub>
        )}
      </MenuBar>
      {store.use_service === 0 && (
        <MainContent info={t('description.today reserve included')}>
          <StyledCollapse
            accordion
            bordered={false}
            style={{ width: '100%' }}
            onChange={(key) => {
              // 전단계로만 이동할 수 있고 다음단계는 Panel 내부 버튼으로만 이동할 수 있다.
              if (!key || Number(key) > Number(activeKey)) {
                return;
              }
              setActiveKey(key[0]);
            }}
            activeKey={activeKey}
          >
            <AdjustmentPanel
              key="1"
              header={
                <TurtlePanelHeader
                  count={1}
                  activeKey={activeKey}
                  title="매입조정 결제대기"
                />
              }
              activeKey={activeKey}
              clickNext={() => {
                setActiveKey('2');
              }}
            />
            <ClearingPanel
              key="2"
              header={
                <TurtlePanelHeader
                  count={2}
                  activeKey={activeKey}
                  title="결제금액 미리보기"
                />
              }
              activeKey={activeKey}
              clickCreate={() => {
                setActiveKey('0');
              }}
            />
          </StyledCollapse>
        </MainContent>
      )}
    </>
  );
}

const StyledCollapse = styled(Collapse)`
  background-color: white;
  margin-top: 20px;

  .ant-collapse-item {
    background-color: #f3f5f8;
    border: none;
    margin-bottom: 12px;
    border-radius: 4px;
  }
`;

export default PageBody;

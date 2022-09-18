import { WarehousingItem } from '@apis/warehousingAPI';
import { TurtleContentModal } from '@components/combine';
import { TurtlePanelTitle } from '@components/element';
import { css } from '@emotion/react';
import { Collapse } from 'antd';

import React, { useEffect, useState } from 'react';

import ExchangeRefundPanel from './panel/ExchangeRefundPanel';
import WarehousingPanel from './panel/WarehousingPanel';

interface Props {
  onClose: () => void;
  visible: boolean;
}

function ExchangeRefundModal({ onClose, visible }: Props) {
  const [exchangeRefundList, setExchageRefundList] = useState<
    WarehousingItem[]
  >([]);

  const [activeKey, setActiveKey] = useState('1');

  const handleWarehousingItemSelect = (record: WarehousingItem) => {
    if (exchangeRefundList.find((item) => item.id === record.id)) {
      setExchageRefundList((exchangeRefundList) => [
        ...exchangeRefundList.filter((item) => item.id !== record.id),
      ]);

      return;
    }

    setExchageRefundList((exchangeRefundList) => [
      ...exchangeRefundList,
      record,
    ]);
  };

  const handleModalClose = () => {
    onClose();
  };

  useEffect(() => {}, []);

  return (
    <TurtleContentModal
      visible={visible}
      onClose={handleModalClose}
      title="교환/반품 추가"
      size="large"
    >
      <Collapse
        onChange={(key) => {
          if (!key) return;

          setActiveKey(key[0]);
        }}
        activeKey={activeKey}
        css={collapse}
        accordion
        bordered={false}
      >
        <WarehousingPanel
          onWarehousingItemSelect={handleWarehousingItemSelect}
          activeKey={activeKey}
          key="1"
          style={{ border: '1px solid red' }}
          header={
            <TurtlePanelTitle
              count={1}
              activeKey={activeKey}
              title="입고상품 불러오기"
            />
          }
        />

        <ExchangeRefundPanel
          exchangeRefundList={exchangeRefundList}
          key="2"
          header={
            <TurtlePanelTitle
              count={2}
              activeKey={activeKey}
              title="결제금액 미리보기"
            />
          }
          activeKey={activeKey}
          clickCreate={() => {
            setActiveKey('1');
          }}
        />
      </Collapse>
    </TurtleContentModal>
  );
}

const collapse = css`
  background-color: #fff;

  .ant-collapse-item {
    margin-bottom: 12px;
    background-color: #f3f5f8;
    border: none;
    border-radius: 10px;
  }

  .ant-collapse-content-box {
    height: 580px;
    background-color: #fff;
    padding: 24px 24px 28px 24px !important;
  }
`;

export default ExchangeRefundModal;

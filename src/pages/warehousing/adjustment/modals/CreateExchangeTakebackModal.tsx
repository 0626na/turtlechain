import { TurtleContentModal } from '@components/combine';
import { TurtlePanelTitle } from '@components/element';
import { css } from '@emotion/react';
import useAdjustmentCart from '@hooks/useAdjustmentCart';
import { Collapse } from 'antd';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import ExchangeRefundPanel from '../panels/ExchangeTakebackPanel';
import WarehousingPanel from '../panels/WarehousingPanel';

interface Props {
  onClose: () => void;
  visible: boolean;
}

function ExchangeTakebackModal({ onClose, visible }: Props) {
  const [activeKey, setActiveKey] = useState('1');
  const { setCart } = useAdjustmentCart();

  useEffect(() => {
    if (visible) {
      setActiveKey('1');
      return;
    }
    setCart({ adjustmentItemList: [], selectedWarehousingItemList: [] });
  }, [setCart, visible]);

  return (
    <>
      {visible && (
        <TurtleContentModal
          visible={visible}
          onClose={onClose}
          title={t('title.addAdjustment')}
          size="large"
        >
          <Collapse
            onChange={(key) => {
              if (!key || key[0] !== '1') return;
              setActiveKey(key[0]);
            }}
            activeKey={activeKey}
            css={collapse}
            accordion
            bordered={false}
          >
            <WarehousingPanel
              activeKey={activeKey}
              setActiveKey={setActiveKey}
              key="1"
              style={{ border: '1px solid red' }}
              header={
                <TurtlePanelTitle
                  count={1}
                  activeKey={activeKey}
                  title={t('title.search from stock list')}
                />
              }
            />

            <ExchangeRefundPanel
              key="2"
              header={
                <TurtlePanelTitle
                  count={2}
                  activeKey={activeKey}
                  title={t('title.preview of exchange and returns')}
                />
              }
              activeKey={activeKey}
              onClose={onClose}
            />
          </Collapse>
        </TurtleContentModal>
      )}
    </>
  );
}

const collapse = css`
  background-color: #fff;

  .ant-collapse-item {
    margin-bottom: 12px;
    background-color: #f3f5f8;
    border: none;
    border-radius: 10px !important;
  }

  .ant-collapse-content-box {
    height: 580px;
    background-color: #fff;
    padding: 24px 24px 28px 24px !important;
  }
`;

export default ExchangeTakebackModal;

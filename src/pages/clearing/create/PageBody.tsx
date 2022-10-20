import { css } from '@emotion/react';
import useClearingCart from '@hooks/useClearingCart';
import useStore from '@hooks/useStore';
import { PageContent } from '@layout/page';
import { theme } from '@styles/theme';
import {
  Badge,
  Button,
  Col,
  Collapse,
  DatePicker,
  Row,
  Space,
  Tooltip,
} from 'antd';

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import ClearingPanel from './panels/ClearingPanel';
import WarehousingPanel from './panels/WarehousingPanel';

function PageBody() {
  const [activeKey, setActiveKey] = useState('0');
  const { store } = useStore();
  const { cart, selectDate } = useClearingCart();

  // 날짜선택, 쇼핑몰 변경시 교환/반품/미송 패널 보여준다.
  useEffect(() => {
    setActiveKey('1');
  }, [cart.clearingRequestDate, store.selected?.id]);
  const [tooltipVisible, setTooltipVisible] = useState(true);
  return (
    <>
      <div css={inner}>
        <span css={clearingDate}>결제요청 일자</span>
        <Row justify="space-between">
          <Col>
            <Space>
              <Button
                css={[
                  $button,
                  moment().format('YYYY-MM-DD') ===
                    moment(cart.clearingRequestDate).format('YYYY-MM-DD') &&
                    greenButton,
                ]}
                onClick={() => {
                  selectDate(moment().format('YYYY-MM-DD'));
                }}
              >
                오늘
              </Button>

              <Tooltip
                visible={tooltipVisible}
                placement="bottom"
                title={<span>지난 일자의 결제요청도 진행할 수 있어요!</span>}
              >
                <DatePicker
                  onClick={() => setTooltipVisible(false)}
                  css={[
                    $datePicker,
                    cart.clearingRequestDate &&
                      moment().format('YYYY-MM-DD') !==
                        moment(cart.clearingRequestDate).format('YYYY-MM-DD') &&
                      greenDatePicker,
                  ]}
                  onChange={(_, date) => {
                    selectDate(date);
                  }}
                  allowClear={false}
                  placeholder="다른 일자선택"
                />
              </Tooltip>
            </Space>
          </Col>
        </Row>
      </div>
      <PageContent gray>
        <Collapse
          css={collapse}
          onChange={(key) => {
            if (!key || key[0] === '2') return;
            setActiveKey(key[0]);
          }}
          activeKey={activeKey}
          accordion
          bordered={false}
        >
          <WarehousingPanel
            activeKey={activeKey}
            key="1"
            clickNext={() => {
              setActiveKey('2');
            }}
            header={
              <div css={headerCss.self}>
                <Badge
                  count={1}
                  style={{
                    backgroundColor:
                      Number(activeKey) >= 1 ? '#DDF3F5' : '#F0F3F6',
                    color: Number(activeKey) >= 1 ? '#00AAB5' : '#A1A2A6',
                    ...headerCss.badgeCss,
                  }}
                />
                <div css={headerCss.textInner}>
                  <div css={headerCss.title}>교환/반품/미송 확인하기</div>
                  <div css={headerCss.subTitle}>
                    결제에서 제외 또는 포함할 교환/반품/미송을 확인해주세요.
                  </div>
                </div>
              </div>
            }
          />
          <ClearingPanel
            activeKey={activeKey}
            key="2"
            clickCreate={() => {
              setActiveKey('0');
            }}
            header={
              <div css={headerCss.self}>
                <Badge
                  count={2}
                  style={{
                    backgroundColor:
                      Number(activeKey) >= 2 ? '#DDF3F5' : '#F0F3F6',
                    color: Number(activeKey) >= 2 ? '#00AAB5' : '#A1A2A6',
                    ...headerCss.badgeCss,
                  }}
                />
                <div css={headerCss.textInner}>
                  <div css={headerCss.title}>결제금액 미리보기</div>

                  <div css={headerCss.subTitle}>
                    거래처별 금액을 확인하고 결제할 금액을 입력해주세요.
                  </div>
                </div>
              </div>
            }
          />
        </Collapse>
      </PageContent>
    </>
  );
}

const inner = css`
  padding: 18px 36px;
`;

const clearingDate = css({
  display: 'inline-block',
  marginBottom: 8,
  fontWeight: 500,
  fontSize: 14,
  color: theme.grey600,
});

const headerCss = {
  self: css({
    display: 'flex',
    alignItems: 'center',
  }),
  badgeCss: {
    width: 36,
    height: 36,
    lineHeight: '36px',
    borderRadius: '50%',
    fontWeight: 700,
    fontSize: 18,
  },
  textInner: css({
    marginLeft: 25,
  }),
  title: css({
    color: '#242934',
    fontWeight: 700,
    fontSize: 20,
  }),
  subTitle: css({
    color: '#6b6d73',
    fontWeight: 500,
  }),
};

const $button = css`
  width: 60px;
  height: 40px;
  color: #6b6d73;
  background-color: #f0f3f6;

  &:hover {
    color: #6b6d73;
    background-color: #d9dbde;
  }

  &:focus {
    color: #6b6d73;
    background-color: #d9dbde;
  }
`;

const greenButton = css`
  color: #fff;
  background-color: #00b3be;

  &:hover {
    color: #fff;
    background-color: #00b3be;
  }

  &:focus {
    color: #fff;
    background-color: #00b3be;
  }
`;

const $datePicker = css`
  width: 137px;
  height: 40px;
  background-color: #f0f3f6;
  color: #6b6d73;
  border: none;
  border-radius: 8px;
`;

const greenDatePicker = css`
  background-color: #00b3be;

  input,
  .ant-picker-suffix {
    color: #fff;
  }
`;

const collapse = css`
  margin-top: 36px;
  margin-bottom: 36px;

  .ant-collapse-item,
  .ant-collapse-item.ant-collapse-no-arrow {
    margin-bottom: 12px;
    background-color: #fff;
    border: none;

    box-shadow: 0px 2px 12px 1px rgba(0, 0, 0, 0.08);
    border-radius: 12px;
  }

  &.ant-collapse
    > .ant-collapse-item.ant-collapse-no-arrow
    > .ant-collapse-header {
    padding: 27px 36px;
  }

  .ant-collapse-content-box {
    background-color: #fff;
    padding: 0px 36px 36px 36px !important;
  }
`;

export default PageBody;

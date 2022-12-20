import { TurtleText } from '@components/element';
import { css } from '@emotion/react';
import useClearingCart from '@hooks/useClearingCart';

import useStore from '@hooks/useStore';
import { PageContent } from '@layout/page';
import { theme } from '@styles/theme';
import { Badge, Button, Col, Collapse, DatePicker, Row, Tooltip } from 'antd';
import { t } from 'i18next';
import { InfoCircleOutlined as InfoIcon } from '@ant-design/icons';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import ClearingPanel from './panels/ClearingPanel';
import WarehousingPanel from './panels/WarehousingPanel';
import { t } from 'i18next';

// 2.0
function Service() {
  const { store } = useStore();
  const { cart, selectDate } = useClearingCart();
  const [activeKey, setActiveKey] = useState('0');
  const [tooltipVisible, setTooltipVisible] = useState(true);

  // 날짜선택, 쇼핑몰 변경시 교환/반품/미송 패널 보여준다.
  useEffect(() => {
    setActiveKey('1');
  }, [cart.clearingRequestDate, store.selected?.id]);

  const isToday =
    moment().format('YYYY-MM-DD') ===
    moment(cart.clearingRequestDate).format('YYYY-MM-DD');

  const isOtherDay =
    moment().format('YYYY-MM-DD') !==
    moment(cart.clearingRequestDate).format('YYYY-MM-DD');

  return (
    <>
      <div css={inner}>
        <span css={clearingDate}>{t('table.payment date')}</span>
        <Row>
          <Col>
            <Button
              css={[$button, isToday && greenButton]}
              onClick={() => {
                selectDate(moment().format('YYYY-MM-DD'));
              }}
            >
              {t('description.today')}
            </Button>
          </Col>

          <Col>
            <Tooltip
              visible={tooltipVisible}
              placement="topLeft"
              align={{ offset: [30, 2] }}
              zIndex={1}
              title={<span>{t('title.can pay before')}</span>}
            >
              <DatePicker
                defaultValue={
                  isOtherDay ? moment(cart.clearingRequestDate) : undefined
                }
                onClick={() => setTooltipVisible(false)}
                onChange={(_, date) => {
                  selectDate(date);
                }}
                css={[$datePicker, isOtherDay && greenDatePicker]}
                allowClear={false}
                placeholder={t('placeholder.select different date')}
              />
            </Tooltip>
          </Col>
        </Row>

        <TurtleText css={$subtitle}>
          <span css={subTitleIcon}>
            <InfoIcon />
          </span>
          오늘 결제에 필요한 차감과 미송결제 확인은 1번에서, 최종 결제한 금액
          설정은 2번에서 해주세요. 금액이 틀릴 경우, 아래 문의하기를 통해
          문의주세요!
        </TurtleText>
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
                  <div css={headerCss.title}>
                    {t('title.confirm adjustment')}
                  </div>
                  <div css={headerCss.subTitle}>
                    {t('description.confirm adjustment payment')}
                  </div>
                </div>
              </div>
            }
          />
          <ClearingPanel
            activeKey={activeKey}
            key="2"
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
                  <div css={headerCss.title}>
                    {t('title.preview payment price')}
                  </div>

                  <div css={headerCss.subTitle}>
                    {t('description.input payment price')}
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

const inner = css({
  padding: '18px 36px 5px 36px',
});
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

const $button = css({
  width: 60,
  height: 40,
  marginRight: 8,
  color: theme.grey500,
  backgroundColor: '#f0f3f6',

  '&:hover': {
    color: theme.grey600,
    backgroundColor: '#d9dbde',
  },

  '&:focus': {
    color: theme.grey500,
    backgroundColor: '#d9dbde',
  },
});

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
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  &:hover {
    color: #6b6d73;
    background-color: #d9dbde;
  }
`;

const greenDatePicker = css`
  background-color: #00b3be;

  &:hover {
    color: #fff;
    background-color: #00b3be;
  }

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

const $subtitle = css`
  margin: 6px 4px 4px 3px;

  font-size: 13px;
  font-weight: 400;
  color: #6b6d73;
`;
const subTitleIcon = css({
  marginRight: 5,
});

export default Service;

import { StoreShow } from '@apis/retailerStoreAPI';
import { TextWithTooltip } from '@components/combine';
import {
  TurtleDivider,
  TurtleIcon,
  TurtleTag,
  TurtleTooltip,
} from '@components/element';
import { css } from '@emotion/react';
import { phonePattern } from '@utils/pattern';
import { Col, Row } from 'antd';
import { t } from 'i18next';
import React from 'react';

interface Props {
  store: StoreShow;
}

const colors = {
  sellmate: {
    color: 'orange',
  },
  ezadmin: {
    color: 'skyblue',
  },
  turtlechain: {
    color: 'gray',
  },
  none: {
    color: 'gray',
  },
  etc: {
    color: 'gray',
  },
} as const;

function StoreCard({ store }: Props) {
  return (
    <div css={card}>
      <div css={titleContainer}>
        <div css={$title}>{store.name}</div>
        <div css={markCss.self}>
          <div
            css={markCss.status}
            style={{
              ['--backgroundColor' as string]: store.is_closed
                ? '#a1a2a6'
                : '#00b3be',
            }}
          />
          <span css={marginLeft}>{store.is_closed ? '폐점' : '운영'}</span>
        </div>
      </div>

      <Row css={marginBottom}>
        <Col css={leftContentCss.self}>
          <TurtleIcon name="phone" />
          <span css={leftContentCss.title}>휴대전화 번호</span>
        </Col>
        <Col css={rightContentCss.self}>
          <span>
            {store?.store_phone[0]?.phone.replace(phonePattern, '$1-$2-$3') ??
              ''}
          </span>
        </Col>
      </Row>

      <Row css={marginBottom}>
        <Col css={leftContentCss.self}>
          <TurtleIcon name="account" />
          <TextWithTooltip
            tooltipContent={[
              '터틀체인으로 입금 및 환불 반환에 사용되는 계좌입니다.',
            ]}
          >
            <span css={leftContentCss.title}>결제 계좌정보</span>
          </TextWithTooltip>
        </Col>
        <Col css={rightContentCss.self}>
          <span>{`${store.store_account[0]?.bank ?? ''} ${
            store.store_account[0]?.account_number ?? ''
          } ${store.store_account[0]?.account_holder ?? ''}`}</span>
        </Col>
      </Row>

      <Row>
        <Col css={leftContentCss.self}>
          <TurtleIcon name="pencil" />
          <TextWithTooltip
            tooltipContent={['이체시, 거래처 통장에 표시되는 내용입니다.']}
          >
            <span css={leftContentCss.title}>받는분 통장인쇄</span>
          </TextWithTooltip>
        </Col>
        <Col>
          <TurtleTag color="gray">
            <span css={rightContentCss.self}>{store.recipient_print}</span>
          </TurtleTag>
        </Col>
      </Row>

      <TurtleDivider marginTop={20} marginBottom={20} />

      <Row css={marginBottom}>
        <Col css={leftContentCss.self}>
          <TurtleIcon name="clip" />
          <span css={leftContentCss.title}>재고관리 프로그램</span>
        </Col>
        <Col>
          <TurtleTag color={colors[store.inventory_type].color}>
            {t(`inventory.${store.inventory_type}`)}
          </TurtleTag>
        </Col>
      </Row>

      <Row>
        <Col css={leftContentCss.self}>
          <TurtleIcon name="at" />
          <span css={leftContentCss.title}>이체내역 수신메일</span>
        </Col>
        <Col>
          <span css={rightContentCss.self}>{store.email}</span>
        </Col>
      </Row>
    </div>
  );
}

const card = css`
  flex-basis: 518px;
  height: 302px;
  padding: 28px 24px 40px;
  box-shadow: 0px 2px 14px 2px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  background-color: #fff;
`;

const titleContainer = css`
  margin-bottom: 32px;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const $title = css`
  font-weight: 500;
  font-size: 20px;
  color: #242934;
`;

const markCss = {
  self: css({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 400,
    fontSize: 14,
    color: '#5b5d63',
  }),

  status: css({
    width: 8,
    height: 8,
    backgroundColor: 'var(--backgroundColor)',
    borderRadius: '50%',
  }),
};

const marginLeft = css`
  margin-left: 7px;
`;

const marginBottom = css`
  margin-bottom: 14px;
`;

const leftContentCss = {
  self: css({
    flexBasis: '42.2%',
    display: 'flex',
    alignItems: 'center',
  }),

  title: css({
    color: '#999ba5',
    marginLeft: 7,
    marginRight: 'var(--marginRight)',
  }),
};

const rightContentCss = {
  self: css({
    color: '#242934',
  }),
};

export default StoreCard;

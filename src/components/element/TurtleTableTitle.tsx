import { css } from '@emotion/react';
import { theme } from '@styles/theme';
import { Col, Divider, Row } from 'antd';
import { t } from 'i18next';
import TurtleText from './TurtleText';

interface Props {
  // 총 n건
  totalCount: number;
  // 총 거래처 n개
  vendorCount?: number;
  // 검색결과 n건
  searchCount?: number;
  // 검색금액 합계 n원
  searchAmount?: number;
  //누적 차감금액 합계 n원
  totalSubstractAmount?: number;
  //누적 환불금액 합계 n원
  totalRefundAmount?: number;
  //누적 결제금액 합계 n원
  totalUnpaidAmount?: number;

  // 우측 children
  rightContent?: React.ReactNode;
}

function TurtleTableTitle({
  totalCount = 0,
  vendorCount,
  searchCount,
  searchAmount,
  rightContent,
  totalSubstractAmount,
  totalRefundAmount,
  totalUnpaidAmount,
}: Props) {
  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
      <Col>
        <TurtleText css={container}>
          {t('description.total')}{' '}
          <TurtleText css={count}>
            {t('description.count', { count: totalCount })}
          </TurtleText>
        </TurtleText>
        {!!vendorCount && vendorCount >= 0 && (
          <TurtleText css={container}>
            <Divider type="vertical" />
            {t('table.totalVendorCount')}{' '}
            <TurtleText css={count}>{vendorCount}</TurtleText>
          </TurtleText>
        )}
        {!!searchAmount && searchAmount >= 0 && (
          <TurtleText css={container}>
            <Divider type="vertical" />
            {t('description.total search amount')}{' '}
            <TurtleText css={count}>{searchAmount.toLocaleString()}</TurtleText>
            {t('description.won')}
          </TurtleText>
        )}
        {!!searchCount && searchCount >= 0 && (
          <TurtleText css={container}>
            <Divider type="vertical" />
            {t('description.search result')}{' '}
            <TurtleText css={count}>{searchCount}</TurtleText>
          </TurtleText>
        )}
        {!!totalRefundAmount && totalRefundAmount >= 0 && (
          <TurtleText css={container}>
            <Divider type="vertical" />
            {t('description.accumulated pending refund')}{' '}
            <TurtleText css={count}>
              {totalRefundAmount.toLocaleString()}
            </TurtleText>
            {t('description.won')}
          </TurtleText>
        )}
        {!!totalSubstractAmount && totalSubstractAmount >= 0 && (
          <TurtleText css={container}>
            <Divider type="vertical" />
            {t('description.accumulated credit')}{' '}
            <TurtleText css={count}>
              {totalSubstractAmount.toLocaleString()}
            </TurtleText>
            {t('description.won')}
          </TurtleText>
        )}
        {!!totalUnpaidAmount && totalUnpaidAmount >= 0 && (
          <TurtleText css={container}>
            <Divider type="vertical" />
            {t('description.accumulated amount due')}{' '}
            <TurtleText css={count}>
              {totalUnpaidAmount.toLocaleString()}
            </TurtleText>
            {t('description.won')}
          </TurtleText>
        )}
      </Col>
      <Col>{rightContent}</Col>
    </Row>
  );
}

const container = css`
  color: #5b5d63;
  font-size: 13px;
  font-weight: 500;
`;

const count = css({
  color: theme.bluegreen,
  fontWeight: 700,
});

export default TurtleTableTitle;

import { css } from '@emotion/react';
import { Col, Divider, Row } from 'antd';
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
          총 <TurtleText css={count}>{totalCount}</TurtleText>건
        </TurtleText>
        {!!vendorCount && vendorCount >= 0 && (
          <TurtleText css={container}>
            <Divider type="vertical" />총 거래처{' '}
            <TurtleText css={count}>{vendorCount}</TurtleText>개
          </TurtleText>
        )}
        {!!searchCount && searchCount >= 0 && (
          <TurtleText css={container}>
            <Divider type="vertical" />
            검색결과 <TurtleText css={count}>{searchCount}</TurtleText>건
          </TurtleText>
        )}
        {!!searchAmount && searchAmount >= 0 && (
          <TurtleText css={container}>
            <Divider type="vertical" />
            검색금액 합계{' '}
            <TurtleText css={count}>{searchAmount.toLocaleString()}</TurtleText>
            원
          </TurtleText>
        )}
        {!!totalSubstractAmount && totalSubstractAmount >= 0 && (
          <TurtleText css={container}>
            <Divider type="vertical" />
            누적 차감금액 합계{' '}
            <TurtleText css={count}>
              {totalSubstractAmount.toLocaleString()}
            </TurtleText>
            원
          </TurtleText>
        )}
        {!!totalRefundAmount && totalRefundAmount >= 0 && (
          <TurtleText css={container}>
            <Divider type="vertical" />
            누적 환불금액 합계{' '}
            <TurtleText css={count}>
              {totalRefundAmount.toLocaleString()}
            </TurtleText>
            원
          </TurtleText>
        )}
        {!!totalUnpaidAmount && totalUnpaidAmount >= 0 && (
          <TurtleText css={container}>
            <Divider type="vertical" />
            누적 결제금액 합계{' '}
            <TurtleText css={count}>
              {totalUnpaidAmount.toLocaleString()}
            </TurtleText>
            원
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

const count = css`
  color: #32acdd;
  font-weight: 700;
`;

export default TurtleTableTitle;

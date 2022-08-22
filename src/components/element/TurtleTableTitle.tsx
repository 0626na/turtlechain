import { Col, Row } from 'antd';
import TurtleText from './TurtleText';

interface Props {
  totalCount: number;
  rightContent?: React.ReactNode;

  // label?: string;
  // fontSize?: string;
  // selectedCount?: number;
  // searchCount?: number;
  // totalAmount?: number;
  // totalPrice?: number;
  // children?: React.ReactNode;
}

function TurtleTableTitle({
  // label,
  totalCount = 0,
  rightContent,
}: // selectedCount,
// searchCount,
// totalAmount,
// totalPrice,
// children,

Props) {
  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
      <Col>
        <TurtleText style={{ color: '#5B5D63', fontSize: 13, fontWeight: 500 }}>
          총
          <TurtleText style={{ color: '#32ACDD', fontWeight: 700 }}>
            {totalCount}
          </TurtleText>
          건
        </TurtleText>
      </Col>
      <Col>{rightContent}</Col>
      {/* <span>
        {!!searchCount && searchCount >= 0 && (
          <>
            <Divider type="vertical" />
            검색결과 <span style={{ color: '#32ACDD' }}>{searchCount}</span>건
          </>
        )}
        {!!totalAmount && totalAmount >= 0 && (
          <>
            <Divider type="vertical" />
            검색금액 합계{' '}
            <span style={{ color: '#32ACDD' }}>
              {totalAmount?.toLocaleString()}
            </span>
            원
          </>
        )}
        {!!selectedCount && (
          <>
            <Divider type="vertical" />
            선택 <span style={{ color: '#32ACDD' }}>{selectedCount}</span>건
          </>
        )}
        {!!totalPrice && totalPrice >= 0 && (
          <>
            <Divider type="vertical" />총 금액{' '}
            <span style={{ color: '#32ACDD' }}>
              {totalPrice?.toLocaleString()}
            </span>
            원
          </>
        )}
      </span> */}
    </Row>
  );
}

export default TurtleTableTitle;

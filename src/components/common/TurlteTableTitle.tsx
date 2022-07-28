import { Divider, Row, Space } from 'antd';

interface Props {
  label?: string;
  fontSize?: string;
  count: number;
  selectedCount?: number;
  searchCount?: number;
  totalAmount?: number;
  totalPrice?: number;
  children?: React.ReactNode;
}

function TurtleTableTitle({
  label,
  count = 0,
  selectedCount,
  searchCount,
  totalAmount,
  totalPrice,
  children,
}: Props) {
  return (
    <Row justify="space-between" align="middle" style={{ paddingBottom: 6 }}>
      <span>
        {label && (
          <span style={{ fontSize: 18, fontWeight: 500, marginRight: 8 }}>
            {label}
          </span>
        )}
        총<span style={{ color: '#32ACDD' }}>{count}</span>건
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
      </span>
      <Space>{children}</Space>
    </Row>
  );
}

export default TurtleTableTitle;

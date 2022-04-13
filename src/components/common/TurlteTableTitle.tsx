import { Row, Space } from "antd";

interface Props {
  count: number;
  selectedCount?: number;
  searchCount?: number;
  children?: React.ReactNode;
}
function TurtleTableTitle({ count = 0, selectedCount, searchCount, children }: Props) {
  return (
    <Row justify="space-between" style={{ paddingBottom: 6 }}>
      <span>
        총 <span style={{ color: "#32ACDD" }}>{count}</span>건
        {!!selectedCount && (
          <>
            &nbsp;| 선택 <span style={{ color: "#32ACDD" }}>{selectedCount}</span>건
          </>
        )}
        {searchCount! >= 0 && (
          <>
            &nbsp;| 검색결과 <span style={{ color: "#32ACDD" }}>{searchCount}</span>건
          </>
        )}
      </span>
      <Space>{children}</Space>
    </Row>
  );
}

export default TurtleTableTitle;

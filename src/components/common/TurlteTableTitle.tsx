import { Row, Space } from "antd";

interface Props {
  count: number;
  children: React.ReactNode;
}
function TurtleTableTitle({ count = 0, children }: Props) {
  return (
    <Row justify="space-between" style={{ paddingBottom: 6 }}>
      <span>
        총 <span style={{ color: "#32ACDD" }}>{count}</span>건
      </span>
      <Space>{children}</Space>
    </Row>
  );
}

export default TurtleTableTitle;

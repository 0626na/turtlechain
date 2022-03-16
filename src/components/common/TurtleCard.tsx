import { Card, Col, Row, Tag } from "antd";
import Meta from "antd/lib/card/Meta";

interface Props {
  color: string;
  span: number;
  title: string;
  count: number;
  price: number;
}

function TurtleCard({ color, span, title, count = 0, price = 0 }: Props) {
  return (
    <Col span={span}>
      <Card size="small">
        <Row justify="center">
          <Tag color={color} style={{ margin: 4, borderRadius: 10 }}>
            {title}
          </Tag>
        </Row>
        <Meta
          title={
            <>
              <span style={{ fontSize: 24 }}>{count}</span>건
            </>
          }
          description={`${price.toLocaleString()}원`}
          style={{ textAlign: "center", margin: "12px 0" }}
        />
      </Card>
    </Col>
  );
}

export default TurtleCard;

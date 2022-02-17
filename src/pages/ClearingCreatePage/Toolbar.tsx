import { Col, Row } from "antd";
import StoreSelect from "components/StoreSelect";

interface Props {
  warningMessage?: string;
}

function Toolbar({warningMessage} : Props) {
  return (
    <Row gutter={24} align={"middle"} justify="space-between">
      <Col>
        <StoreSelect warningMessage={warningMessage} />
      </Col>
    </Row>
  );
}

export default Toolbar;

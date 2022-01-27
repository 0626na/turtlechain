import { Col, Row } from "antd";
import StoreSelect from "components/StoreSelect";

interface Props {
  selectStore: (storeId: number | "") => void;
}

function Toolbar({selectStore} : Props) {
  return (
    <Row gutter={24} align={"middle"} justify="space-between">
      <Col>
        <StoreSelect selectStore={selectStore} />
      </Col>
    </Row>
  );
}

export default Toolbar;

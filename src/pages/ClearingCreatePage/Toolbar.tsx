import { Col, Row } from "antd";
import StoreSelect from "components/StoreSelect";

interface Props {
  selectStore: (storeId: number | "") => void;
  warningPhrase?: string;
}

function Toolbar({selectStore, warningPhrase} : Props) {
  return (
    <Row gutter={24} align={"middle"} justify="space-between">
      <Col>
        <StoreSelect selectStore={selectStore} warningPhrase={warningPhrase} />
      </Col>
    </Row>
  );
}

export default Toolbar;

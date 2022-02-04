import { Col, Row } from "antd";
import StoreSelect from "components/StoreSelect";

interface Props {
  selectStore: (storeId: number | "") => void;
  warningMessage?: string;
}

function Toolbar({selectStore, warningMessage} : Props) {
  return (
    <Row gutter={24} align={"middle"} justify="space-between">
      <Col>
        <StoreSelect selectStore={selectStore} warningMessage={warningMessage} />
      </Col>
    </Row>
  );
}

export default Toolbar;

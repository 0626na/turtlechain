import { Col, Row, Space } from "antd";
import TurtleButton from "components/common/TurtleButton";
import { useTranslation } from "react-i18next";
import StoreSelect from "components/StoreSelect";

interface Props {
  selectStore: (storeId: number | "") => void;
}

function Filter({ selectStore }: Props) {
  const { t } = useTranslation();

  return (
    <Row gutter={24} align="middle" justify="space-between">
      <Col>
        <Space size="large">
          <StoreSelect selectStore={selectStore} />
        </Space>
      </Col>
      <Col>
        <Space>
          <TurtleButton type="primary">
            {t("button.download vendor")}
          </TurtleButton>
        </Space>
      </Col>
    </Row>
  );
}

export default Filter;

import { Col, message, Row, Space } from "antd";
import StoreSelect from "components/StoreSelect";
import { t } from "i18next";

interface Props {
  children: React.ReactNode;
}

function Toolbar({ children }: Props) {
  return (
    <>
      <Row
        gutter={24}
        align={"middle"}
        justify="space-between"
        style={{
          margin: "0",
          padding: "12px 12px",
          backgroundColor: "rgba(243,246,249, 0.4)",
        }}
      >
        <Col>
          <StoreSelect warningMessage="쇼핑몰 변경 시 작업하였던 정보가 모두 사라집니다. 변경하시겠습니까?" />
        </Col>
        {children}
      </Row>
    </>
  );
}

export default Toolbar;

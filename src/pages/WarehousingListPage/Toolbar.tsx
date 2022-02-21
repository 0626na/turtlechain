import { Col, Row, Space } from "antd";
import StoreSelect from "components/StoreSelect";
import { useState } from "react";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import { t } from "i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { storeState } from "store/storeState";

function Toolbar() {
  const store = useRecoilState(storeState)
  const [createModalVisible, setCreateModalVisible] = useState(false);

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
          <StoreSelect />
        </Col>

      </Row>
    </>
  );
}

export default Toolbar;

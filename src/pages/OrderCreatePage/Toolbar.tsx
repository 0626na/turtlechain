import { Col, message, Row, Space } from "antd";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import StoreSelect from "components/StoreSelect";
import { t } from "i18next";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import CreateBulkOrderModal from "./CreateBulkOrderModal";

function Toolbar() {
  const store = useRecoilValue(storeState);
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
        <Col>
          <Space>
            <TurtleButtonSub
              icon="file"
              onClick={() => {
                if (!store.id) {
                  message.warn("쇼핑몰을 선택해주세요.");
                  return;
                }
                setCreateModalVisible(true);
              }}
            >
              {t("button.upload order sheet")}
            </TurtleButtonSub>
            {/* <TurtleButtonSub icon="download">{t("button.load adjustment")}</TurtleButtonSub> */}
          </Space>
        </Col>
      </Row>
      <CreateBulkOrderModal
        visible={createModalVisible}
        closeModal={() => {
          setCreateModalVisible(false);
        }}
      />
    </>
  );
}

export default Toolbar;

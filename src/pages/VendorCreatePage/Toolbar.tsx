import { Col, message, Row, Space } from "antd";
import StoreSelect from "components/StoreSelect";
import { useState } from "react";
import CreateBulkVendorModal from "./CreateBulkVendorModal";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import { t } from "i18next";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";

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
            <TurtleButtonSub // 거래처 대량 등록 Button
              icon="file"
              onClick={() => {
                if (!store.id) {
                  message.warn("쇼핑몰을 선택해주세요.");
                  return;
                }
                setCreateModalVisible(true);
              }}
            >
              {t("button.create bulk vendor")}
            </TurtleButtonSub>
            {/* <TurtleButtonSub // 거래처 불러오기 Button
              icon="download"
            >
              {t("button.load vendor")}
            </TurtleButtonSub> */}
          </Space>
        </Col>
      </Row>
      <CreateBulkVendorModal
        visible={createModalVisible}
        closeModal={() => {
          setCreateModalVisible(false);
        }}
      />
    </>
  );
}

export default Toolbar;

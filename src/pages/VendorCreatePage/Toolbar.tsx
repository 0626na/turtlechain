import { Button, Col, Row, Space } from "antd";
import TurtleButton from "components/common/TurtleButton";
import StoreSelect from "components/StoreSelect";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CreateVendorsModal from "./CreateVendorsModal";
import { DownloadOutlined, FileOutlined } from "@ant-design/icons";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import { t } from "i18next";

function Toolbar() {
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
                setCreateModalVisible(true);
              }}
            >
              {t("button.create bulk vendor")}
            </TurtleButtonSub>
            <TurtleButtonSub // 거래처 불러오기 Button
              icon="download"
            >
              {t("button.load vendor")}
            </TurtleButtonSub>
          </Space>
        </Col>
      </Row>
      <CreateVendorsModal
        visible={createModalVisible}
        closeModal={() => {
          setCreateModalVisible(false);
        }}
      />
    </>
  );
}

export default Toolbar;

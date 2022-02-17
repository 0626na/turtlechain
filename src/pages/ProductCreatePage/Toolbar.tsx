import { Col, Row, Space } from "antd";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import StoreSelect from "components/StoreSelect";
import { t } from "i18next";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { storeState } from "store/storeState";
import CreateBulkProductModal from "./CreateBulkProductModal";

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
            <TurtleButtonSub // 상품 대량 등록 Button
              icon="file"
              onClick={() => {
                setCreateModalVisible(true);
              }}
              disabled={!store.id}
            >
              {t("button.create bulk product")}
            </TurtleButtonSub>
            {/* <TurtleButtonSub // 상품 목록 불러오기 Button
              icon="download"
            >
              {t("button.load product")}
            </TurtleButtonSub> */}
          </Space>
        </Col>
      </Row>
      <CreateBulkProductModal
        visible={createModalVisible}
        closeModal={() => {
          setCreateModalVisible(false);
        }}
      />
    </>
  );
}

export default Toolbar;

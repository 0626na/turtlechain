import { Col, Row, Space } from "antd";
import StoreSelect from "components/StoreSelect";
import { useState } from "react";
// import CreateBulkWhsModal from "./CreateBulkWhsModal";
import TurtleButtonSub from "components/common/TurtleButtonSub";
import { t } from "i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import { storeIdState } from "store/storeIdState";
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
        <Col>
          <Space>
            {/* <TurtleButtonSub // 거래처 대량 등록 Button
              icon="file"
              onClick={() => {
                setCreateModalVisible(true);
              }}
              disabled={!store}
            >
              {t("btn_upload_whs_sheet")}
            </TurtleButtonSub>
            <TurtleButtonSub // 거래처 불러오기 Button
              icon="download"
            >
              {t("btn_prepopulate_whs")}
            </TurtleButtonSub> */}
          </Space>
        </Col>
      </Row>
      {/* <CreateBulkWhsModal
        visible={createModalVisible}
        closeModal={() => {
          setCreateModalVisible(false);
        }}
      /> */}
    </>
  );
}

export default Toolbar;

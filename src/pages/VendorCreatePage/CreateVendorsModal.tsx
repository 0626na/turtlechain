import { Button, Modal, Row, Space, Tabs, Typography, Upload } from "antd";
import { useTranslation } from "react-i18next";
import { UploadOutlined } from "@ant-design/icons";
import TurtleInfo from "components/common/TurtleInfo";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function CreateVendorsModal({ visible, closeModal }: Props) {
  const { t } = useTranslation();
  return (
    <Modal
      centered
      width="80%"
      maskClosable={false}
      title={
        <>
          <span style={{ fontSize: "18px" }}>{t("vendor.request create")}</span>
          <TurtleInfo>대량 업로드 파일은 .CSV또는 .XLXS만 사용할 수 있습니다.</TurtleInfo>
        </>
      }
      visible={visible}
      onCancel={closeModal}
      footer={false}
      bodyStyle={{ height: "700px", overflowY: "auto" }}
    >
      <Space>
        <Typography.Text>거래처 업로드</Typography.Text>
        <Upload>
          <Button icon={<UploadOutlined />}>파일 선택하기</Button>
        </Upload>
      </Space>
      <Tabs defaultActiveKey="1" size="large">
        <Tabs.TabPane tab="정상" key="1">
          정상
        </Tabs.TabPane>
        <Tabs.TabPane tab="이상" key="2">
          이상
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}

export default CreateVendorsModal;

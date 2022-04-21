import { Form, Modal, Row } from "antd";
import { Vendor } from "apis/vendorAPI";
import { t } from "i18next";
import { TurtleButton, TurtleInput, TurtleQuestionTooltip, TurtleText } from "components/common";

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow?: Vendor;
}

function UpdateModal({ visible, closeModal }: Props) {
  const [form] = Form.useForm();

  return (
    <Modal
      centered
      width="80%"
      title={t("vendor.request update")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      bodyStyle={{ height: "700px", overflowY: "auto" }}
      forceRender
    >
      <Form //
        layout="vertical"
        labelCol={{ span: 4, offset: 1 }}
        wrapperCol={{ span: 10, offset: 1 }}
        colon={false}
        form={form}
      >
        {/*
         *
         *
         * 거래처 기본 정보
         *
         *
         */}
        <TurtleText>{t("vendor.basic info")}</TurtleText>
        <TurtleInput // 거래처명 검색 Input
          name="name"
          label={t("vendor.name")}
          placeholder={t("placeholder.vendor name")}
          required={false}
        />
        <TurtleInput // 거래처 매장번호 Input
          name="phone"
          label={t("vendor.phone")}
          placeholder={t("placeholder.phone")}
          required={false}
        />
        <TurtleInput // 기타 주소 Input
          name="ext"
          label={t("vendor.ext")}
          placeholder={t("placeholder.ext")}
          required={false}
        />
        {/*
         *
         *
         * 거래처 계좌 정보
         *
         *
         */}
        <TurtleText>
          {t("vendor.account info")}
          <TurtleQuestionTooltip content={t("tooltip.main account info")} />
        </TurtleText>
        <Row justify="center">
          <Form.Item>
            <TurtleButton onClick={() => {}} disabled={true}>
              {t("button.request update")}
            </TurtleButton>
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
}

export default UpdateModal;

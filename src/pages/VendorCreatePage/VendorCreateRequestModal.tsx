import { Form, Input, Modal, Row } from "antd";
import AddressSelect from "components/AddressSelect";
import TurtleInput from "components/common/TurtleInput";
import TurtleQuestionTooltip from "components/common/TurtleQuestionTooltip";
import TurtleText from "components/common/TurtleText";
import { useTranslation } from "react-i18next";
import TurtleButton from "components/common/TurtleButton";
import BankSelect from "components/BankSelect";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function VendorCreateRequestModal({ visible, closeModal }: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  return (
    <Modal
      centered
      width="80%"
      maskClosable={false}
      title={t("vendor.request create")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      getContainer={false}
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
        <TurtleInput // 거래처 휴대번호 Input
          name="store_phone"
          label={t("vendor.store phone")}
          placeholder={t("placeholder.store phone")}
          required={false}
        />
        <AddressSelect />
        <TurtleInput // 기타 주소 Input
          name="ext"
          label={t("vendor.ext")}
          placeholder={t("placeholder.ext")}
          required={false}
        />
        <TurtleText>
          {t("vendor.account info")}
          <TurtleQuestionTooltip content={t("tooltip.main account info")} />
        </TurtleText>
        <BankSelect />
        <Row justify="center">
          <Form.Item>
            <TurtleButton
              type="primary"
              htmlType="submit"
              onClick={() => {
                console.log(form.getFieldsValue());
              }}
            >
              {t("button.request create")}
            </TurtleButton>
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
}

export default VendorCreateRequestModal;

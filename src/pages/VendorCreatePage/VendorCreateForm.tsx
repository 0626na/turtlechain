import { Col, Form, Row, Space } from "antd";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleText from "components/common/TurtleText";
import { t } from "i18next";
import TurtleButton from "components/common/TurtleButton";

function VendorCreateForm() {
  const [form] = Form.useForm();

  return (
    <>
      <Form form={form} wrapperCol={{ span: 20 }}>
        <TurtleText>{t("vendor.basic info")}</TurtleText>
        <TurtleSearchInput // 거래처명 검색 Input
          name="vendor_name"
          label={t("vendor.name")}
          placeholder={t("placeholder.vendor name")}
        />
      </Form>
    </>
  );
}

export default VendorCreateForm;

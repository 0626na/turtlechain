import { Form, Input, Select, Space } from "antd";
import TurtleInput from "components/common/TurtleInput";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleText from "components/common/TurtleText";
import TurtleTextArea from "components/common/TurtleTextArea";
import { t } from "i18next";

function VendorCreateForm() {
  const [form] = Form.useForm();

  return (
    <>
      <Form //
        layout="horizontal"
        form={form}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 8 }}
        colon={false}
      >
        <TurtleText>{t("vendor.basic info")}</TurtleText>
        <TurtleSearchInput // 거래처명 검색 Input
          name="vendor_name"
          label={t("vendor.name")}
          placeholder={t("placeholder.vendor name")}
        />
        <TurtleInput // 거래처 매장번호 Input
          name="vendor_phone"
          label={t("vendor.phone")}
        />
        <TurtleInput // 거래처 휴대번호 Input
          name="vendor_store_phone"
          label={t("vendor.store phone")}
        />
        <Form.Item label={t("vendor.address")} required={true}>
          <Space>
            <Form.Item
              name={["address", ""]}
              noStyle
              rules={[{ required: true, message: "Province is required" }]}
            >
              <Select placeholder="Select province">
                <Select.Option value="Zhejiang">Zhejiang</Select.Option>
                <Select.Option value="Jiangsu">Jiangsu</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={["address", "province"]}
              noStyle
              rules={[{ required: true, message: "Province is required" }]}
            >
              <Select placeholder="Select province">
                <Select.Option value="Zhejiang">Zhejiang</Select.Option>
                <Select.Option value="Jiangsu">Jiangsu</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={["address", "province"]}
              noStyle
              rules={[{ required: true, message: "Province is required" }]}
            >
              <Select placeholder="Select province">
                <Select.Option value="Zhejiang">Zhejiang</Select.Option>
                <Select.Option value="Jiangsu">Jiangsu</Select.Option>
              </Select>
            </Form.Item>
          </Space>
        </Form.Item>
        <TurtleInput // 거래처 주소 Input
          name="vendor_address"
          label={t("vendor.address")}
        />
        <TurtleInput // 거래처 코드 Input
          name="vendor_code"
          label={t("vendor.code")}
        />
        <TurtleText>{t("vendor.account info")}</TurtleText>
        <TurtleText>{t("vendor.biz info")}</TurtleText>
        <TurtleTextArea // 주문 메모 TextArea
          name="vendor_memo"
          label={t("vendor.memo")}
          placeholder={t("placeholder.memo")}
        />
      </Form>
    </>
  );
}

export default VendorCreateForm;

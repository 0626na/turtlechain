import { Form, Input, Select, Space } from "antd";
import { useTranslation } from "react-i18next";

function BankSelect() {
  const { t } = useTranslation();

  return (
    <>
      <Form.Item label={t("vendor.account")} required={false}>
        <Space>
          <Form.Item
            name={["account", ""]}
            noStyle
            rules={[{ required: true, message: "Province is required" }]}
          >
            <Select placeholder="Select province" style={{ width: "12rem" }}>
              <Select.Option value="Zhejiang">Zhejiang</Select.Option>
              <Select.Option value="Jiangsu">Jiangsu</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={["address", "province"]}
            noStyle
            rules={[{ required: true, message: "Province is required" }]}
          >
            <Input style={{ width: "12rem" }} />
          </Form.Item>
          <Form.Item
            name={["address", "province"]}
            noStyle
            rules={[{ required: true, message: "Province is required" }]}
          >
            <Input style={{ width: "12rem" }} />
          </Form.Item>
        </Space>
      </Form.Item>
    </>
  );
}

export default BankSelect;

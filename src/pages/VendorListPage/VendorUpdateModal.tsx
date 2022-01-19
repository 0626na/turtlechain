import { Form, Modal, Select, Space } from "antd";
import AddressSelect from "components/AddressSelect";
import TurtleInput from "components/common/TurtleInput";
import TurtleQuestionTooltip from "components/common/TurtleQuestionTooltip";
import TurtleSearchInput from "components/common/TurtleSearchInput";
import TurtleText from "components/common/TurtleText";
import { useTranslation } from "react-i18next";

interface Props {
  visible: boolean;
  closeModal: () => void;
}

function VendorUpdateModal({ visible, closeModal }: Props) {
  const { t } = useTranslation();

  return (
    <Modal
      centered
      width="90%"
      maskClosable={false}
      title={t("vendor.request update")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
    >
      <Form //
        layout="vertical"
        //form={form}
        labelCol={{ span: 3, offset: 1 }}
        wrapperCol={{ span: 8, offset: 1 }}
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
        <AddressSelect />
        <TurtleText>
          {t("vendor.account info")}
          <TurtleQuestionTooltip content={t("tooltip.main account info")} />
        </TurtleText>
        <Form.Item label={t("vendor.account")} required={true}>
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
      </Form>
    </Modal>
  );
}

export default VendorUpdateModal;

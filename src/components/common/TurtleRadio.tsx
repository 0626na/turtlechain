import { Form, Radio } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  name: string;
  label: string;
  value: string;
  onChange: (e: any) => void;
}

function TurtleRadio({ name, label, value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <Form.Item name="order_type" label={t("order type")} rules={[{ required: true }]}>
      <Radio.Group onChange={onChange} value={value} defaultValue="order">
        <Radio value="order">{t("order")}</Radio>
        <Radio value="reserved">{t("reserved")}</Radio>
        <Radio value="take_back">{t("take back")}</Radio>
        <Radio value="exchange">{t("exchange")}</Radio>
        <Radio value="samle">{t("samle")}</Radio>
        <Radio value="pickup">{t("pickup")}</Radio>
        <Radio value="etc">{t("etc")}</Radio>
      </Radio.Group>
    </Form.Item>
  );
}

export default TurtleRadio;

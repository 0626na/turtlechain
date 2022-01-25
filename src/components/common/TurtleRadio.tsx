import { Form, Radio, RadioChangeEvent } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  name: string;
  label: string;
  value: string;
  onChange: (e: RadioChangeEvent) => void;
}

function TurtleRadio({ name, label, value, onChange }: Props) {
  const { t } = useTranslation();

  return (
    <Form.Item name={name} label={label} rules={[{ required: true }]}>
      <Radio.Group onChange={onChange} value={value} size="large">
        <Radio value="order">{t("order.type.order")}</Radio>
        <Radio value="reserved">{t("order.type.reserved")}</Radio>
        <Radio value="take_back">{t("order.type.take back")}</Radio>
        <Radio value="exchange">{t("order.type.exchange")}</Radio>
        <Radio value="sample">{t("order.type.sample")}</Radio>
        <Radio value="pickup">{t("order.type.pickup")}</Radio>
        <Radio value="etc">{t("order.type.etc")}</Radio>
      </Radio.Group>
    </Form.Item>
  );
}

export default TurtleRadio;

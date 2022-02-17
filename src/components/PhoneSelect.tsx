import { Button, Form, Input } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { t } from "i18next";
import TurtleInput from "./common/TurtleInput";

interface Props {
  phoneList: Array<string>;
  setPhoneList: React.Dispatch<React.SetStateAction<string[]>>;
}

function PhoneSelect({ phoneList, setPhoneList }: Props) {
  return (
    <>
      {phoneList.map((phone, index) => (
        <Form.Item
          label={index === 0 ? t("vendor.store phone") : ""}
          key={index}
          style={{ marginBottom: "0" }}
        >
          <Form.Item>
            <TurtleInput //
              value={phone}
              placeholder={t("placeholder.store phone")}
            />
          </Form.Item>
        </Form.Item>
      ))}
      <Form.Item>
        <Button
          type="dashed"
          //onClick={() => add()}
          style={{ width: "96%" }}
          icon={<PlusOutlined />}
        >
          {t("button.add phone")}
        </Button>
      </Form.Item>
    </>
  );
}

export default PhoneSelect;

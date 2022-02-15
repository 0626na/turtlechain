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
    // <Form.List
    //   name="store_phone"
    //   rules={[
    //     {
    //       validator: async (_, names) => {
    //         if (!names || names.length < 1) {
    //           return Promise.reject(new Error("휴대번호를 1개 이상 입력하세요."));
    //         }
    //       },
    //     },
    //   ]}
    // >
    //   {(fields, { add, remove }, { errors }) => {
    //     return (
    //       <>
    //         {fields.map((field, index) => {
    //           return (
    //             <Form.Item
    //               {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
    //               label={index === 0 ? t("vendor.store phone") : ""}
    //               required={false}
    //               key={field.key}
    //             >
    //               <Form.Item
    //                 {...field}
    //                 validateTrigger={["onChange", "onBlur"]}
    //                 rules={[
    //                   {
    //                     required: true,
    //                     whitespace: true,
    //                     message: "휴대번호 입력해 주세요",
    //                   },
    //                 ]}
    //                 noStyle
    //                 name={field.name}
    //               >
    //                 <Input호placeholder={t("placeholder.store phone")} style={{ width: "60%" }} />
    //               </Form.Item>
    //               {fields.length > 1 ? (
    //                 <MinusCircleOutlined onClick={() => remove(field.name)} />
    //               ) : null}
    //             </Form.Item>
    //           );
    //         })}
    //         <Form.Item>
    //           <Button
    //             type="dashed"
    //             onClick={() => add()}
    //             style={{ width: "96%" }}
    //             icon={<PlusOutlined />}
    //           >
    //             {t("button.add phone")}
    //           </Button>
    //           <Form.ErrorList errors={errors} />
    //         </Form.Item>
    //       </>
    //     );
    //   }}
    // </Form.List>
  );
}

export default PhoneSelect;

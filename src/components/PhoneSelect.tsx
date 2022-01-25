import { Button, Form, Input } from "antd";
import { useTranslation } from "react-i18next";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

function PhoneSelect() {
  const [t] = useTranslation();

  const formItemLayout = {
    labelCol: {
      span: 16,
      offset: 1,
    },
    wrapperCol: {
      span: 16,
      offset: 1,
    },
  };

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      span: 16,
      offset: 1,
    },
  };

  return (
    <Form.List
      name="store_phone"
      rules={[
        {
          validator: async (_, names) => {
            if (!names || names.length < 1) {
              return Promise.reject(new Error("휴대번호를 1개 이상 입력하세요."));
            }
          },
        },
      ]}
    >
      {(fields, { add, remove }, { errors }) => {
        return (
          <>
            {fields.map((field, index) => {
              return (
                <Form.Item
                  {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
                  label={index === 0 ? t("vendor.store phone") : ""}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: "휴대번호 입력해 주세요",
                      },
                    ]}
                    noStyle
                    name={field.name}
                  >
                    <Input placeholder={t("placeholder.store phone")} style={{ width: "60%" }} />
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  ) : null}
                </Form.Item>
              );
            })}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: "96%" }}
                icon={<PlusOutlined />}
              >
                {t("button.add phone")}
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        );
      }}
    </Form.List>
  );
}

export default PhoneSelect;

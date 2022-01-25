import { Button, Form, Input, Select } from "antd";
import { useTranslation } from "react-i18next";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

function BankSelect() {
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
      name="store_account"
      rules={[
        {
          validator: async (_, names) => {
            if (!names || names.length < 1) {
              return Promise.reject(new Error("계좌번호를 1개 이상 입력하세요."));
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
                  label={index === 0 ? t("vendor.account") : ""}
                  required={false}
                  key={field.key}
                  wrapperCol={{ span: 24, offset: 1 }}
                >
                  <Input.Group compact>
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "은행명 입력해 주세요",
                        },
                      ]}
                      noStyle
                      name={[field.name, "bank"]}
                    >
                      <Select style={{ width: "20%" }} />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "계좌번호 입력해 주세요",
                        },
                      ]}
                      noStyle
                      name={[field.name, "account_number"]}
                    >
                      <Input style={{ width: "20%" }} />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      validateTrigger={["onChange", "onBlur"]}
                      rules={[
                        {
                          required: true,
                          whitespace: true,
                          message: "예금주명 입력해 주세요",
                        },
                      ]}
                      noStyle
                      name={[field.name, "account_holder"]}
                    >
                      <Input style={{ width: "20%" }} />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    ) : null}
                  </Input.Group>
                </Form.Item>
              );
            })}
            <Form.Item wrapperCol={{ span: 14, offset: 1 }}>
              <Button
                type="dashed"
                onClick={() => add()}
                style={{ width: "98%" }}
                icon={<PlusOutlined />}
              >
                {t("button.add account")}
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        );
      }}
    </Form.List>
  );
}

export default BankSelect;

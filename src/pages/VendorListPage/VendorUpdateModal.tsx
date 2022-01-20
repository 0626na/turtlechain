import { Button, Form, Input, Modal, Row } from "antd";
import AddressSelect from "components/AddressSelect";
import BankSelect from "components/BankSelect";
import TurtleInput from "components/common/TurtleInput";
import TurtleQuestionTooltip from "components/common/TurtleQuestionTooltip";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import TurtleText from "components/common/TurtleText";
import { useTranslation } from "react-i18next";
import { Vendor } from "apis/vendorAPI";
import { useEffect } from "react";
import TurtleButton from "components/common/TurtleButton";

interface Props {
  visible: boolean;
  closeModal: () => void;
  selectedRow: Vendor;
}

function VendorUpdateModal({ visible, closeModal, selectedRow }: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  // 렌더링 시 form객체 selectedRow로 채운다.
  useEffect(() => {
    form.setFieldsValue(selectedRow);
  }, [selectedRow]);

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
    <Modal
      centered
      width="80%"
      maskClosable={false}
      title={t("vendor.request update")}
      visible={visible}
      onCancel={closeModal}
      footer={false}
      getContainer={false}
      bodyStyle={{ height: "700px", overflowY: "auto" }}
    >
      <Form //
        layout="vertical"
        form={form}
        labelCol={{ span: 4, offset: 1 }}
        wrapperCol={{ span: 10, offset: 1 }}
        colon={false}
      >
        <TurtleText>{t("vendor.basic info")}</TurtleText>
        <TurtleInput // 거래처명 검색 Input
          name={["ws_store_info", "name"]}
          label={t("vendor.name")}
          placeholder={t("placeholder.vendor name")}
          required={false}
        />
        <TurtleInput // 거래처 매장번호 Input
          name={["ws_store_info", "phone"]}
          label={t("vendor.phone")}
          placeholder={t("placeholder.phone")}
          required={false}
        />
        <Form.List
          name={["ws_store_info", "store_phone"]}
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
                {fields.map((field, index) => (
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
                      name={[field.name, "phone"]}
                    >
                      <Input placeholder={t("placeholder.store phone")} style={{ width: "60%" }} />
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    ) : null}
                  </Form.Item>
                ))}
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
        <AddressSelect />
        <TurtleText>
          {t("vendor.account info")}
          <TurtleQuestionTooltip content={t("tooltip.main account info")} />
        </TurtleText>
        <BankSelect />
        <Row justify="center">
          <Form.Item>
            <TurtleButton type="primary" htmlType="submit">
              {t("button.request update")}
            </TurtleButton>
          </Form.Item>
        </Row>
      </Form>
    </Modal>
  );
}

export default VendorUpdateModal;

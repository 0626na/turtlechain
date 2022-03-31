import { useState } from "react";
import { Link } from "react-router-dom";
// async
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { userAPI } from "apis";
// antd
import { Form, Button, Divider, Typography, message, Input } from "antd";
import { t } from "i18next";
import { PhoneAuthModal } from "components/combine";

function ResetPasswordForm() {
  const [visibleAuthModal, setVisibleAuthModal] = useState(false);
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");

  const requiredRules = [{ required: true, message: t("description.required item") }];

  // 비밀번호 재설정 요청
  const resetPasswordQuery = useMutation(["resetPassword"], userAPI.resetPassword, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: () => {
      form.resetFields();
      setPhone("");
      setToken("");
      message.success(t("message.success reset password"));
    },
  });

  // 비밀번호 재설정
  const handleReset = () => {
    form //
      .validateFields()
      .then((value) => {
        const { login_id, password } = value;
        resetPasswordQuery.mutate({ login_id, password, phone, token });
      });
  };

  return (
    <>
      <PhoneAuthModal
        visible={visibleAuthModal}
        onClose={() => setVisibleAuthModal(false)}
        onSuccess={(data) => {
          const { token, phone } = data;
          setToken(token);
          setPhone(phone);
        }}
      />
      <Form form={form} layout="vertical">
        <Typography.Title level={3}>{t("reset password")}</Typography.Title>
        <Typography style={{ marginBottom: 20 }}>{t("description.please phone auth")}</Typography>
        <Form.Item>
          <Button //
            type="primary"
            onClick={() => setVisibleAuthModal(true)}
          >
            {t("auth phone")}
          </Button>
        </Form.Item>
        {phone && token && (
          <>
            <Form.Item //
              name="login_id"
              label={t("id")}
              rules={requiredRules}
            >
              <Input />
            </Form.Item>
            <Form.Item //
              name="password"
              label={t("password")}
              rules={requiredRules}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item //
              name="confirmPassword"
              label={t("confirm password")}
              rules={[
                ...requiredRules,
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(new Error(t("message.not match password")));
                    }
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button //
                block
                type="primary"
                loading={resetPasswordQuery.isLoading}
                onClick={handleReset}
              >
                {t("reset password")}
              </Button>
            </Form.Item>
          </>
        )}
        <Divider />
        <Form.Item style={{ float: "right" }}>
          <Link to="/login">{t("login")}</Link>
          <Divider type="vertical" />
          <Link to="/find-id">{t("find id")}</Link>
        </Form.Item>
      </Form>
    </>
  );
}

export default ResetPasswordForm;

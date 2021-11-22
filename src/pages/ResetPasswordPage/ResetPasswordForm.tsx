import { useState } from "react";
import { Link } from "react-router-dom";
// async
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { authAPI } from "apis";
// antd
import { Form, Button, Divider, Typography, message, Input } from "antd";
// lang
import { useTranslation } from "react-i18next";
// components
import PhoneAuthModal from "components/PhoneAuthModal";

const ResetPasswordForm = function () {
  const { t } = useTranslation();

  const [visiblePhoneAuthModal, setVisiblePhoneAuthModal] = useState(false);
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");

  // 상태 초기화
  const resetState = () => {
    form.resetFields();
    setPhone("");
    setToken("");
  };

  // 비밀번호 재설정 요청
  const resetPasswordQuery = useMutation(
    ["resetPassword"],
    () => {
      const id = form.getFieldValue("id");
      const password = form.getFieldValue("password");
      return authAPI.resetPassword({ id, phone, password, token });
    },
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: () => {
        resetState();
        message.success(`${t("message.success reset password")}.`);
      },
    }
  );

  // 인증 모달 열기
  const openAuthModal = () => {
    setVisiblePhoneAuthModal(true);
  };

  // 인증 모달 닫기
  const closeAuthModal = () => {
    setVisiblePhoneAuthModal(false);
  };

  // 인증 성공 콜백
  const onAuthSuccess = (data: { phone: string; token: string }) => {
    const { token, phone } = data;
    setToken(token);
    setPhone(phone);
  };

  // 비밀번호 재설정
  const handleReset = () => {
    const id = form.getFieldValue("id");
    const password = form.getFieldValue("password");
    const confirmPassword = form.getFieldValue("confirmPassword");

    if (id && password && password === confirmPassword) {
      resetPasswordQuery.mutate();
    }
  };

  return (
    <>
      <PhoneAuthModal
        visible={visiblePhoneAuthModal}
        onClose={closeAuthModal}
        onSuccess={onAuthSuccess}
      />
      <Form form={form} layout="vertical">
        <Typography.Title level={3}>{t("reset password")}</Typography.Title>
        <Typography style={{ marginBottom: 20 }}>
          {`${t("description.please phone auth")}.`}
        </Typography>
        <Form.Item>
          <Button type="primary" onClick={openAuthModal}>
            {t("auth phone")}
          </Button>
        </Form.Item>
        {phone && token && (
          <>
            <Form.Item name="id" label={t("id")}>
              <Input />
            </Form.Item>
            <Form.Item name="password" label={t("password")}>
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label={t("confirm password")}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error(t("message.not match password"))
                      );
                    }
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button block type="primary" onClick={handleReset}>
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
};

export default ResetPasswordForm;

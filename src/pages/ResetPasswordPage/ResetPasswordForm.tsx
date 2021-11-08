import { useState } from "react";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { authAPI } from "apis";
import { Form, Button, Divider, Typography, message, Input } from "antd";
import { AUTH_PHONE_DESCRIPTION } from "constant/description";
import {
  RESET_PASSWORD_SUCCESS_MESSAGE,
  NOT_MATCH_PASSWORD_MESSAGE,
} from "constant/message";
import {
  ID,
  FIND_ID,
  PASSWORD,
  CONFIRM_PASSWORD,
  RESET_PASSWORD,
  AUTH_PHONE,
  LOGIN,
} from "constant/string";
import PhoneAuthModal from "components/PhoneAuthModal";

const ResetPasswordForm = function () {
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
        message.success(RESET_PASSWORD_SUCCESS_MESSAGE);
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
        <Typography.Title level={3}>{RESET_PASSWORD}</Typography.Title>
        <Typography style={{ marginBottom: 20 }}>
          {AUTH_PHONE_DESCRIPTION}
        </Typography>
        <Form.Item>
          <Button type="primary" onClick={openAuthModal}>
            {AUTH_PHONE}
          </Button>
        </Form.Item>
        {phone && token && (
          <>
            <Form.Item name="id" label={ID}>
              <Input />
            </Form.Item>
            <Form.Item name="password" label={PASSWORD}>
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              label={CONFIRM_PASSWORD}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject(
                        new Error(NOT_MATCH_PASSWORD_MESSAGE)
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
                {RESET_PASSWORD}
              </Button>
            </Form.Item>
          </>
        )}
        <Divider />
        <Form.Item style={{ float: "right" }}>
          <Link to="/login">{LOGIN}</Link>
          <Divider type="vertical" />
          <Link to="/find-id">{FIND_ID}</Link>
        </Form.Item>
      </Form>
    </>
  );
};

export default ResetPasswordForm;

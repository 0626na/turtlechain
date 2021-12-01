import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TOKEN } from "constant";
// custom hooks
import useLogin from "hooks/useLogin";
// async
import { useMutation } from "react-query";
import { authAPI } from "apis";
// antd
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Divider,
  Typography,
  message,
} from "antd";

const LoginForm = function () {
  const { t } = useTranslation();
  const { login } = useLogin();
  const [form] = Form.useForm();

  const requiredRules = [
    { required: true, message: t("description.required item") },
  ];

  // 로그인 요청
  const loginQuery = useMutation(["login"], authAPI.login, {
    onError: () => {
      const errorMsg = t("message.error login");
      message.error(errorMsg);
    },
    onSuccess: (data) => {
      const { token } = data;
      const { autoLogin } = form.getFieldsValue();
      if (autoLogin) localStorage.setItem(TOKEN, token);
      login(token);
    },
  });

  // 로그인
  const onSubmit = (values: { login_id: string; password: string }) => {
    const { login_id, password } = values;
    loginQuery.mutate({ login_id, password });
  };

  return (
    <Form form={form} onFinish={onSubmit}>
      <LogoImage
        src={`${process.env.PUBLIC_URL}/assets/img/logo_v.png`}
        alt="logo"
      />
      <Form.Item //
        name="login_id"
        rules={requiredRules}
      >
        <Input //
          placeholder={t("id")}
          prefix={<UserOutlined />}
        />
      </Form.Item>
      <Form.Item //
        name="password"
        rules={requiredRules}
      >
        <Input.Password //
          placeholder={t("password")}
          prefix={<LockOutlined />}
        />
      </Form.Item>
      <FormItemContainer>
        <Form.Item //
          name="autoLogin"
          valuePropName="checked"
        >
          <Checkbox>{t("auto login")}</Checkbox>
        </Form.Item>
        <Form.Item>
          <Link to="/find-id">{t("find id")}</Link>
          <Divider type="vertical" />
          <Link to="/reset-password">{t("reset password")}</Link>
        </Form.Item>
      </FormItemContainer>
      <Form.Item>
        <Button
          block
          type="primary"
          htmlType="submit"
          loading={loginQuery.isLoading}
        >
          {t("login")}
        </Button>
      </Form.Item>
      <Divider />
      <BottomContainer>
        <Typography>
          {t("description.not member")} <Link to="/signup">{t("signup")}</Link>
        </Typography>
        <Typography>
          {t("description.about membership")}{" "}
          <Link to="#">{t("about membership")}</Link>
        </Typography>
      </BottomContainer>
    </Form>
  );
};

const LogoImage = styled.img`
  display: block;
  margin: 0 auto;
  margin-bottom: 40px;
`;

const FormItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BottomContainer = styled.div`
  text-align: center;
`;

export default LoginForm;

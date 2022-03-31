import { t } from "i18next";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { TOKEN } from "constant";
// custom hooks
import useLogin from "hooks/useLogin";
// async
import { useMutation } from "react-query";
import { authAPI } from "apis";
// antd
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Button, Checkbox, Divider, Typography, message, Space } from "antd";

function LoginForm() {
  const login = useLogin();
  const [form] = Form.useForm();

  const requiredRules = [{ required: false }];

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
    if (!(login_id && password)) {
      message.warn(t("message.insert id password"));
      return;
    }
    loginQuery.mutate({ login_id, password });
  };

  return (
    <Form form={form} onFinish={onSubmit}>
      <LogoImage src={`${process.env.PUBLIC_URL}/assets/img/new_logo_login.png`} alt="logo" />
      <Form.Item //
        name="login_id"
        rules={requiredRules}
        style={{ marginBottom: "12px" }}
      >
        <Input //
          placeholder={t("id")}
          prefix={<UserOutlined />}
          style={{ height: "44px" }}
        />
      </Form.Item>
      <Form.Item //
        name="password"
        rules={requiredRules}
      >
        <Input.Password //
          placeholder={t("password")}
          prefix={<LockOutlined />}
          style={{ height: "44px" }}
        />
      </Form.Item>
      <Space>
        <Form.Item //
          name="autoLogin"
          valuePropName="checked"
        >
          <Checkbox>{t("auto login")}</Checkbox>
        </Form.Item>
        <Form.Item>
          <GreyLink to="/find-id">{t("find id")}</GreyLink>
          <Divider type="vertical" />
          <GreyLink to="/reset-password">{t("reset password")}</GreyLink>
        </Form.Item>
      </Space>
      <Form.Item>
        <Button
          block
          type="primary"
          htmlType="submit"
          loading={loginQuery.isLoading}
          size="large"
          style={{
            background: "linear-gradient(92.01deg, #02ACB7 0%, #00AE99 100%)",
            border: "none",
            borderRadius: "4px",
            height: "46px",
          }}
        >
          {t("login")}
        </Button>
      </Form.Item>
      <Divider />
      <BottomContainer>
        <GreyTypography>
          {t("description.not member")}{" "}
          <Link to="/signup">
            <u>{t("signup")}</u>
          </Link>
        </GreyTypography>
        <GreyTypography>
          {t("description.about membership")}{" "}
          <Link to="#">
            <u>{t("about membership")}</u>
          </Link>
        </GreyTypography>
      </BottomContainer>
    </Form>
  );
}

const LogoImage = styled.img`
  height: 20px;
  display: block;
  margin: 0 auto;
  margin-bottom: 60px;
`;

const BottomContainer = styled.div`
  text-align: center;
`;

const GreyLink = styled(Link)`
  color: #7c7d82;
`;

const GreyTypography = styled(Typography)`
  color: #434852;
`;

export default LoginForm;

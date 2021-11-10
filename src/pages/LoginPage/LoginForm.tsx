import { useSetRecoilState } from "recoil";
import { tokenState } from "store/tokenState";
import styled from "styled-components";
import logo from "images/logo.png";
import { Link } from "react-router-dom";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { authAPI } from "apis";
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
import {
  NOT_MEMBER_DESCRIPTION,
  FIND_MEMBERSHIP_DESCRIPTION,
} from "constant/description";
import {
  ID,
  PASSWORD,
  AUTO_LOGIN,
  FIND_ID,
  RESET_PASSWORD,
  LOGIN,
  SIGN_UP,
  FIND_MEMBERSHIP,
  TOKEN_NAME,
} from "constant/string";

const LoginForm = function () {
  const setToken = useSetRecoilState(tokenState);
  const [form] = Form.useForm();

  // 로그인 요청
  const loginQuery = useMutation(
    ["login"],
    () => {
      const data = {
        login_id: form.getFieldValue("login_id"),
        password: form.getFieldValue("password"),
      };
      return authAPI.login(data);
    },
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        const { token } = data;
        const { autoLogin } = form.getFieldsValue();
        if (autoLogin) localStorage.setItem(TOKEN_NAME, token);
        setToken(token);
      },
    }
  );

  // 로그인
  const onSubmit = (values: any) => {
    const { login_id, password } = values;
    if (login_id && password) {
      loginQuery.mutate();
    }
  };

  return (
    <Form form={form} onFinish={onSubmit}>
      <LogoImage src={logo} alt="Logo" />
      <Form.Item name="login_id">
        <Input placeholder={ID} prefix={<UserOutlined />} />
      </Form.Item>
      <Form.Item name="password">
        <Input.Password placeholder={PASSWORD} prefix={<LockOutlined />} />
      </Form.Item>
      <FormItemContainer>
        <Form.Item name="autoLogin" valuePropName="checked">
          <Checkbox>{AUTO_LOGIN}</Checkbox>
        </Form.Item>
        <Form.Item>
          <Link to="/find-id">{FIND_ID}</Link>
          <Divider type="vertical" />
          <Link to="/reset-password">{RESET_PASSWORD}</Link>
        </Form.Item>
      </FormItemContainer>
      <Form.Item>
        <Button
          block
          type="primary"
          htmlType="submit"
          loading={loginQuery.isLoading}
        >
          {LOGIN}
        </Button>
      </Form.Item>
      <Divider />
      <BottomContainer>
        <Typography>
          {NOT_MEMBER_DESCRIPTION} <Link to="/signup">{SIGN_UP}</Link>
        </Typography>
        <Typography>
          {FIND_MEMBERSHIP_DESCRIPTION} <Link to="#">{FIND_MEMBERSHIP}</Link>
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

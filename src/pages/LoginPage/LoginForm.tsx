import styled from "styled-components";
import logo from "images/logo.png";
import { Link } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Button, Checkbox, Divider, Typography } from "antd";
import { LOGIN_PAGE } from "constant/description";
import {
  ID,
  PASSWORD,
  AUTO_LOGIN,
  FIND_ID,
  RESET_PASSWORD,
  LOGIN,
  SIGN_UP,
  FIND_MEMBERSHIP,
} from "constant/string";

const LoginForm = function () {
  return (
    <Form style={{ width: 400 }}>
      <LogoImage //
        src={logo}
        alt="Logo"
      />
      <Form.Item>
        <Input //
          size="large"
          placeholder={ID}
          prefix={<UserOutlined />}
        />
      </Form.Item>
      <Form.Item>
        <Input.Password //
          size="large"
          placeholder={PASSWORD}
          prefix={<LockOutlined />}
        />
      </Form.Item>
      <Form.Item>
        <Checkbox>{AUTO_LOGIN}</Checkbox>
        <LinkContainer float="right">
          <Link to="/find-id">{FIND_ID}</Link>
          <Divider type="vertical" />
          <Link to="/reset-password">{RESET_PASSWORD}</Link>
        </LinkContainer>
      </Form.Item>
      <Form.Item>
        <Button //
          block
          size="large"
          type="primary"
        >
          {LOGIN}
        </Button>
      </Form.Item>
      <Divider />
      <LinkContainer>
        <Typography>
          {LOGIN_PAGE.NOT_MEMBER_DESCRIPTION}{" "}
          <Link to="/signup">{SIGN_UP}</Link>
        </Typography>
        <Typography>
          {LOGIN_PAGE.FIND_MEMBERSHIP_DESCRIPTION}{" "}
          <Link to="#">{FIND_MEMBERSHIP}</Link>
        </Typography>
      </LinkContainer>
    </Form>
  );
};

const LogoImage = styled.img`
  display: block;
  margin: 0 auto;
  margin-bottom: 40px;
`;

const LinkContainer = styled.div<{ float?: string }>`
  float: ${(props) => props.float};
  text-align: center;
`;

export default LoginForm;

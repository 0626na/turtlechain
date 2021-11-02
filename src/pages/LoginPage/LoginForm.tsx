import styled from "styled-components";
import logo from "images/logo.png";
import { Link } from "react-router-dom";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Form, Input, Button, Checkbox, Divider, Typography } from "antd";

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
          placeholder="아이디"
          prefix={<UserOutlined />}
        />
      </Form.Item>
      <Form.Item>
        <Input.Password //
          size="large"
          placeholder="비밀번호"
          prefix={<LockOutlined />}
        />
      </Form.Item>
      <Form.Item>
        <Checkbox>자동 로그인</Checkbox>
        <LinkContainer float="right">
          <Link to="/find-id">아이디 찾기</Link>
          <Divider type="vertical" />
          <Link to="/reset-password">비밀번호 재설정</Link>
        </LinkContainer>
      </Form.Item>
      <Form.Item>
        <Button //
          block
          size="large"
          type="primary"
        >
          로그인
        </Button>
      </Form.Item>
      <Divider />
      <LinkContainer>
        <Typography>
          아직 회원이 아니신가요? <Link to="/signup">가입 신청하기</Link>
        </Typography>
        <Typography>
          다양한 요금제가 궁금하신가요? <Link to="#">멤버쉽 알아보기</Link>
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

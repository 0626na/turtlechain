import { t } from 'i18next';
import { Link } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Divider,
  Typography,
  Space,
  Row,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useLogin } from '@hooks/index';
import { css } from '@emotion/react';
import { TurtleText } from '@components/element';
import { theme } from '@styles/theme';

function LoginForm() {
  const [form] = Form.useForm();
  const { loginRequest, errorMsg } = useLogin();

  return (
    <Form
      form={form}
      onFinish={({ login_id, password, autoLogin }) => {
        loginRequest(login_id, password, autoLogin);
      }}
    >
      {/* 서비스 로고 */}
      <img
        css={logoImage}
        src={`${process.env.PUBLIC_URL}/assets/img/logo_login.png`}
        alt="logo"
      />
      {/* 아이디 */}
      <Form.Item
        name="login_id"
        rules={[{ required: false }]}
        style={{ marginBottom: '12px' }}
      >
        <Input
          css={input}
          placeholder={t('placeholder.id')}
          prefix={<UserOutlined />}
        />
      </Form.Item>
      {/* 패스워드 */}
      <Form.Item name="password" rules={[{ required: false }]}>
        <Input.Password
          css={input}
          placeholder={t('placeholder.password')}
          prefix={<LockOutlined />}
        />
      </Form.Item>
      <Space>
        {/* 자동로그인 체크 */}
        <Form.Item name="autoLogin" valuePropName="checked">
          <Checkbox>{t('description.autoLogin')}</Checkbox>
        </Form.Item>
        {/* 아이디 찾기/비밀번호 재설정 */}
        <Form.Item>
          <Link style={{ color: '#7C7D82' }} to="/find-id">
            {t('description.findId')}
          </Link>
          <Divider type="vertical" />
          <Link style={{ color: '#7C7D82' }} to="/reset-password">
            {t('description.resetPassword')}
          </Link>
        </Form.Item>
      </Space>
      {/* 에러 메세지 */}
      {errorMsg && (
        <Row justify="center" style={{ marginBottom: 24 }}>
          <Typography.Text type="danger">
            <InfoCircleOutlined />
            &nbsp;{errorMsg}
          </Typography.Text>
        </Row>
      )}
      {/* 로그인 버튼 */}
      <Form.Item>
        <Button
          css={loginbButton}
          block
          type="primary"
          htmlType="submit"
          size="large"
        >
          {t('description.login')}
        </Button>
      </Form.Item>
      <Divider />
      {/* 서비스 가입 및 요금플랜 */}
      <Row justify="center">
        <Typography.Text type="secondary">
          {t('description.notMember')}{' '}
        </Typography.Text>
        <Link to="/registration" style={{ color: theme.bluegreen }}>
          &nbsp;&nbsp;{t('description.registration')}
        </Link>
      </Row>
      <Row>
        <Typography.Text type="secondary">
          {t('description.wonderMembership')}{' '}
        </Typography.Text>
        <Link to="/membership-info" style={{ color: theme.bluegreen }}>
          &nbsp;&nbsp;{t('description.aboutMembership')}
        </Link>
      </Row>
      {/* 카피라이트 */}
      <Row justify="center">
        <TurtleText
          css={css`
            color: #cbccd1;
            margin-top: 60px;
            font-weight: 400;
          `}
        >
          © Turtleship Inc.
        </TurtleText>
      </Row>
    </Form>
  );
}

const logoImage = css`
  height: 20px;
  display: block;
  margin: 0 auto;
  margin-bottom: 68px;
`;

const input = css`
  height: 44px;
  border-radius: 8px;
`;

const loginbButton = css`
  background: #242934;
  border-radius: 8px;
  height: 48px;

  &:hover {
    background: #242934;
  }
  &:focus {
    background: #242934;
  }
`;

export default LoginForm;

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
      <img
        css={logoImage}
        src={`${process.env.PUBLIC_URL}/assets/img/logo_login.png`}
        alt="logo"
      />
      <Form.Item
        name="login_id"
        rules={[{ required: false }]}
        style={{ marginBottom: '12px' }}
      >
        <Input
          css={input}
          placeholder={t('auth.id')}
          prefix={<UserOutlined />}
        />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: false }]}>
        <Input.Password
          css={input}
          placeholder={t('auth.password')}
          prefix={<LockOutlined />}
        />
      </Form.Item>
      <Space>
        <Form.Item name="autoLogin" valuePropName="checked">
          <Checkbox>{t('auth.autoLogin')}</Checkbox>
        </Form.Item>
        <Form.Item>
          <Link style={{ color: '#7C7D82' }} to="/find-id">
            {t('auth.findId')}
          </Link>
          <Divider type="vertical" />
          <Link style={{ color: '#7C7D82' }} to="/reset-password">
            {t('auth.resetPassword')}
          </Link>
        </Form.Item>
      </Space>
      {errorMsg && (
        <Row justify="center" style={{ marginBottom: 24 }}>
          <Typography.Text type="danger">
            <InfoCircleOutlined />
            &nbsp;{errorMsg}
          </Typography.Text>
        </Row>
      )}
      <Form.Item>
        <Button
          css={loginbButton}
          block
          type="primary"
          htmlType="submit"
          size="large"
        >
          {t('auth.login')}
        </Button>
      </Form.Item>
      <Divider />
      <Row justify="center">
        <Typography.Text type="secondary">
          {t('auth.notMember')}{' '}
        </Typography.Text>
        <Link to="/registration" style={{ color: '#00B594' }}>
          &nbsp;&nbsp;{t('auth.registration')}
        </Link>
      </Row>
      <Row>
        <Typography.Text type="secondary">
          {t('auth.wonderMembership')}{' '}
        </Typography.Text>
        <Link to="/membership-info" style={{ color: '#00B594' }}>
          &nbsp;&nbsp;{t('auth.aboutMembership')}
        </Link>
      </Row>
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

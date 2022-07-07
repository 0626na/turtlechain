import styled from 'styled-components';
import { t } from 'i18next';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { useMutation } from 'react-query';
import {
  UserOutlined,
  LockOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { useLogin } from '@hooks/index';
import authAPI, { RequestLogin } from '@apis/authAPI';
import { AxiosError } from 'axios';

function LoginForm() {
  const navigate = useNavigate();
  const { login, autoLogin } = useLogin();
  const [form] = Form.useForm();
  const [errorMsg, setErrorMsg] = useState('');

  // 로그인 요청
  const loginQuery = useMutation(
    ['login'],
    (variables: RequestLogin) => {
      if (!variables.login_id) {
        setErrorMsg(t('message.enter id'));
        return Promise.reject(t('message.enter id'));
      }
      if (!variables.password) {
        setErrorMsg(t('message.enter password'));
        return Promise.reject(t('message.enter password'));
      }

      return authAPI.login(variables);
    },
    {
      onError: (data: AxiosError) => {
        if (data.response?.status === 400) {
          setErrorMsg(`${t('message.incorrect user')}`);
          return;
        }

        if (data.response) {
          setErrorMsg(`${t('message.network error')}`);
          return;
        }
      },
      onSuccess: ({ token }) => {
        if (form.getFieldValue('autoLogin')) {
          autoLogin(token);
          navigate('/home');
          return;
        }
        login(token);
        navigate('/home');
      },
    },
  );

  return (
    <Form
      form={form}
      onFinish={({ login_id, password }) => {
        loginQuery.mutate({ login_id, password });
      }}
    >
      <LogoImage
        src={`${process.env.PUBLIC_URL}/assets/img/new_logo_login.png`}
        alt="logo"
      />
      <Form.Item
        name="login_id"
        rules={[{ required: false }]}
        style={{ marginBottom: '12px' }}
      >
        <Input
          placeholder={t('id')}
          prefix={<UserOutlined />}
          style={{ height: '44px' }}
        />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: false }]}>
        <Input.Password
          placeholder={t('password')}
          prefix={<LockOutlined />}
          style={{ height: '44px' }}
        />
      </Form.Item>
      <Space>
        <Form.Item name="autoLogin" valuePropName="checked">
          <Checkbox>{t('auto login')}</Checkbox>
        </Form.Item>
        <Form.Item>
          <Link style={{ color: '#7C7D82' }} to="/find-id">
            {t('find id')}
          </Link>
          <Divider type="vertical" />
          <Link style={{ color: '#7C7D82' }} to="/reset-password">
            {t('reset password')}
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
          block
          type="primary"
          htmlType="submit"
          size="large"
          style={{
            background: 'linear-gradient(92.01deg, #02ACB7 0%, #00AE99 100%)',
            border: 'none',
            borderRadius: '4px',
            height: '46px',
          }}
        >
          {t('login')}
        </Button>
      </Form.Item>
      <Divider />
      <Row justify="center">
        <Typography.Text type="secondary">
          {t('description.not member')}{' '}
        </Typography.Text>
        <Link to="/signup" style={{ color: '#00B594' }}>
          &nbsp;&nbsp;{t('signup')}
        </Link>
      </Row>
      <Row>
        <Typography.Text type="secondary">
          {t('description.about membership')}{' '}
        </Typography.Text>
        <Link to="/membership-info" style={{ color: '#00B594' }}>
          &nbsp;&nbsp;{t('about membership')}
        </Link>
      </Row>
    </Form>
  );
}

const LogoImage = styled.img`
  height: 20px;
  display: block;
  margin: 0 auto;
  margin-bottom: 60px;
`;

export default LoginForm;

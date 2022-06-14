import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from 'react-query';
import { Form, Button, Divider, Typography, List } from 'antd';
import { PhoneAuthModal } from '@components/combine';
import userAPI from '@apis/userAPI';

function FindIdForm() {
  const queryClient = useQueryClient();

  const [visibleAuthModal, setVisibleAuthModal] = useState(false);
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');

  // 아이디 리스트 요청
  const getIDQuery = useQuery(
    ['getID', phone, token],
    () => userAPI.getID({ phone, token }),
    {
      enabled: phone && token ? true : false,
    },
  );

  // 요청 데이터 초기화
  useEffect(() => {
    return () => {
      queryClient.removeQueries(['getID', phone, token]);
    };
  }, [queryClient, phone, token]);

  return (
    <>
      <PhoneAuthModal
        visible={visibleAuthModal}
        onClose={() => setVisibleAuthModal(false)}
        onSuccess={(data) => {
          const { phone, token } = data;
          setPhone(phone);
          setToken(token);
        }}
      />
      <Form layout="vertical">
        <Typography.Title level={3}>{t('find id')}</Typography.Title>
        <Typography style={{ marginBottom: 20 }}>
          {t('description.please phone auth')}
        </Typography>
        <Form.Item>
          <Button //
            type="primary"
            loading={getIDQuery.isFetching}
            onClick={() => setVisibleAuthModal(true)}
          >
            {t('auth phone')}
          </Button>
        </Form.Item>
        {getIDQuery.data && (
          <Form.Item>
            <List
              bordered
              style={{ maxHeight: 200, overflowY: 'scroll' }}
              size="small"
              dataSource={getIDQuery.data}
              renderItem={(item) => <List.Item>{item.user_id}</List.Item>}
            />
          </Form.Item>
        )}
        <Divider />
        <Form.Item style={{ float: 'right' }}>
          <Link to="/login">{t('login')}</Link>
          <Divider type="vertical" />
          <Link to="/reset-password">{t('reset password')}</Link>
        </Form.Item>
      </Form>
    </>
  );
}

export default FindIdForm;

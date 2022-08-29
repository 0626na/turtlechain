import styled from 'styled-components';
import { Avatar, Col, Dropdown, Menu, Row, Button as AntdButton } from 'antd';

import TurtleText from '@components/element/TurtleText';
import Notification from '@components/combine/Notification';
import useLogin from '@hooks/useLogin';
import { useQuery } from 'react-query';
import authAPI from '@apis/authAPI';
import { t } from 'i18next';

interface Props {
  title: string;
  Button?: React.ReactNode;
}

function PageHeader({ title, Button }: Props) {
  const { logout } = useLogin();

  const getUserQuery = useQuery('getUserQuery', authAPI.verify);

  return (
    <Container align="middle" justify="space-between">
      <LeftContnet>
        <TurtleText style={{ fontSize: 24, fontWeight: 700, color: '#242934' }}>
          {title}
        </TurtleText>
        {Button}
      </LeftContnet>

      <RightContent>
        <Notification />

        <Dropdown
          overlay={
            <Menu>
              <AntdButton type="text" onClick={logout}>
                {t('auth.logout')}
              </AntdButton>
            </Menu>
          }
          trigger={['click']}
        >
          <Avatar
            style={{ backgroundColor: 'orange', cursor: 'pointer' }}
            size={36}
          >
            {getUserQuery.data?.name.split('')[0]}
          </Avatar>
        </Dropdown>
      </RightContent>
    </Container>
  );
}

const Container = styled(Row)`
  height: 84px;
  padding: 24px 36px;
`;

const LeftContnet = styled(Col)`
  display: flex;
  align-items: center;
`;

const RightContent = styled(Col)`
  display: flex;
  align-items: center;
`;

export default PageHeader;

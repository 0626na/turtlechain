import styled from 'styled-components';
import { t } from 'i18next';
import { MenuOutlined, DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { Layout, Button, Avatar, Menu, Dropdown, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MAIN_HEADER_HEIGHT } from '@constant/index';
import { useLogin } from '@hooks/index';
import { UserOutlined } from '@ant-design/icons';
import { Notification } from '@components/combine';
import { useQuery } from 'react-query';
import authAPI from '@apis/authAPI';

interface Props {
  handleMenuVisible: () => void;
}

function Header({ handleMenuVisible }: Props) {
  const navigate = useNavigate();
  const { logout } = useLogin();

  const getUserQuery = useQuery('getUser', authAPI.verify);

  return (
    <StyledHeader>
      <Row gutter={8} justify="space-between" align="middle">
        <Col>
          <Button
            type="link"
            icon={<MenuOutlined style={{ color: '#FFFFFF' }} />}
            onClick={handleMenuVisible}
          />
          <StyledImage
            src={`${process.env.PUBLIC_URL}/assets/img/new_logo_main.png`}
            alt="logo"
            onClick={() => navigate('/home')}
          />
        </Col>
        <Col style={{ display: 'flex' }}>
          <Notification />
          <Avatar
            icon={<UserOutlined style={{ color: '#141720' }} />}
            style={{ background: '#AAE7DC', top: 6 }}
            size="small"
          />
          <Dropdown
            overlay={
              <Menu>
                <Button //
                  type="text"
                  onClick={logout}
                  icon={<LogoutOutlined />}
                >
                  {t('logout')}
                </Button>
              </Menu>
            }
            trigger={['click']}
          >
            <Button type="text" style={{ color: '#FFFFFF', paddingLeft: 7 }}>
              {`${getUserQuery.data?.name}님`}
              <DownOutlined />
            </Button>
          </Dropdown>
        </Col>
      </Row>
    </StyledHeader>
  );
}

const StyledHeader = styled(Layout.Header)`
  height: ${MAIN_HEADER_HEIGHT};
  position: fixed;
  z-index: 1;
  width: 100%;
  padding-left: 16px;
`;

const StyledImage = styled.img`
  height: 14px;
  margin: 8px;
  cursor: pointer;
`;

export default Header;

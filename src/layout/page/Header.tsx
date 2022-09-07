import React from 'react';
import { css } from '@emotion/react';
import { Avatar, Col, Dropdown, Menu, Row, Button } from 'antd';

import TurtleText from '@components/element/TurtleText';
import Notification from '@components/combine/Notification';
import useLogin from '@hooks/useLogin';
import { useQuery } from 'react-query';
import authAPI from '@apis/authAPI';
import { t } from 'i18next';

interface Props {
  title: string;
  button?: React.ReactNode;
}

function PageHeader({ title, button }: Props) {
  const { logout } = useLogin();

  const getUserQuery = useQuery('getUserQuery', authAPI.verify);

  return (
    <>
      <Row css={container} align="middle" justify="space-between">
        <Col css={leftContnetStyled}>
          <TurtleText css={textStyled}>{title}</TurtleText>
          {button}
        </Col>

        <Col css={rightContnetStyled}>
          <Notification />

          <Dropdown
            overlay={
              <Menu>
                <Button type="text" onClick={logout}>
                  {t('auth.logout')}
                </Button>
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
        </Col>
      </Row>
    </>
  );
}

const container = css`
  height: 84px;
  padding: 24px 36px;
`;

const leftContnetStyled = css`
  display: flex;
  align-items: center;
`;

const rightContnetStyled = css`
  display: flex;
  align-items: center;
`;

// const textStyled = css`
//   font-size: 24px;
//   font-weight: 700;
//   background-color: orange;
//   cursor: pointer;
// `;

const textStyled = css({
  fontSize: 24,
  fontWeight: 700,

  cursor: 'pointer',
});

export default PageHeader;

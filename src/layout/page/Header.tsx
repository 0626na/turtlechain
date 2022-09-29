import React from 'react';
import { css } from '@emotion/react';

import { Avatar, Col, Dropdown, Menu, Row, Button } from 'antd';
import { t } from 'i18next';
import { ArrowLeftOutlined } from '@ant-design/icons';
import TurtleText from '@components/element/TurtleText';
import Notification from '@components/combine/Notification';
import useLogin from '@hooks/useLogin';
import useUser from '@hooks/useUser';

interface Props {
  title: string;
  button?: React.ReactNode;
  onClickBefore?: () => void;
}

function PageHeader({ title, button, onClickBefore }: Props) {
  const { logout } = useLogin();
  const { user } = useUser();

  return (
    <>
      <Row css={container} align="middle" justify="space-between">
        <Col css={leftContnetStyled}>
          {onClickBefore && (
            <div css={iconContainer} onClick={onClickBefore}>
              <ArrowLeftOutlined css={icon} />
            </div>
          )}
          <TurtleText css={textStyled}>{title}</TurtleText>
          {button}
        </Col>

        <Col css={rightContnetStyled}>
          <Notification />

          <Dropdown
            overlay={
              <Menu
                items={[
                  {
                    key: 1,
                    label: (
                      <Button type="text" onClick={logout}>
                        {t('auth.logout')}
                      </Button>
                    ),
                  },
                ]}
              />
            }
            trigger={['click']}
          >
            <Avatar
              style={{ backgroundColor: 'orange', cursor: 'pointer' }}
              size={36}
            >
              <span css={name}>{user.name.split('')[0]}</span>
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

const textStyled = css`
  font-size: 24px;
  font-weight: 700;
  color: #242934;
`;

const iconContainer = css`
  background-color: #edeff1;
  border-radius: 6px;
  margin-right: 8px;

  cursor: pointer;
`;

const icon = css`
  font-size: 24px;
  margin: 6px;
`;

const name = css`
  font-size: 16px;
`;

export default PageHeader;

import React from 'react';
import { css } from '@emotion/react';
import { Avatar, Col, Dropdown, Menu, Row, Button } from 'antd';
import { t } from 'i18next';
import TurtleText from '@components/element/TurtleText';
import Notification from '@components/combine/Notification';
import useLogin from '@hooks/useLogin';
import useUser from '@hooks/useUser';
import { TurtleIcon } from '@components/element';
import { CSSProperties } from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface Props {
  title: string;
  button?: React.ReactNode;
  onClickBefore?: () => void;
}

function PageHeader({ title, button, onClickBefore }: Props) {
  const { logout } = useLogin();
  const { user } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <Row css={container} align="middle" justify="space-between">
        <Col css={leftContnetStyled}>
          {onClickBefore && (
            <div css={iconContainer} onClick={onClickBefore}>
              <TurtleIcon name="arrowBack" />
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
                css={css({
                  width: 160,
                  height: 92,
                  boxShadow: `0px 4px 18px rgba(34,44,56,0.28)`,
                  borderRadius: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                })}
                items={[
                  {
                    theme: 'dark',
                    key: 0,
                    label: t('button.account management'),
                    icon: (
                      <div css={dropDownIcon}>
                        <TurtleIcon name="accountManagement" />
                      </div>
                    ),
                    style: dropDownMenuItem as CSSProperties,
                    onClick: () => navigate('/setting?tab=user'),
                  },
                  {
                    key: 1,
                    label: (
                      <div onClick={logout}>{t('description.logout')}</div>
                    ),
                    icon: (
                      <div css={dropDownIcon}>
                        <TurtleIcon name="logout" />
                      </div>
                    ),
                    style: dropDownMenuItem as CSSProperties,
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
              <span css={name}>{user?.name.split('')[0]}</span>
            </Avatar>
          </Dropdown>
        </Col>
      </Row>
    </>
  );
}

const container = css`
  height: 84px;
  padding: 24px;
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

const name = css`
  font-size: 16px;
`;

const dropDownMenuItem = {
  width: 148,
  height: 34,
  padding: 6,
  boxSizing: 'border-box',
  borderRadius: 6,
};

const dropDownIcon = css({
  display: 'flex',
  alignItems: 'center',
  marginRight: 8,
});

export default PageHeader;

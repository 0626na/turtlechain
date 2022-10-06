import { UserInfo } from '@apis/authAPI';
import userAPI from '@apis/userAPI';
import { AnswerButton, TurtleFormInput, TurtleIcon } from '@components/element';
import { css } from '@emotion/react';

import useUser from '@hooks/useUser';
import { phonePattern, removeHyphen } from '@utils/pattern';
import { Button, Col, Form, message, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { t } from 'i18next';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import UserCard from '../card/UserCard';

function UserTab() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { user } = useUser();
  const [form] = useForm();

  const [buttonsVisible, setButtonsVisible] = useState(false);

  const showButtons = () => {
    setButtonsVisible(true);
  };

  const hideButtons = () => {
    setButtonsVisible(false);
  };

  const updateMutation = useMutation(userAPI.update, {
    onSuccess: () => {
      message.success(t('message.success update'));
      queryClient.refetchQueries(['getUser'], { active: true });
      hideButtons();
    },
  });

  const resetStates = useCallback(
    (user: UserInfo) => {
      form.setFieldsValue({
        name: user.name,
        login_id: user.login_id,
        email: user.email,
        mobile_phone: user.mobile_phone.replace(phonePattern, `$1-$2-$3`),
      });
    },
    [form],
  );

  useEffect(() => {
    if (searchParams.get('tab') === 'user') {
      resetStates(user);
      return;
    }

    hideButtons();
  }, [resetStates, searchParams, user]);

  return (
    <>
      <UserCard title="기본정보" icon={<TurtleIcon name="user" />}>
        <Form
          form={form}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          onValuesChange={() => {
            showButtons();
          }}
          onFinish={({ email, mobile_phone }) => {
            updateMutation.mutate({
              user_id: user.id,
              email,
              mobile_phone: mobile_phone.replace(removeHyphen, ''),
            });
          }}
        >
          <Form.Item label="이름" name="name">
            <TurtleFormInput disabled />
          </Form.Item>
          <Form.Item label="아이디" name="login_id">
            <TurtleFormInput disabled />
          </Form.Item>
          <Form.Item label="이메일" name="email">
            <TurtleFormInput />
          </Form.Item>
          <Form.Item label="휴대전화 번호" name="mobile_phone">
            <TurtleFormInput />
          </Form.Item>

          {buttonsVisible && (
            <Row
              css={css`
                margin-top: 32px;
                margin-bottom: 8px;
              `}
              justify="end"
              align="middle"
            >
              <Col>
                <AnswerButton
                  type="NO"
                  text="취소 "
                  onClick={() => {
                    // 취소를 누르면 최초 값으로 초기화.
                    resetStates(user);
                    hideButtons();
                  }}
                />
              </Col>
              <Col css={marginleft}>
                <AnswerButton type="YES" text="저장" htmlType="submit" />
              </Col>
            </Row>
          )}
        </Form>
        {/*  */}
      </UserCard>
      <div css={marginTop}>
        <UserCard title="맴버십 정보" icon={<TurtleIcon name="user" />}>
          <Form colon={false} labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
            <Form.Item label="결제">
              <Button
                css={button}
                onClick={() => {
                  message.warning('준비중입니다.');
                }}
              >
                결제하기
              </Button>
            </Form.Item>
          </Form>
        </UserCard>
      </div>
    </>
  );
}

const button = css`
  width: 140px;
  height: 36px;

  font-weight: 700;
  border: none;
  border-radius: 8px;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;

  background-color: #00b3be;

  &:hover {
    color: #fff;
    background-color: #00b3be;
  }

  // active 상태
  &.ant-btn:focus {
    color: #fff;

    background-color: #00b3be;
    border-color: #00b3be;
  }
`;

const marginTop = css`
  margin-top: 24px;
`;

const marginleft = css`
  margin-left: 8px;
`;

export default UserTab;

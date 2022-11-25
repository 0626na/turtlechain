import { UserInfo } from '@apis/authAPI';
import paypleAPI from '@apis/paypleAPI';
import userAPI from '@apis/userAPI';
import { AnswerButton, TurtleFormInput, TurtleIcon } from '@components/element';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';

import useUser from '@hooks/useUser';
import { theme } from '@styles/theme';
import { message } from '@utils/message';
import { emailPattern, phonePattern, removeHyphen } from '@utils/pattern';
import { Button, Col, Form, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { t } from 'i18next';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import UserCard from '../cards/UserCard';
import PaypleModal from '../modals/PayPleModal';

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

  const changeCreditCardInfoMutation = useMutation(paypleAPI.authenticate, {
    onSuccess: () => message.success('카드 정보가 변경되었습니다.', 3),
  });
  /**
   * 유저의 구독여부 찾기
   */
  const getSubscriptionCheckQuery = useQuery('getSubscriptionCheckQuery', () =>
    userAPI.getSubscriptionCheck({ company_id: Number(user?.company_id) }),
  );

  const subscriptionData =
    getSubscriptionCheckQuery.data?.data.subscription_info;

  const isSubscription = getSubscriptionCheckQuery.data?.data.is_subscribed;
  const nextPaymentDate = moment(subscriptionData?.end_date)
    .add(1, 'days')
    .format('YYYY년 MM월 DD일');

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

  //이메일 유효성 검사
  const emailValidator = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error('이메일을 입력해주세요.'));
    }

    if (!emailPattern.test(value)) {
      return Promise.reject(new Error('유효하지 않은 이메일 입니다.'));
    }

    return Promise.resolve();
  };

  //휴대전화 번호 유효성 검사
  const mobileValidator = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error('휴대전화 번호를 입력해주세요.'));
    }

    if (!phonePattern.test(value)) {
      return Promise.reject(new Error('유효하지 않은 형식 입니다.'));
    }

    return Promise.resolve();
  };

  useEffect(() => {
    if (searchParams.get('tab') === 'user') {
      resetStates(user as UserInfo);
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
              user_id: user?.id,
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
          <Form.Item
            label="이메일"
            name="email"
            rules={[{ validator: emailValidator }]}
          >
            <TurtleFormInput placeholder="이메일을 입력해주세요" />
          </Form.Item>
          <Form.Item
            label="휴대전화 번호"
            name="mobile_phone"
            rules={[{ validator: mobileValidator }]}
          >
            <TurtleFormInput placeholder="휴대전화 번호를 입력해주세요" />
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
                    resetStates(user as UserInfo);
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
        {!isSubscription ? (
          <UserCard
            title="요금플랜 결제"
            icon={<TurtleIcon name="membership" />}
          >
            <Form
              colon={false}
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
            >
              <Form.Item
                label={
                  <span
                    css={{
                      color: theme.grey800,
                      fontWeight: 500,
                      fontSize: 15,
                    }}
                  >
                    요금플랜 결제
                  </span>
                }
              >
                <Button css={button} onClick={() => {}}>
                  결제하기
                </Button>
              </Form.Item>
            </Form>
          </UserCard>
        ) : (
          <UserCard
            title="구독 및 결제"
            icon={<TurtleIcon name="membership" />}
          >
            <Form
              colon={false}
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
            >
              <Form.Item
                label={
                  <span
                    css={{
                      color: theme.grey800,
                      fontWeight: 500,
                      fontSize: 15,
                    }}
                  >
                    유료플랜 구독
                  </span>
                }
              >
                <div
                  css={css({
                    borderBottom: `1px solid ${theme.grey200}`,
                    paddingBottom: 20,
                  })}
                >
                  <Button
                    css={button}
                    onClick={() =>
                      changeCreditCardInfoMutation.mutate({
                        company_id: Number(user?.company_id),
                        request_type: 'AUTH',
                      })
                    }
                  >
                    결제수단 변경
                  </Button>
                  <Button css={css({ color: theme.grey500 })}>해지하기</Button>
                </div>
                <div
                  css={css({
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 500,
                    paddingTop: 10,
                  })}
                >
                  <TurtleIcon name="creditCard" />{' '}
                  <span
                    css={css({ marginLeft: 5 })}
                  >{`신용카드(${subscriptionData?.pay_name}) ${subscriptionData?.pay_number}`}</span>
                </div>
                <div css={css({ marginTop: 10 })}>
                  <span>{`다음 결제일은 ${nextPaymentDate} 입니다.`}</span>
                </div>
              </Form.Item>
            </Form>
          </UserCard>
        )}
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

  &.ant-btn:focus {
    color: #fff;
    background-color: #00b3be;
    border-color: #00b3be;
  }
`;

const cancelButton = css``;

const marginTop = css`
  margin-top: 24px;
`;

const marginleft = css`
  margin-left: 8px;
`;

export default UserTab;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import UserCard from '../cards/UserCard';
import RemoveSubscriptionModal from '../modals/RemoveSubscriptionModal';
import { RequestConnectInventory } from '@apis/productAPI';
import { SubscriptionInfo } from '@apis/userAPI';

function UserTab() {
  const [searchParams] = useSearchParams();
  const [
    removeSubscriptionModalvisible,
    removeSubscriptionModalOpen,
    removeSubscriptionModalClose,
  ] = useModal();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useUser();
  const [form] = useForm();

  /**
   * 구독하는 쇼핑몰 사업자 ID
   */
  const companyID = Number(user?.company_id);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [isNewSubscription, setIsNewSubscription] = useState<boolean>();
  const [serviceCost, setServiceCost] = useState(0);
  const [currentSubscriptionStatus, setCurrentSubscriptionStatus] =
    useState(false);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionInfo>({
    id: -1,
    pay_name: '',
    pay_number: '',
    pay_type: '',
    payer_id: '',
    company_id: 0,
    start_date: '',
    end_date: '',
    is_subscribed: false,
  });

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

  const getSubscriptionCheckQuery = useQuery(
    'getSubscriptionCheckInUserTabQuery',
    () => userAPI.getSubscriptionCheck({ company_id: companyID }),
    {
      staleTime: 3000,
      onSuccess: (data) => {
        setIsNewSubscription(data.data.is_new);
        setCurrentSubscriptionStatus(data.data.is_expired);
        setServiceCost(data.data.service_cost);
        setSubscriptionData({
          ...data.data.subscription_info,
        });
      },
    },
  );

  const changeCreditCardInfoMutation = useMutation(paypleAPI.authenticate, {
    onSuccess: (data) => {
      const requestData = {
        PCD_PAY_TYPE: data.data.PCD_PAY_TYPE,
        PCD_PAY_WORK: data.data.PCD_PAY_WORK,
        PCD_CARD_VER: '01',
        PCD_PAYER_NO: data.data.PCD_PAYER_NO,
        PCD_PAYER_NAME: data.data.PCD_PAYER_NAME,

        PCD_PAY_GOODS: data.data.PCD_PAY_GOODS,
        PCD_PAY_TOTAL: data.data.PCD_PAY_TOTAL,
        PCD_PAY_ISTAX: data.data.PCD_PAY_ISTAX,

        PCD_PAY_URL: data.data.return_url,
        PCD_AUTH_KEY: data.data.AuthKey,

        PCD_RST_URL: `/setting?tab=user`,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callbackFunction: (res: any) => {
          // 성공일때 redirect
          if (res.PCD_PAY_RST !== 'success') return;

          setSubscriptionData({
            ...subscriptionData,
            pay_name: res.PCD_PAY_CARDNAME,
            pay_number: res.PCD_PAY_CARDNUM,
          });

          //구독신청 및 재구독시
          if (res.PCD_PAY_WORK === 'PAY')
            message.success(
              t('your subscription is complete. you can use the payment'),
              3,
            );
          //결제수단 변경시
          if (res.PCD_PAY_WORK === 'AUTH')
            message.success(t('card change is complete'), 3);

          navigate('/setting?tab=user');
          getSubscriptionCheckQuery.refetch();
        },
      };

      // payple 내장 함수 호출 (결제 요청)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).PaypleCpayAuthCheck(requestData);
    },
  });

  /**
   * 다음 결제일
   */
  const nextPaymentDate = moment(subscriptionData?.end_date)
    .add(1, 'days')
    .format('YYYY년 MM월 DD일');

  /**
   * 구독 유효기간
   */
  const expirationDate = moment(subscriptionData.end_date).format(
    'YYYY년 MM월 DD일',
  );

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
      return Promise.reject(new Error(t('please input email')));
    }

    if (!emailPattern.test(value)) {
      return Promise.reject(new Error(t('this email is not valid')));
    }

    return Promise.resolve();
  };

  //휴대전화 번호 유효성 검사
  const mobileValidator = (_: unknown, value: string) => {
    if (!value) {
      return Promise.reject(new Error(t('please input phone number')));
    }

    if (!phonePattern.test(value)) {
      return Promise.reject(new Error(t('invalid format')));
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

  // payple, jquery script 태그 동적 불러온다.
  useEffect(() => {
    const script = document.createElement('script');

    script.src =
      process.env.REACT_APP_SERVICE_TYPE === 'production'
        ? 'https://cpay.payple.kr/js/cpay.payple.1.0.1.js' // 상용 payple script (prod)
        : 'https://democpay.payple.kr/js/cpay.payple.1.0.1.js'; // 테스트 payple script (alpha)
    script.async = true;

    document.body.appendChild(script);
  }, []);

  return (
    <>
      <RemoveSubscriptionModal
        visible={removeSubscriptionModalvisible}
        onClose={removeSubscriptionModalClose}
        id={companyID}
      />

      <UserCard
        title={t('title.basic information')}
        icon={<TurtleIcon name="user" />}
      >
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
          <Form.Item label={t('table.user name')} name="name">
            <TurtleFormInput disabled />
          </Form.Item>
          <Form.Item label={t('table.id')} name="login_id">
            <TurtleFormInput disabled />
          </Form.Item>
          <Form.Item
            label={t('table.email')}
            name="email"
            rules={[{ validator: emailValidator }]}
          >
            <TurtleFormInput placeholder={t('placeholder.input email')} />
          </Form.Item>
          <Form.Item
            label={t('table.mobile')}
            name="mobile_phone"
            rules={[{ validator: mobileValidator }]}
          >
            <TurtleFormInput
              placeholder={t('placeholder.input mobile number')}
            />
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
                  text={t('button.cancel')}
                  onClick={() => {
                    // 취소를 누르면 최초 값으로 초기화.
                    resetStates(user as UserInfo);
                    hideButtons();
                  }}
                />
              </Col>
              <Col css={marginleft}>
                <AnswerButton
                  type="YES"
                  text={t('button.save')}
                  htmlType="submit"
                />
              </Col>
            </Row>
          )}
        </Form>
        {/*  */}
      </UserCard>
      <div css={marginTop}>
        {!subscriptionData.is_subscribed ? (
          //구독 안한 상태
          <UserCard
            title={t('subscription and payment')}
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
                    {t('table.paid plan subscription')}
                  </span>
                }
              >
                <div
                  css={css({
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: subscriptionData.is_subscribed
                      ? `1px solid ${theme.grey200}`
                      : '',
                    paddingBottom: 20,
                  })}
                >
                  <div css={css({ marginRight: 16 })}>
                    {!currentSubscriptionStatus ? (
                      <Button
                        css={button}
                        onClick={() =>
                          changeCreditCardInfoMutation.mutate({
                            company_id: companyID,
                            request_type: 'PAY',
                          })
                        }
                      >
                        {t('button.subscription')}
                      </Button>
                    ) : (
                      <div
                        css={css({
                          display: 'flex',
                          alignItems: 'center',
                        })}
                      >
                        <Button
                          css={button}
                          onClick={() =>
                            changeCreditCardInfoMutation.mutate({
                              company_id: companyID,
                              request_type: 'PAY',
                            })
                          }
                        >
                          {t('button.re-subscription')}
                        </Button>
                        <span
                          css={css({ marginLeft: 16, color: theme.grey500 })}
                        >
                          {t('unsubscription complete')}
                        </span>
                      </div>
                    )}
                  </div>
                  {/* 최초구독의 경우 */}
                  {isNewSubscription && (
                    <div
                      css={css({
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#FBF0E6',
                        color: theme.orangeTx,
                        borderRadius: 8,
                        width: 143,
                        height: 26,
                        padding: '6px 7px',
                      })}
                    >
                      <TurtleIcon name="thunder" />
                      <span>{t('the first months fee is 100won')}</span>
                    </div>
                  )}
                </div>
                {currentSubscriptionStatus && (
                  <div css={css({ paddingTop: 10, color: theme.grey500 })}>
                    <span>
                      {t(
                        'message.the service is available until expirationDate',
                        {
                          expirationDate,
                        },
                      )}
                    </span>
                  </div>
                )}
              </Form.Item>
            </Form>
          </UserCard>
        ) : (
          //구독한 상태
          <UserCard
            title={t('subscription and payment')}
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
                    {t('subscription paid plan')}
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
                        company_id: companyID,
                        request_type: 'AUTH',
                      })
                    }
                  >
                    {t('button.payment method change')}
                  </Button>
                  <Button
                    css={css({ color: theme.grey500 })}
                    onClick={removeSubscriptionModalOpen}
                  >
                    {t('subscription cancel')}
                  </Button>
                </div>
                <div
                  css={css({
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 500,
                    paddingTop: 10,
                  })}
                >
                  <TurtleIcon name="creditcard" />{' '}
                  <span css={css({ marginLeft: 5 })}>
                    {t('creditInfo', {
                      cardName: subscriptionData?.pay_name,
                      cardNumber: subscriptionData?.pay_number,
                    })}
                  </span>
                </div>
                <div
                  css={css({
                    marginTop: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                  })}
                >
                  <span>
                    {t('message.nextPaymentDate', { nextPaymentDate })}
                  </span>
                  <span>{`₩${serviceCost}`}</span>
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

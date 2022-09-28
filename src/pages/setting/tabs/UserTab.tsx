import retailerStoreAPI from '@apis/retailerStoreAPI';
import userAPI from '@apis/userAPI';
import { AnswerButton, TurtleFormInput, TurtleIcon } from '@components/element';
import { css } from '@emotion/react';

import useUser from '@hooks/useUser';
import { phonePattern } from '@utils/pattern';
import { Button, Form, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { t } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';

import Card from '../Card';

function UserTab() {
  const { user } = useUser();
  const [form] = useForm();

  const [buttonVisible, setButtonVisible] = useState(false);

  const updateMutation = useMutation(userAPI.update, {
    onSuccess: () => {
      message.success(t('message.success update'));
      // setIsUpdateMode(false);
      // getQuery.refetch();
    },
  });

  useEffect(() => {
    form.setFieldsValue({
      name: user.name,
      login_id: user.login_id,
      email: user.email,
      mobile_phone: user.mobile_phone.replace(phonePattern, `$1-$2-$3`),
    });
  }, []);

  return (
    <>
      <Card title="기본정보" icon={<TurtleIcon name="user" />}>
        <Form
          form={form}
          colon={false}
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
        >
          <Form.Item label="이름" name="name">
            <TurtleFormInput />
          </Form.Item>
          <Form.Item label="아이디" name="login_id">
            <TurtleFormInput />
          </Form.Item>
          <Form.Item label="이메일" name="email">
            <TurtleFormInput />
          </Form.Item>
          <Form.Item label="휴대전화 번호" name="mobile_phone">
            <TurtleFormInput />
          </Form.Item>

          <div
            css={css`
              display: flex;
              justify-content: flex-end;

              margin-top: 32px;
              margin-bottom: 8px;
            `}
          >
            <AnswerButton type="NO" text="취소 " />

            <div
              css={css`
                margin-left: 8px;
              `}
            >
              <AnswerButton type="YES" text="저장" />
            </div>
          </div>
        </Form>
      </Card>
      <div css={marginTop}>
        <Card title="맴버십 정보" icon={<TurtleIcon name="user" />}>
          <Form colon={false} labelCol={{ span: 7 }} wrapperCol={{ span: 17 }}>
            <Form.Item label="결제">
              <Button css={button}>결제하기</Button>
            </Form.Item>
          </Form>
        </Card>
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
  /* stroke: #00aab5; */
  background-color: #00b3be;

  &:hover {
    color: #fff;
    /* stroke: #00aab5; */
    background-color: #00b3be;
  }

  // active 상태
  &.ant-btn:focus {
    color: #fff;
    /* stroke: #00aab5; */
    background-color: #00b3be;
    border-color: #00b3be;
  }

  /* &.ant-btn[disabled] {
    color: #00aab5;
    stroke: #00aab5;
    background-color: #ddf3f5;
    opacity: 0.5;
  } */
`;

const marginTop = css`
  margin-top: 24px;
`;
export default UserTab;

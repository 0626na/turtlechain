import retailerStoreAPI from '@apis/retailerStoreAPI';
import { AnswerButton, TurtleFormInput, TurtleIcon } from '@components/element';
import { css } from '@emotion/react';
import useStore from '@hooks/useStore';
import { Button, Form } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import React, { useEffect } from 'react';
import { useQuery } from 'react-query';
import Card from '../Card';

function UserTab() {
  const { store, fillStoreList, selectDefaultStore } = useStore();
  const [form] = useForm();

  const getStoreListQuery = useQuery(
    ['getStoreListQuery'],
    retailerStoreAPI.getList,
    {
      enabled: !store.selected,
      onSuccess: (data) => {
        fillStoreList(data.store_list);
        selectDefaultStore(data.store_list);
      },
    },
  );

  useEffect(() => {
    console.log(store);
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
          <Form.Item label="이름">
            <TurtleFormInput />
          </Form.Item>
          <Form.Item label="아이디">
            <TurtleFormInput />
          </Form.Item>
          <Form.Item label="이메일">
            <TurtleFormInput />
          </Form.Item>
          <Form.Item label="휴대전화 번호">
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

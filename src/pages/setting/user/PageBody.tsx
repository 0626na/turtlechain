import { t } from "i18next";
import { Button, Card, Form, Input, message, Row, Typography } from "antd";
import { userAPI } from "apis";
import { AxiosError } from "axios";
import { TurtleButton, TurtleCardSetting } from "components/common";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { phonePattern } from "utils/pattern";
import styled from "styled-components";
import { PhoneAuthModal } from "components/combine";

function PageBody() {
  const [form] = Form.useForm();
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [phoneAuthModalVisible, setPhoneAuthModalVisible] = useState(false);

  const getQuery = useQuery("getUser", userAPI.get, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  const updateQuery = useMutation("updateUser", userAPI.update, {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
    onSuccess: (data) => {
      message.success(t("message.success update"));
      setIsUpdateMode(false);
      getQuery.refetch();
    },
  });

  return (
    <>
      <Row>
        <TurtleCardSetting
          title="기본 정보"
          extra={
            isUpdateMode ? (
              <Typography.Link
                type="secondary"
                onClick={() => {
                  setIsUpdateMode(false);
                }}
              >
                닫기
              </Typography.Link>
            ) : (
              <Typography.Link
                type="secondary"
                onClick={() => {
                  setIsUpdateMode(true);
                  form.setFieldsValue({
                    user_id: getQuery.data?.id,
                    email: getQuery.data?.email,
                    mobile_phone: getQuery.data?.mobile_phone,
                  });
                }}
              >
                수정하기
              </Typography.Link>
            )
          }
        >
          <Form
            layout="horizontal"
            form={form}
            colon={false}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 7 }}
            onFinish={(value) => {
              updateQuery.mutate(value);
            }}
          >
            <Form.Item name="user_id" hidden>
              <Input hidden />
            </Form.Item>
            <StyledFormItem label="이름">{getQuery.data?.name}</StyledFormItem>
            <StyledFormItem label="이메일" name="email">
              {isUpdateMode ? <Input /> : getQuery.data?.email}
            </StyledFormItem>
            <StyledFormItem label="휴대번호" name="mobile_phone">
              {isUpdateMode ? (
                <Input
                  readOnly
                  suffix={
                    <Button size="small" type="link" onClick={() => setPhoneAuthModalVisible(true)}>
                      {t("auth phone")}
                    </Button>
                  }
                />
              ) : (
                getQuery.data?.mobile_phone.replace(phonePattern, `$1-$2-$3`)
              )}
            </StyledFormItem>
            <PhoneAuthModal
              visible={phoneAuthModalVisible}
              onClose={() => setPhoneAuthModalVisible(false)}
              onSuccess={(data) => {
                form.setFieldsValue({ ...form.getFieldsValue(), mobile_phone: data.phone });
              }}
            />
            <Row justify="end">
              {isUpdateMode && (
                <TurtleButton htmlType="submit" type="default">
                  수정하기
                </TurtleButton>
              )}
            </Row>
          </Form>
        </TurtleCardSetting>
      </Row>
      <Row>
        <TurtleCardSetting title="계정 정보" style={{ marginBottom: 24 }}>
          <Form layout="horizontal" colon={false} labelCol={{ span: 4 }} wrapperCol={{ span: 5 }}>
            <StyledFormItem label="아이디">{getQuery.data?.login_id}</StyledFormItem>
            {/* <StyledFormItem label="비밀번호">
              <Button
                size="small"
                type="primary"
                onClick={() => {
                  alert("준비중입니다.");
                }}
                style={{ width: 60 }}
              >
                재설정
              </Button>
            </StyledFormItem> */}
          </Form>
        </TurtleCardSetting>
      </Row>
    </>
  );
}

const StyledFormItem = styled(Form.Item)`
  margin-bottom: 12px;
`;

export default PageBody;

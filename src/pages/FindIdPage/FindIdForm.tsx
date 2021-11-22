import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// async
import { AxiosError } from "axios";
import { useQuery, useQueryClient } from "react-query";
import { authAPI } from "apis";
// antd
import { Form, Button, Divider, Typography, message, List, Spin } from "antd";
// lang
import { useTranslation } from "react-i18next";
// components
import PhoneAuthModal from "components/PhoneAuthModal";

const FindIdForm = function () {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [visiblePhoneAuthModal, setVisiblePhoneAuthModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");

  // 아이디 리스트 요청
  const getUserIDQuery = useQuery(
    ["getUserID"],
    () => {
      return authAPI.getUserID({ phone, token });
    },
    {
      enabled: false,
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
    }
  );

  useEffect(() => {
    if (phone && token) {
      getUserIDQuery.refetch();
    }
  }, [phone, token]);

  // 요청 데이터 초기화
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getUserID"]);
    };
  }, []);

  // 인증 모달 열기
  const openAuthModal = () => {
    setVisiblePhoneAuthModal(true);
  };

  // 인증 모달 닫기
  const closeAuthModal = () => {
    setVisiblePhoneAuthModal(false);
  };

  // 인증 성공 콜백
  const onAuthSuccess = (data: { phone: string; token: string }) => {
    const { phone, token } = data;
    setPhone(phone);
    setToken(token);
  };

  return (
    <>
      <PhoneAuthModal
        visible={visiblePhoneAuthModal}
        onClose={closeAuthModal}
        onSuccess={onAuthSuccess}
      />
      <Form layout="vertical">
        <Typography.Title level={3}>{t("find id")}</Typography.Title>
        <Typography style={{ marginBottom: 20 }}>
          {`${t("description.please phone auth")}.`}
        </Typography>
        <Form.Item>
          <Button type="primary" onClick={openAuthModal}>
            {t("auth phone")}
          </Button>
        </Form.Item>
        {getUserIDQuery.isFetching && (
          <Spin style={{ display: "block", textAlign: "center" }} />
        )}
        {getUserIDQuery.data && (
          <Form.Item>
            <List
              bordered
              style={{ maxHeight: 200, overflowY: "scroll" }}
              size="small"
              dataSource={getUserIDQuery.data}
              renderItem={(item) => <List.Item>{item.user_id}</List.Item>}
            />
          </Form.Item>
        )}
        <Divider />
        <Form.Item style={{ float: "right" }}>
          <Link to="/login">{t("login")}</Link>
          <Divider type="vertical" />
          <Link to="/reset-password">{t("reset password")}</Link>
        </Form.Item>
      </Form>
    </>
  );
};

export default FindIdForm;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// async
import { AxiosError } from "axios";
import { useQuery, useQueryClient } from "react-query";
import { userAPI } from "apis";
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
  const getIDQuery = useQuery(
    ["getID"],
    () => {
      return userAPI.getID({ phone, token });
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
      getIDQuery.refetch();
    }
  }, [phone, token]);

  // 요청 데이터 초기화
  useEffect(() => {
    return () => {
      queryClient.removeQueries(["getID"]);
    };
  }, []);

  return (
    <>
      <PhoneAuthModal
        visible={visiblePhoneAuthModal}
        onClose={() => setVisiblePhoneAuthModal(false)}
        onSuccess={(data) => {
          const { phone, token } = data;
          setPhone(phone);
          setToken(token);
        }}
      />
      <Form layout="vertical">
        <Typography.Title level={3}>{t("find id")}</Typography.Title>
        <Typography style={{ marginBottom: 20 }}>
          {t("description.please phone auth")}
        </Typography>
        <Form.Item>
          <Button //
            type="primary"
            onClick={() => setVisiblePhoneAuthModal(true)}
          >
            {t("auth phone")}
          </Button>
        </Form.Item>
        {getIDQuery.isFetching && (
          <Spin style={{ display: "block", textAlign: "center" }} />
        )}
        {getIDQuery.data && (
          <Form.Item>
            <List
              bordered
              style={{ maxHeight: 200, overflowY: "scroll" }}
              size="small"
              dataSource={getIDQuery.data}
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

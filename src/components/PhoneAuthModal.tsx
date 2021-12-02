import { useState, useEffect } from "react";
import { phonePattern } from "utils/pattern";
import moment from "moment";
// async
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { authAPI } from "apis";
// antd
import { Modal, Form, Input, Button, message } from "antd";
// lang
import { useTranslation } from "react-i18next";

interface Props {
  visible: boolean;
  onClose: () => void; // 모달창 닫기
  onSuccess?: (data: { phone: string; token: string }) => void; // 인증 성공 콜백
}

const PhoneAuthModal = function ({ visible, onClose, onSuccess }: Props) {
  const { t } = useTranslation();

  const [form] = Form.useForm();
  const [session_key, setSessionKey] = useState("");
  const [expire_time, setExpireTime] = useState<null | number>(null);

  // 남은 시간 계산
  const calculateExpireTime = (time: Date) => {
    return moment.duration(moment(time).diff(moment())).asSeconds() * 1000;
  };

  // 인증번호 생성 요청
  const createPhoneOTPQuery = useMutation(
    ["createPhoneOTP"],
    authAPI.createPhoneOTP,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        message.success(t("message.success create auth num"));
        const { session_key, expire_time } = data;
        setSessionKey(session_key);
        setExpireTime(calculateExpireTime(expire_time));
      },
    }
  );

  // 인증번호 확인 요청
  const verifyPhoneOTPQuery = useMutation(
    ["verifyPhoneOTP"],
    authAPI.verifyPhoneOTP,
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        message.success(t("message.success verify auth num"));
        const token = data;
        const phone = form.getFieldValue("phone");
        onClose();
        onSuccess && onSuccess({ token, phone });
      },
    }
  );

  // 인증코드 생성
  const handleCreate = () => {
    const { phone } = form.getFieldsValue();
    if (phonePattern.test(phone)) {
      createPhoneOTPQuery.mutate({ phone });
    }
  };

  // 인증코드 확인
  const handleVerify = () => {
    const { otp_code } = form.getFieldsValue();
    verifyPhoneOTPQuery.mutate({ session_key, otp_code });
  };

  // 인증 남은 시간 카운트다운
  useEffect(() => {
    if (visible && expire_time !== null) {
      const countdown = setTimeout(() => {
        if (expire_time > 0) {
          setExpireTime(expire_time - 1000);
        } else {
          setExpireTime(null);
          clearTimeout(countdown);
          message.success(t("message.expired auth time"));
        }
      }, 1000);

      return () => {
        clearTimeout(countdown);
      };
    }
  }, [expire_time, visible]);

  // 상태 초기화
  useEffect(() => {
    if (!visible) {
      form.resetFields();
      setSessionKey("");
      setExpireTime(null);
    }
  }, [visible]);

  return (
    <Modal
      width={400}
      title={t("auth phone")}
      closable={false}
      visible={visible}
      footer={[
        <Button key="close" onClick={onClose}>
          {t("close")}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="phone"
          label={t("phone")}
          rules={[
            {
              pattern: phonePattern,
              message: t("message.error phone validation"),
            },
          ]}
        >
          <Input placeholder={t("description.only number")} />
        </Form.Item>
        <Form.Item>
          <Button
            block
            type="primary"
            loading={createPhoneOTPQuery.isLoading}
            onClick={handleCreate}
          >
            {t("create auth num")}
          </Button>
        </Form.Item>
        <Form.Item name="otp_code" label={t("auth num")}>
          <Input suffix={expire_time && moment(expire_time).format("mm:ss")} />
        </Form.Item>
        <Form.Item>
          <Button
            block
            type="primary"
            disabled={!expire_time}
            loading={verifyPhoneOTPQuery.isLoading}
            onClick={handleVerify}
          >
            {t("verify auth num")}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PhoneAuthModal;

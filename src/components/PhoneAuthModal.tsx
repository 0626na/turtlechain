import moment from "moment";
import { emailPattern } from "utils/pattern";
import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import { authAPI } from "apis";
import { Modal, Form, Input, Button, message } from "antd";
import {
  CREATE_PHONE_OTP_SUCCESS_MESSAGE,
  VERIFY_PHONE_OTP_SUCCESS_MESSAGE,
  AUTH_TIME_EXPIRED_MESSAGE,
  PHONE_VALIDATE_ERROR_MESSAGE,
} from "constant/message";
import {
  AUTH_PHONE,
  PHONE,
  CREATE_AUTH_NUM,
  VERIFY_AUTH_NUM,
  AUTH_NUM,
  CLOSE,
  ONLY_NUMBER,
} from "constant/string";

interface Props {
  visible: boolean;
  onClose: () => void; // 모달창 닫기
  onSuccess?: (data: { phone: string; token: string }) => void; // 인증 성공 콜백
}

const PhoneAuthModal = function ({ visible, onClose, onSuccess }: Props) {
  const [form] = Form.useForm();
  const [session_key, setSessionKey] = useState("");
  const [expire_time, setExpireTime] = useState<null | number>(null);

  // 상태 초기화
  const resetState = () => {
    form.resetFields();
    setSessionKey("");
    setExpireTime(null);
  };

  // 남은 시간 계산
  const calculateExpireTime = (time: Date) => {
    return moment.duration(moment(time).diff(moment())).asSeconds() * 1000;
  };

  // 인증번호 생성 요청
  const createPhoneOTPQuery = useMutation(
    ["createPhoneOTP"],
    () => {
      const data = { phone: form.getFieldValue("phone") };
      return authAPI.createPhoneOTP(data);
    },
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        message.success(CREATE_PHONE_OTP_SUCCESS_MESSAGE);
        const { session_key, expire_time } = data;
        setSessionKey(session_key);
        setExpireTime(calculateExpireTime(expire_time));
      },
    }
  );

  // 인증번호 확인 요청
  const verifyPhoneOTPQuery = useMutation(
    ["verifyPhoneOTP"],
    () => {
      const data = { session_key, otp_code: form.getFieldValue("otp_code") };
      return authAPI.verifyPhoneOTP(data);
    },
    {
      onError: (error: AxiosError) => {
        message.error(error.response?.data?.msg);
      },
      onSuccess: (data) => {
        message.success(VERIFY_PHONE_OTP_SUCCESS_MESSAGE);
        const token = data;
        const phone = form.getFieldValue("phone");
        onClose();
        resetState();
        onSuccess && onSuccess({ token, phone });
      },
    }
  );

  // 인증코드 생성
  const handleCreate = () => {
    const phone = form.getFieldValue("phone");
    if (emailPattern.test(phone)) {
      createPhoneOTPQuery.mutate();
    }
  };

  // 인증코드 확인
  const handleVerify = () => {
    verifyPhoneOTPQuery.mutate();
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
          message.success(AUTH_TIME_EXPIRED_MESSAGE);
        }
      }, 1000);

      return () => {
        clearTimeout(countdown);
      };
    }
  }, [expire_time, visible]);

  return (
    <Modal
      width={400}
      title={AUTH_PHONE}
      closable={false}
      visible={visible}
      footer={[
        <Button
          key="close"
          onClick={() => {
            resetState();
            onClose();
          }}
        >
          {CLOSE}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="phone"
          label={PHONE}
          rules={[
            { pattern: emailPattern, message: PHONE_VALIDATE_ERROR_MESSAGE },
          ]}
        >
          <Input placeholder={ONLY_NUMBER} />
        </Form.Item>
        <Form.Item>
          <Button
            block
            type="primary"
            loading={createPhoneOTPQuery.isLoading}
            onClick={handleCreate}
          >
            {CREATE_AUTH_NUM}
          </Button>
        </Form.Item>
        <Form.Item name="otp_code" label={AUTH_NUM}>
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
            {VERIFY_AUTH_NUM}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PhoneAuthModal;

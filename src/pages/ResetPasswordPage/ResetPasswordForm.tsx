import styled from "styled-components";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Divider, Typography } from "antd";
import { RESET_PASSWORD_PAGE } from "constant/description";
import { FIND_ID, AUTH_PHONE, LOGIN, RESET_PASSWORD } from "constant/string";
import PhoneAuthModal from "components/PhoneAuthModal";

const ResetPasswordForm = function () {
  const [visiblePhoneAuthModal, setVisiblePhoneAuthModal] = useState(false);

  const openPhoneAuthModal = () => {
    setVisiblePhoneAuthModal(true);
  };

  const closePhoneAuthModal = () => {
    setVisiblePhoneAuthModal(false);
  };

  return (
    <>
      <PhoneAuthModal
        visible={visiblePhoneAuthModal}
        onClose={closePhoneAuthModal}
      />

      <Form layout="vertical">
        <Typography.Title level={3}>{RESET_PASSWORD}</Typography.Title>
        <Typography style={{ marginBottom: 20 }}>
          {RESET_PASSWORD_PAGE.AUTH_PHONE_DESCRIPTION}
        </Typography>
        <Form.Item>
          <Button //
            type="primary"
            onClick={openPhoneAuthModal}
          >
            {AUTH_PHONE}
          </Button>
        </Form.Item>
        <Divider />
        <LinkContainer>
          <Link to="/login">{LOGIN}</Link>
          <Divider type="vertical" />
          <Link to="/find-id">{FIND_ID}</Link>
        </LinkContainer>
      </Form>
    </>
  );
};

const LinkContainer = styled.div`
  float: right;
  text-align: center;
`;

export default ResetPasswordForm;

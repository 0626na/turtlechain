import styled from "styled-components";
import { Result, Button } from "antd";
import { SIGN_UP_SUCCESS_MESSAGE } from "constant/message";
import { GO_HOME } from "constant/string";

const SignupResult = function () {
  return (
    <Container>
      <Result status="success" title={SIGN_UP_SUCCESS_MESSAGE} />
      <Button type="primary">{GO_HOME}</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default SignupResult;

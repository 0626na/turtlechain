import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Result, Button } from "antd";
// constant
import { SIGN_UP_SUCCESS_DESCRIPTION } from "constant/description";
import { SIGN_UP_SUCCESS_MESSAGE } from "constant/message";
import { GO_HOME } from "constant/string";

const SignupResult = function () {
  const history = useHistory();

  const onClickGoHome = () => {
    history.push("/");
  };

  return (
    <Container>
      <Result
        status="success"
        title={SIGN_UP_SUCCESS_MESSAGE}
        subTitle={SIGN_UP_SUCCESS_DESCRIPTION}
      />
      <Button type="primary" onClick={onClickGoHome}>
        {GO_HOME}
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default SignupResult;

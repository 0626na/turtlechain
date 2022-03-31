import styled from "styled-components";
import { useHistory } from "react-router-dom";
// antd
import { Result, Button } from "antd";
// lang
import { t } from "i18next";

function SignupResult() {
  const history = useHistory();

  const onClickGoHome = () => {
    history.push("/");
  };

  return (
    <Container>
      <Result
        status="success"
        title={t("message.success signup")}
        subTitle={t("description.signup completed")}
      />
      <Button type="primary" onClick={onClickGoHome}>
        {t("go home")}
      </Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default SignupResult;

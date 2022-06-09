import styled from 'styled-components';
import { t } from 'i18next';
import { useHistory } from 'react-router-dom';
import { Result, Button } from 'antd';

function SignupResult() {
  const history = useHistory();

  const onClickGoHome = () => {
    history.push('/');
  };

  return (
    <Container>
      <Result
        status="success"
        title={t('message.success signup')}
        subTitle={t('description.signup completed')}
      />
      <Button type="primary" onClick={onClickGoHome}>
        {t('go home')}
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

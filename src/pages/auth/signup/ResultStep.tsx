import styled from 'styled-components';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';

interface Props {
  visible: boolean;
}

function ResultStep({ visible }: Props) {
  const navigate = useNavigate();

  const onClickGoHome = () => {
    navigate('/');
  };

  return (
    <div style={{ display: visible ? '' : 'none' }}>
      <Container>
        <Result
          icon={
            <img
              src={`${process.env.PUBLIC_URL}/assets/svg/approve.svg`}
              alt="approve"
            />
          }
          title={t('message.success signup')}
          subTitle={t('description.signup completed')}
        />
        <Button type="primary" onClick={onClickGoHome}>
          {t('go home')}
        </Button>
      </Container>
    </div>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default ResultStep;

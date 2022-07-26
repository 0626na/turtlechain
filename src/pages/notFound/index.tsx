import { Button, Result, Row } from 'antd';
import { t } from 'i18next';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';

function index() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = useNavigate();

  return (
    <>
      <Helmet title={t('turtlechain')} />
      <Row
        justify="center"
        align="middle"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      >
        <Result
          status="404"
          title="404"
          subTitle={`${t('message.page not found')}`}
          extra={
            <Button
              type="primary"
              onClick={() => {
                navigate('/home');
              }}
            >
              Back Home
            </Button>
          }
        />
      </Row>
    </>
  );
}

export default index;

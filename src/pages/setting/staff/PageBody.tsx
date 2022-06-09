import { t } from 'i18next';
import { Button, Row, Table } from 'antd';
import { MainContent } from '@layout/main';
import { UserOutlined } from '@ant-design/icons';

function PageBody() {
  return (
    <>
      <Row justify="end">
        <Button //
          type="primary"
          icon={<UserOutlined />}
          onClick={() => {}}
          style={{ width: 140 }}
        >
          {t('button.invite staff')}
        </Button>
      </Row>
      <MainContent title={t('staff.lists')}>
        <Table size="small" />
      </MainContent>
    </>
  );
}

export default PageBody;

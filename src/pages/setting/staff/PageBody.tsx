import { Button, Row, Table } from "antd";
import { t } from "i18next";
import { UserOutlined } from "@ant-design/icons";
import { MainContent } from "layouts/main";

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
          {t("button.invite staff")}
        </Button>
      </Row>
      <MainContent title={t("staff.lists")}>
        <Table size="small" />
      </MainContent>
    </>
  );
}

export default PageBody;

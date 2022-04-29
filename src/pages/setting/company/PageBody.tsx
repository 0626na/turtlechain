import { Form, message, Row } from "antd";
import { retailerCompanyAPI } from "apis";
import { AxiosError } from "axios";
import { TurtleCardSetting } from "components/common";
import { t } from "i18next";
import { useQuery } from "react-query";

function PageBody() {
  const getQuery = useQuery("getCompany", () => retailerCompanyAPI.get(), {
    onError: (error: AxiosError) => {
      message.error(error.response?.data?.msg);
    },
  });

  return (
    <Row>
      <TurtleCardSetting title={t("company.info")} style={{ marginBottom: 24 }}>
        <Form
          layout="horizontal"
          // form={form}
          colon={false}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 5 }}
        >
          <Form.Item label="사업자 종류">{getQuery.data?.biz_type}</Form.Item>
          <Form.Item label="사업자 번호">{getQuery.data?.biz_num}</Form.Item>
          <Form.Item label="사업자명">{getQuery.data?.name}</Form.Item>
          <Form.Item label="사업자 주소">{getQuery.data?.address}</Form.Item>
          <Form.Item label="대표자명">{getQuery.data?.owner}</Form.Item>
          <Form.Item label="메모">{getQuery.data?.memo}</Form.Item>
        </Form>
      </TurtleCardSetting>
    </Row>
  );
}

export default PageBody;

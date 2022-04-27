import { Card, Col, message, Row } from "antd";
import { retailerCompanyAPI } from "apis";
import { AxiosError } from "axios";
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
      <Card
        type="inner"
        title={t("company.info")}
        style={{ width: "100%", marginBottom: 24 }}
        headStyle={{ backgroundColor: "#F6F9FD" }}
      >
        <Row style={{ margin: "16px 0" }}>
          <Col span={4}>사업자 종류</Col> <Col>{getQuery.data?.biz_type}</Col>
        </Row>
        <Row style={{ margin: "16px 0" }}>
          <Col span={4}>사업자 번호</Col> <Col>{getQuery.data?.biz_num}</Col>
        </Row>
        <Row style={{ margin: "16px 0" }}>
          <Col span={4}>사업자명</Col> <Col>{getQuery.data?.name}</Col>
        </Row>
        <Row style={{ margin: "16px 0" }}>
          <Col span={4}>사업자 주소</Col> <Col>{getQuery.data?.address}</Col>
        </Row>
        <Row style={{ margin: "16px 0" }}>
          <Col span={4}>대표자명</Col> <Col>{getQuery.data?.owner}</Col>
        </Row>
        <Row style={{ margin: "16px 0" }}>
          <Col span={4}>메모</Col> <Col>{getQuery.data?.memo}</Col>
        </Row>
      </Card>
    </Row>
  );
}

export default PageBody;

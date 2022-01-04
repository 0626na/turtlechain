import styled from "styled-components";
import { Breadcrumb, Col, Divider, Row, Typography } from "antd";
import CustomDivider from "./common/CustomDivider";

interface Props {
  icon?: React.ReactNode;
  title?: string;
  breadcrumbList?: Array<string>;
}

const PageHeader = function ({ icon, title, breadcrumbList }: Props) {
  return (
    <>
      <Row align="middle" justify="space-between">
        <Col style={{ display: "flex", alignItems: "center" }}>
          {icon}
          <Typography.Title level={3} style={{ margin: "0.2rem 0 0 0.7rem" }}>
            {title}
          </Typography.Title>
        </Col>
        <Col>
          {breadcrumbList && (
            <BreadcrumbContainer separator=">">
              {breadcrumbList.map((item) => (
                <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
              ))}
            </BreadcrumbContainer>
          )}
        </Col>
      </Row>
      <CustomDivider />
    </>
  );
};

const BreadcrumbContainer = styled(Breadcrumb)`
  background-color: #f1f3f5;
  padding: 5px 10px;
  border-radius: 20px;
`;

export default PageHeader;

import styled from "styled-components";
import { Breadcrumb, Col, Divider, Row, Space, Typography } from "antd";
import CustomDivider from "./common/CustomDivider";
import CustomBreadCrumb from "./common/CustomBreadCrumb";

interface Props {
  icon?: React.ReactNode;
  title: string;
  breadcrumbList: Array<string>;
}

const PageHeader = function ({ icon, title, breadcrumbList }: Props) {
  return (
    <>
      <Row align="middle" justify="space-between">
        <Col>
          <Space>
            {icon}
            <StyledTitle level={3}>{title}</StyledTitle>
          </Space>
        </Col>
        <Col>
          {breadcrumbList && (
            <CustomBreadCrumb list={breadcrumbList}></CustomBreadCrumb>
          )}
        </Col>
      </Row>
      <CustomDivider />
    </>
  );
};

const StyledTitle = styled(Typography.Title)`
  margin: 0.4rem 0 0 0.7rem;
  margin-bottom: 0 !important;
`;

export default PageHeader;

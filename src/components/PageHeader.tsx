import styled from "styled-components";
import { Breadcrumb, Col, Divider, Row, Space, Typography } from "antd";
import CustomDivider from "./common/CustomDivider";
import CustomBreadCrumb from "./common/CustomBreadCrumb";
import CustomIcon from "./common/CustomIcon";

interface Props {
  pageName: string;
  title: string;
  breadcrumbList: Array<string>;
}

const PageHeader = function ({ pageName, title, breadcrumbList }: Props) {
  return (
    <>
      <Row align="middle" justify="space-between">
        <Col>
          <Space>
            <CustomIcon
              src={`${process.env.PUBLIC_URL}/assets/svg/${pageName}.svg`}
              alt={pageName}
            />
            <StyledTitle level={3}>{title}</StyledTitle>
          </Space>
        </Col>
        <Col>{breadcrumbList && <CustomBreadCrumb list={breadcrumbList}></CustomBreadCrumb>}</Col>
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

import styled from "styled-components";
import { Breadcrumb, Col, Divider, Row, Space, Typography } from "antd";
import TurtleDivider from "./common/TurtleDivider";
import TurtleBreadCrumb from "./common/TurtleBreadCrumb";
import TurtleIcon from "./common/TurtleIcon";

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
            <TurtleIcon
              src={`${process.env.PUBLIC_URL}/assets/svg/${pageName}.svg`}
              alt={pageName}
            />
            <StyledTitle level={3}>{title}</StyledTitle>
          </Space>
        </Col>
        <Col>{breadcrumbList && <TurtleBreadCrumb list={breadcrumbList}></TurtleBreadCrumb>}</Col>
      </Row>
      <TurtleDivider />
    </>
  );
};

const StyledTitle = styled(Typography.Title)`
  margin: 0.4rem 0 0 0.7rem;
  margin-bottom: 0 !important;
`;

export default PageHeader;

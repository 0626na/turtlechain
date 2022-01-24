import styled from "styled-components";
import { Col, Row, Space, Typography } from "antd";
import TurtleDivider from "./common/TurtleDivider";
import TurtleBreadCrumb from "./common/TurtleBreadCrumb";
import TurtleIcon from "./common/TurtleIcon";
import { InfoCircleOutlined as InfoIcon } from "@ant-design/icons";

interface Props {
  pageName: string;
  title: string;
  breadcrumbList: Array<string>;
  info?: string;
}

const PageHeader = function ({ pageName, title, breadcrumbList, info }: Props) {
  return (
    <>
      <Row align="middle" justify="space-between">
        <Col>
          <Space>
            <TurtleIcon
              src={`${process.env.PUBLIC_URL}/assets/svg/${pageName}.svg`}
              alt={pageName}
              color="green"
            />
            <StyledTitle level={3}>{title}</StyledTitle>
          </Space>
        </Col>
        <Col>{breadcrumbList && <TurtleBreadCrumb list={breadcrumbList}></TurtleBreadCrumb>}</Col>
      </Row>
      {info && (
        <StyledRow>
          <Typography.Text type="secondary">
            <InfoIcon /> {info}
          </Typography.Text>
        </StyledRow>
      )}
      <TurtleDivider />
    </>
  );
};

const StyledTitle = styled(Typography.Title)`
  margin: 0.4rem 0 0 0.7rem;
  margin-bottom: 0 !important;
`;

const StyledRow = styled(Row)`
  padding-top: 0 !important;
`;

export default PageHeader;

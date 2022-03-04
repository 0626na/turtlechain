import styled from "styled-components";
import { Col, Row, Space, Typography } from "antd";
import TurtleDivider from "./common/TurtleDivider";
import TurtleBreadCrumb from "./common/TurtleBreadCrumb";
import TurtleInfo from "./common/TurtleInfo";
import { t } from "i18next";

interface Props {
  pageName?: string;
  title: string;
  breadcrumbList?: Array<string>;
  info?: string;
}

const PageHeader = function ({ pageName, title, breadcrumbList, info }: Props) {
  return (
    <>
      <Row align="middle" justify="space-between">
        <Col>
          <StyledTitle level={3}>{title}</StyledTitle>
          {info && <TurtleInfo>{info}</TurtleInfo>}
        </Col>
        <Col>
          {breadcrumbList && (
            <TurtleBreadCrumb list={[t("HOME"), ...breadcrumbList]}></TurtleBreadCrumb>
          )}
        </Col>
      </Row>
      <TurtleDivider />
    </>
  );
};

const StyledTitle = styled(Typography.Title)`
  margin-top: 12px !important;
  margin-bottom: 8px !important;
`;

export default PageHeader;

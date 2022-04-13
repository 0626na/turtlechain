import styled from "styled-components";
import { Col, Row, Typography } from "antd";
import { t } from "i18next";
import { TurtleBreadCrumb, TurtleDivider, TurtleInfo } from "components/common";

interface Props {
  title: string;
  breadcrumbList?: Array<string>;
  info?: string;
  divider?: boolean;
}

function PageHeader({ title, breadcrumbList, info, divider = true }: Props) {
  return (
    <>
      <Row
        align="middle"
        justify="space-between"
        style={{ backgroundColor: "white", borderRadius: 12, padding: "12px 24px" }}
      >
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
      {divider && <TurtleDivider />}
    </>
  );
}

const StyledTitle = styled(Typography.Title)`
  margin-top: 12px !important;
  margin-bottom: 8px !important;
`;

export default PageHeader;

import styled from "styled-components";
import { Col, Row, Typography } from "antd";
import { t } from "i18next";
import { TurtleBreadCrumb, TurtleDivider, TurtleInfo } from "components/common";

interface Props {
  title: string;
  breadcrumbList?: Array<string>;
  infoList?: Array<string>;
}

function PageHeader({ title, breadcrumbList, infoList }: Props) {
  return (
    <>
      <Row
        align="middle"
        justify="space-between"
        style={{ backgroundColor: "white", borderRadius: 8, padding: "8px 36px 12px 36px" }}
      >
        <Col>
          <StyledTitle level={4}>{title}</StyledTitle>
          {infoList &&
            infoList.map((info) => (
              <Col key={info}>
                <TurtleInfo>{info}</TurtleInfo>
              </Col>
            ))}
        </Col>
        <Col>
          {breadcrumbList && (
            <TurtleBreadCrumb list={[t("HOME"), ...breadcrumbList]}></TurtleBreadCrumb>
          )}
        </Col>
      </Row>
      <TurtleDivider style={{ margin: 0 }} />
    </>
  );
}

const StyledTitle = styled(Typography.Title)`
  margin-top: 12px !important;
  margin-bottom: 8px !important;
`;

export default PageHeader;

import React from 'react';
import { Col, Row } from 'antd';
import TurtleText from '@components/element/TurtleText';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

interface Props {
  title: string;
  subTitle?: string;
  Buttons?: React.ReactNode[];
}

function PageTitle({ title, subTitle, Buttons }: Props) {
  return (
    <>
      <Row css={WrapperStyled} justify="space-between">
        <Col css={leftContainerStyled}>
          <TurtleText css={titleStyled}>{title}</TurtleText>
          {subTitle && <TurtleText css={subtitleStyled}>{subTitle}</TurtleText>}
        </Col>

        <Col>
          <Row>
            {Buttons?.map((button, idx) => (
              <Col key={idx} style={{ marginLeft: 8 }}>
                {button}
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </>
  );
}
const WrapperStyled = css`
  padding: 12px 36px 0px 36px;
`;

const leftContainerStyled = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const titleStyled = css`
  font-size: 20px;
  font-weight: 500;
  color: #242934;
`;

const subtitleStyled = css`
  font-size: 13px;
  font-weight: 400;
  color: #6b6d73;
`;

export default PageTitle;

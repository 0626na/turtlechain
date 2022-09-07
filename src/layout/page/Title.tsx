import React from 'react';
import { Col, Row } from 'antd';
import TurtleText from '@components/element/TurtleText';

import { css } from '@emotion/react';

interface Props {
  title: string;
  subTitle?: string;
  buttons?: React.ReactNode[];
}

function PageTitle({ title, subTitle, buttons }: Props) {
  return (
    <>
      <Row css={wrapper} justify="space-between">
        <Col css={leftContainer}>
          <TurtleText css={$title}>{title}</TurtleText>
          {subTitle && <TurtleText css={$subtitle}>{subTitle}</TurtleText>}
        </Col>

        <Col>
          <Row>
            {buttons?.map((button, idx) => (
              <Col key={idx} css={buttonContainer}>
                {button}
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </>
  );
}
const wrapper = css`
  padding: 12px 36px 0px 36px;
`;

const leftContainer = css`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const $title = css`
  font-size: 20px;
  font-weight: 500;
  color: #242934;
`;

const $subtitle = css`
  font-size: 13px;
  font-weight: 400;
  color: #6b6d73;
`;

const buttonContainer = css`
  margin-left: 8px;
`;
export default PageTitle;

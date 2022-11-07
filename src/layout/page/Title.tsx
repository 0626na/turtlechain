import React from 'react';
import { Col, Row } from 'antd';
import TurtleText from '@components/element/TurtleText';
import { InfoCircleOutlined as InfoIcon } from '@ant-design/icons';
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
          {subTitle && (
            <TurtleText css={$subtitle}>
              <span css={subTitleIcon}>
                <InfoIcon />
              </span>
              {subTitle}
            </TurtleText>
          )}
        </Col>

        <Col>
          <Row align="middle">
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
  padding: 12px 36px 12px 36px;
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
  margin-left: 3px;
  font-size: 13px;
  font-weight: 400;
  color: #6b6d73;
`;

const subTitleIcon = css({
  marginRight: 5,
});

const buttonContainer = css`
  margin-left: 8px;
`;

export default PageTitle;

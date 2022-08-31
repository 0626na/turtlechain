import { css } from '@emotion/react';
import { Col, Row } from 'antd';
import TurtleText from './TurtleText';

interface Props {
  totalCount: number;
  rightContent?: React.ReactNode;
}

function TurtleTableTitle({ totalCount = 0, rightContent }: Props) {
  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 12 }}>
      <Col>
        <TurtleText css={totalCountContainerStyled}>
          총<TurtleText css={totalCountStyed}>{totalCount}</TurtleText>건
        </TurtleText>
      </Col>
      <Col>{rightContent}</Col>
    </Row>
  );
}

const totalCountContainerStyled = css`
  color: #5b5d63;
  font-size: 13px;
  font-weight: 500;
`;

const totalCountStyed = css`
  color: #32acdd;
  font-weight: 700;
`;

export default TurtleTableTitle;

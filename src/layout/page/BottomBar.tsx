import { Col, Row } from 'antd';

import { css } from '@emotion/react';

interface Props {
  children?: React.ReactNode;
}

function BottomBar({ children }: Props) {
  return (
    <div css={inner}>
      <Row align="middle" justify="end">
        <Col>{children}</Col>
      </Row>
    </div>
  );
}

const inner = css`
  height: 92px;

  padding: 23px 36px;
  background-color: #f6f8fb;
`;

export default BottomBar;

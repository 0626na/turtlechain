import { Col, Row } from 'antd';
import styled from '@emotion/styled';

interface Props {
  children?: React.ReactNode;
}

function BottomBar({ children }: Props) {
  return (
    <Inner>
      <Row align="middle" justify="end">
        <Col>{children}</Col>
      </Row>
    </Inner>
  );
}

const Inner = styled.div`
  height: 92px;

  padding: 23px 36px;
  background-color: #f6f8fb;
`;

export default BottomBar;

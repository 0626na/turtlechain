import styled from 'styled-components';
import { Avatar, Col, Row } from 'antd';

import TurtleText from '@components/element/TurtleText';
import Notification from '@components/combine/Notification';

interface Props {
  title: string;
  Button?: React.ReactNode;
  // children?:
}

function PageHeader({ title, Button }: Props) {
  return (
    <>
      <Inner>
        <Row align="middle" justify="space-between">
          <Col style={{ display: 'flex', alignItems: 'center' }}>
            <TurtleText
              style={{ fontSize: 24, fontWeight: 700, color: '#242934' }}
            >
              {title}
            </TurtleText>
            {Button}
          </Col>
          <Col style={{ display: 'flex', alignItems: 'center' }}>
            <Notification />

            <Avatar style={{ backgroundColor: 'orange' }} size={36}>
              김
            </Avatar>
          </Col>
        </Row>
      </Inner>
    </>
  );
}

const Inner = styled.div`
  height: 84px;
  padding: 24px 36px;

  background-color: red;
`;

// const Avatar = styled.div`
//   display: inline-block;
//   width: 36px;
//   height: 36px;
//   background-color: orange;
//   border-radius: 50%;
// `;

export default PageHeader;

import { Col, Row } from 'antd';
import TurtleText from '@components/element/TurtleText';
import styled from 'styled-components';

interface Props {
  title: string;
  subTitle?: string;
  Buttons?: React.ReactNode[];
}

function PageTitle({ title, subTitle, Buttons }: Props) {
  return (
    <>
      <Inner>
        <Row justify="space-between">
          <Col
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <TurtleText
              style={{ fontSize: 20, fontWeight: 500, color: '#242934' }}
            >
              {title}
            </TurtleText>
            {subTitle && (
              <TurtleText
                style={{ fontSize: 13, fontWeight: 400, color: '#6B6D73' }}
              >
                {subTitle}
              </TurtleText>
            )}
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
      </Inner>
    </>
  );
}

const Inner = styled.div`
  padding: 12px 36px 0px 36px;
`;
export default PageTitle;

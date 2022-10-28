import React from 'react';
import { t } from 'i18next';
import { Card, Col, Row, Typography } from 'antd';
import { Helmet } from 'react-helmet';
import { ArrowRightOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';

function index() {
  const title = `${t('turtleChain')} - ${t('membershipInfo')}`;

  return (
    <>
      <Helmet title={title} />
      <div css={container}>
        <Row justify="center">
          <Typography.Title level={1} style={{ marginBottom: 8 }}>
            내 비지니스 유형에
          </Typography.Title>
        </Row>
        <Row justify="center" style={{ marginBottom: 24 }}>
          <Typography.Title level={1} style={{ fontWeight: 400 }}>
            적합한 플랜을 찾아보세요
          </Typography.Title>
        </Row>
        <div>
          <Row justify="end">
            <Typography.Text type="secondary">*부가세 별도</Typography.Text>
          </Row>
          <Row
            justify="center"
            gutter={[
              { md: 24, lg: 24, xl: 24 },
              { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 },
            ]}
          >
            {[
              {
                background: '#00B594',
                line2: '5천 미만',
                line3: '5천만원 미만의',
                line4: '소형',
                price: '50,000',
              },
              {
                background: '#009FB5',
                line2: '1억 미만',
                line3: '1억 미만의',
                line4: '중형',
                price: '100,000',
              },
              {
                background: '#00B5B5',
                line2: '5억 미만',
                line3: '5억 미만의',
                line4: '대형',
                price: '150,000',
              },
              {
                background: '#383F4F',
                line2: '5억 이상',
                line3: '5억 이상의',
                line4: '대형',
                price: '별도협의',
              },
            ].map(({ background, line2, line3, line4, price }) => (
              <Col key={price}>
                <Card
                  style={{
                    boxShadow: '0px 10px 30px rgba(41, 77, 119, 0.08)',
                    borderRadius: 4,
                    width: 230,
                    height: 310,
                  }}
                  bordered={false}
                  hoverable
                  cover={
                    <div
                      style={{
                        background,
                        padding: '12px 24px',
                        borderRadius: '4px 4px 0 0',
                      }}
                    >
                      <Typography.Text style={{ color: 'white', fontSize: 13 }}>
                        월 사입규모
                      </Typography.Text>
                      <br />
                      <Typography.Text style={{ color: 'white', fontSize: 24 }}>
                        {line2}
                      </Typography.Text>
                    </div>
                  }
                >
                  <div style={{ marginBottom: 16 }}>
                    <Typography.Text style={{ color: '#434852' }}>
                      월 사입비 {line3}
                    </Typography.Text>
                    <br />
                    <Typography.Text style={{ color: '#434852' }}>
                      {line4} 쇼핑몰이라면
                    </Typography.Text>
                  </div>
                  <div style={{ marginBottom: 36 }}>
                    <Typography.Text strong style={{ fontSize: 36 }}>
                      {price}
                    </Typography.Text>
                    <Typography.Text>
                      &nbsp;&nbsp;{price === '별도협의' ? '' : '원 / 월'}
                    </Typography.Text>
                  </div>
                  <div style={{ float: 'right' }}>
                    <ArrowRightOutlined
                      style={{ fontSize: 24, color: '#CBCCD1' }}
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  );
}

const container = css`
  width: 100%;
  height: 100vh;
  padding: 160px 20%;
  background: #fbfcfd;
`;

export default index;

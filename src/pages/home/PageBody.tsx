import { css } from '@emotion/react';
import { PageContent, PageHeader } from '@layout/page';
import { theme } from '@styles/theme';

import React from 'react';

// import { faker } from '@faker-js/faker';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// );

// const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: 'top' as const,
//     },
//     title: {
//       display: true,
//       text: 'Chart.js Bar Chart',
//     },
//   },
// };

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
// const data = {
//   labels,
//   datasets: [
//     {
//       label: 'Dataset 1',
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//       backgroundColor: 'rgba(255, 99, 132, 0.5)',
//     },
//     {
//       label: 'Dataset 2',
//       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//     },
//   ],
// };
function PageBody() {
  return (
    <>
      <PageHeader title="" />

      <PageContent>
        {/* upper */}
        <div
          css={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <h3 css={{ fontSize: 20, color: theme.grey600 }}>
            8월 세금계산서 발행예정
          </h3>
          <h1 css={{ marginTop: 14 }}>
            <span css={{ fontSize: 40, fontWeight: 700, color: theme.grey800 }}>
              100,000,000
            </span>
            <span
              css={{
                fontSize: 24,
                fontWeight: 700,
                color: theme.grey800,
              }}
            >
              원
            </span>
          </h1>

          <div
            css={{
              marginTop: 60,
              padding: '11px 16px',
              backgroundColor: '#F0F3F6',
              borderRadius: 8,
            }}
          >
            교환/반품/미송 상품이 있지는 않나요?
          </div>
          <div css={{ marginTop: 48 }}>프로그레스바</div>
        </div>

        {/* under */}
        <div
          css={{
            marginTop: 100,
            height: 454,
            display: 'flex',
            gap: 24,
          }}
        >
          <div
            css={{
              flex: 1,
              padding: '36px 36px 52px 36px',
              boxShadow: '0px 8px 20px rgba(41, 77, 119, 0.14)',
              borderRadius: 16,
            }}
          >
            <div
              css={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <h4
                css={{
                  display: 'inline',
                  color: theme.grey500,
                  fontSize: 18,
                  fontWeight: 500,
                }}
              >
                누적 결제금액
              </h4>

              <div
                css={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexBasis: 122,
                }}
              >
                <div css={markCss.self}>
                  <div
                    css={markCss.status}
                    style={{
                      ['--backgroundColor' as string]: '#a1a2a6',
                    }}
                  />
                  <span>저번주</span>
                </div>

                <div css={markCss.self}>
                  <div
                    css={markCss.status}
                    style={{
                      ['--backgroundColor' as string]: '#00b3be',
                    }}
                  />
                  <span>이번주</span>
                </div>
              </div>
            </div>
            <h1 css={{ marginTop: 12 }}>
              <span
                css={{ fontSize: 28, fontWeight: 700, color: theme.grey800 }}
              >
                100,000,000
              </span>
              <span
                css={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: theme.grey800,
                }}
              >
                원
              </span>
            </h1>
            {/* <Bar options={options} data={data} />; */}
          </div>
          <div css={{ flex: 1, background: 'red' }}>
            {/* <ClearingStatusCard /> */}
          </div>
          <div css={{ flex: 1, background: 'red' }}>
            {/* <AnnouncementCard />
            <AdjustmentStatusCard /> */}
          </div>
        </div>

        {/* <Row
          css={css`
            height: 253px;
          `}
        >
          <ClearingStatusCard />
        </Row>
        <Row gutter={12}>
          <Col span={7}>
            <AdjustmentStatusCard />
          </Col>
          <Col span={17}>
            <ClearingChartCard />
          </Col>
        </Row> */}
      </PageContent>
    </>
  );
}

const markCss = {
  self: css({
    fontWeight: 400,
    fontSize: 14,
    color: theme.grey600,
  }),

  status: css({
    display: 'inline-block',
    marginRight: 7,
    width: 8,
    height: 8,
    backgroundColor: 'var(--backgroundColor)',
    borderRadius: '50%',
  }),
};
export default PageBody;

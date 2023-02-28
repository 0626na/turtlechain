import React from 'react';
import { PageHeader } from '@layout/page';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import '@testing-library/jest-dom/extend-expect';
import { renderHook } from '@testing-library/react-hooks';
import orderAPI, { StoreOrderItemExcelParsing } from '@apis/orderAPI';

import moment from 'moment';
import { RcFile } from 'antd/lib/upload';
import { parsedExcelData } from './data/parsedExcel';

describe('pickerorder page 테스트', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  test('pageHeader 테스트', () => {
    const queryClient = new QueryClient();

    render(
      <Router>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <PageHeader title="발주등록" />
          </QueryClientProvider>
        </RecoilRoot>
      </Router>,
    );

    expect(screen.getByText('발주등록')).toBeInTheDocument();
  });

  test('발주서 업로드 테스트', async () => {
    jest.mock('@apis/orderAPI');

    //const mockedOrderAPI = orderAPI as jest.Mocked<typeof orderAPI>;
    const file = new File([new Blob()], 'test.xlsx') as RcFile;

    orderAPI.createOrderExcelParsing.mockResolvedValue({
      data: {
        successes: [
          {
            rt_store_id: 999,
            rt_store_name: 'test',
            type: 'excel',
            orders: [
              {
                vendor_name: '플뢰르',
                vendor_address: 'APM 4층 18',
                vendor_mobile: '',
                mobile: '01043196770',
                product_name: 'Cabra Wide Cotton Pants',
                product_option: '[XS-White]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 2380,
                    name: '플뢰르',
                    address: 'APM 4층 18호',
                    mobiles: [
                      {
                        id: 2186,
                        phone: '01043196770',
                      },
                      {
                        id: 1730,
                        phone: '01038470599',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '플뢰르',
                vendor_address: 'APM 4층 18',
                vendor_mobile: '',
                mobile: '01043196770',
                product_name: 'Straight Side Bending Slacks(2color)',
                product_option: '[S-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 2380,
                    name: '플뢰르',
                    address: 'APM 4층 18호',
                    mobiles: [
                      {
                        id: 2186,
                        phone: '01043196770',
                      },
                      {
                        id: 1730,
                        phone: '01038470599',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '플뢰르',
                vendor_address: 'APM 4층 18',
                vendor_mobile: '',
                mobile: '01043196770',
                product_name: 'Wool Boots Cut Slacks(2color)',
                product_option: '[M-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 2380,
                    name: '플뢰르',
                    address: 'APM 4층 18호',
                    mobiles: [
                      {
                        id: 2186,
                        phone: '01043196770',
                      },
                      {
                        id: 1730,
                        phone: '01038470599',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '에덴',
                vendor_address: 'APM 4층 31',
                vendor_mobile: '',
                mobile: '01032905274',
                product_name: 'N Track Wide Pants(3color)',
                product_option: '[FREE-블루]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 2912,
                    name: '에덴(eden)',
                    address: 'APM 4층 31호',
                    mobiles: [
                      {
                        id: 1253,
                        phone: '01032905274',
                      },
                    ],
                  },
                  {
                    id: 3012,
                    name: '에덴(eden)',
                    address: '디오트 B2층 F-16',
                    mobiles: [
                      {
                        id: 2409,
                        phone: '01045693764',
                      },
                    ],
                  },
                  {
                    id: 3097,
                    name: '에덴(ebenezer)',
                    address: '청평화 B1층 가-7',
                    mobiles: [
                      {
                        id: 2185,
                        phone: '01043191949',
                      },
                      {
                        id: 1757,
                        phone: '01038917565',
                      },
                    ],
                  },
                  {
                    id: 3199,
                    name: '에덴',
                    address: '제일평화 1층 155호',
                    mobiles: [
                      {
                        id: 886,
                        phone: '01029325244',
                      },
                    ],
                  },
                  {
                    id: 5634,
                    name: '스튜디오에덴',
                    address: '누죤 6층 619호',
                    mobiles: [
                      {
                        id: 547,
                        phone: '01025136519',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '바론',
                vendor_address: 'APM 4층 39',
                vendor_mobile: '',
                mobile: '01086546033',
                product_name: '[썸머] Cooling Dear Knit(5color)',
                product_option: '[FREE-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 1101,
                    name: '바론(baron)',
                    address: 'APM 럭스 2층 202호',
                    mobiles: [
                      {
                        id: 6559,
                        phone: '01099031590',
                      },
                    ],
                  },
                  {
                    id: 1408,
                    name: '바론',
                    address: 'APM 4층 39호',
                    mobiles: [
                      {
                        id: 5294,
                        phone: '01086546033',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '로드',
                vendor_address: 'APM 4층 46',
                vendor_mobile: '',
                mobile: '01023231992',
                product_name: 'Semi Wide Fit String Pants(3color)',
                product_option: '[FREE-아이보리]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 186,
                    name: '로드(eastroad)',
                    address: 'APM 4층 46호',
                    mobiles: [
                      {
                        id: 388,
                        phone: '01023231992',
                      },
                    ],
                  },
                  {
                    id: 3549,
                    name: '클로드',
                    address: '디오트 4층 B-10',
                    mobiles: [
                      {
                        id: 582,
                        phone: '01025545372',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '웰던',
                vendor_address: 'APM 4층 47',
                vendor_mobile: '',
                mobile: '01044351191',
                product_name: 'Brown&Black Wide Denim Pants',
                product_option: '[M-브라운]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 2939,
                    name: '웰던',
                    address: 'APM 4층 47호',
                    mobiles: [
                      {
                        id: 2275,
                        phone: '01044351191',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '제론',
                vendor_address: 'APM 4층 5',
                vendor_mobile: '',
                mobile: '01084643120',
                product_name: 'Ice Short Kara Knit(5color)',
                product_option: '[L-Black]',
                product_count: 2,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 5211,
                    name: '제론(xeron)',
                    address: 'APM 4층 5호',
                    mobiles: [
                      {
                        id: 5125,
                        phone: '01084643120',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '오디너리',
                vendor_address: 'APM 4층 53',
                vendor_mobile: '',
                mobile: '01025798242',
                product_name: 'Unbalanced Hazzi Vest(10color)',
                product_option: '[FREE-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 2613,
                    name: '오디너리(ordinary)',
                    address: 'APM 4층 53호',
                    mobiles: [
                      {
                        id: 604,
                        phone: '01025798242',
                      },
                    ],
                  },
                  {
                    id: 5587,
                    name: '오디너리',
                    address: '디오트 4층 J-13',
                    mobiles: [
                      {
                        id: 1391,
                        phone: '01034353722',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '데자뷰',
                vendor_address: 'APM 4층 8',
                vendor_mobile: '',
                mobile: '01031445379',
                product_name: 'DJV Half-Neck Span T-Shirt(2color)',
                product_option: '[FREE-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 3024,
                    name: '데자뷰',
                    address: 'APM 4층 8호',
                    mobiles: [
                      {
                        id: 1108,
                        phone: '01031445379',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ] as StoreOrderItemExcelParsing[],
        fails: [
          {
            rt_store_id: 999,
            rt_store_name: 'test',
            type: 'excel',
            orders: [
              {
                vendor_name: '가먼츠',
                vendor_address: 'APM 5층 9',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Checker Board Two-Way Zip-Up(2color)',
                product_option: '[FREE-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 211,
                    name: '가먼츠',
                    address: 'APM 5층 9호',
                    mobiles: [
                      {
                        id: 4194,
                        phone: '01068611774',
                      },
                    ],
                  },
                  {
                    id: 4477,
                    name: '레드가먼츠',
                    address: 'APM 6층 22호',
                    mobiles: [
                      {
                        id: 5428,
                        phone: '01087699195',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '가먼츠',
                vendor_address: 'APM 5층 9',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Dear Cooling Silk Shirt(4color)',
                product_option: '[FREE-Mint]',
                product_count: 2,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 211,
                    name: '가먼츠',
                    address: 'APM 5층 9호',
                    mobiles: [
                      {
                        id: 4194,
                        phone: '01068611774',
                      },
                    ],
                  },
                  {
                    id: 4477,
                    name: '레드가먼츠',
                    address: 'APM 6층 22호',
                    mobiles: [
                      {
                        id: 5428,
                        phone: '01087699195',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '가먼츠',
                vendor_address: 'APM 5층 9',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Dear Stardium Blazer(2color)',
                product_option: '[L-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 211,
                    name: '가먼츠',
                    address: 'APM 5층 9호',
                    mobiles: [
                      {
                        id: 4194,
                        phone: '01068611774',
                      },
                    ],
                  },
                  {
                    id: 4477,
                    name: '레드가먼츠',
                    address: 'APM 6층 22호',
                    mobiles: [
                      {
                        id: 5428,
                        phone: '01087699195',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '가먼츠',
                vendor_address: 'APM 5층 9',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Dear Tweed Jacket',
                product_option: '[L-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 211,
                    name: '가먼츠',
                    address: 'APM 5층 9호',
                    mobiles: [
                      {
                        id: 4194,
                        phone: '01068611774',
                      },
                    ],
                  },
                  {
                    id: 4477,
                    name: '레드가먼츠',
                    address: 'APM 6층 22호',
                    mobiles: [
                      {
                        id: 5428,
                        phone: '01087699195',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '가먼츠',
                vendor_address: 'APM 5층 9',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Dear Tweed Jacket',
                product_option: '[M-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 211,
                    name: '가먼츠',
                    address: 'APM 5층 9호',
                    mobiles: [
                      {
                        id: 4194,
                        phone: '01068611774',
                      },
                    ],
                  },
                  {
                    id: 4477,
                    name: '레드가먼츠',
                    address: 'APM 6층 22호',
                    mobiles: [
                      {
                        id: 5428,
                        phone: '01087699195',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '디바영',
                vendor_address: 'APM 6층 27',
                vendor_mobile: '',
                mobile: '',
                product_name: '21 SS Mesh Knit (3color)',
                product_option: '[FREE-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [],
              },
              {
                vendor_name: '디바영',
                vendor_address: 'APM 6층 27',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Dart Overfit Long coat',
                product_option: '[FREE-Black]',
                product_count: 4,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [],
              },
              {
                vendor_name: '디바영',
                vendor_address: 'APM 6층 27',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Dear Animal Knit (3color)',
                product_option: '[FREE-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [],
              },
              {
                vendor_name: '디바영',
                vendor_address: 'APM 6층 27',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Ray Stadium Jacket(2color)',
                product_option: '[FREE-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [],
              },
              {
                vendor_name: '모네',
                vendor_address: 'APM 6층 6',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Dear Unvalanced Cutting Shirt(2color)',
                product_option: '[FREE-White]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 1387,
                    name: '레모네이드',
                    address: '기타 남대문 포키아동복 1층 105호',
                    mobiles: [
                      {
                        id: 3073,
                        phone: '01052969671',
                      },
                    ],
                  },
                  {
                    id: 1398,
                    name: '모네(mone)',
                    address: 'APM 6층 6호',
                    mobiles: [
                      {
                        id: 4076,
                        phone: '01066811617',
                      },
                    ],
                  },
                  {
                    id: 1770,
                    name: '모네(monet)',
                    address: 'APM 플레이스 3층 304호',
                    mobiles: [
                      {
                        id: 1715,
                        phone: '01038307728',
                      },
                    ],
                  },
                  {
                    id: 2041,
                    name: '모네',
                    address: '디오트 B2층 N-5',
                    mobiles: [
                      {
                        id: 893,
                        phone: '01029388374',
                      },
                    ],
                  },
                  {
                    id: 6136,
                    name: '모네(mone)',
                    address: 'APM 3층 32호',
                    mobiles: [
                      {
                        id: 8216,
                        phone: '01096501363',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ] as StoreOrderItemExcelParsing[],
        parsing_status: {
          error_messages: [],
          fail_count: 0,
          success_count: 1,
        },
      },
      msg: 'test',
    });

    expect(
      await orderAPI.createOrderExcelParsing({
        files: [file],
        request_date: moment().format('YYYY-MM-DD'),
      }),
    ).toEqual({
      data: {
        successes: [
          {
            rt_store_id: 999,
            rt_store_name: 'test',
            type: 'excel',
            orders: [
              {
                vendor_name: '플뢰르',
                vendor_address: 'APM 4층 18',
                vendor_mobile: '',
                mobile: '01043196770',
                product_name: 'Cabra Wide Cotton Pants',
                product_option: '[XS-White]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 2380,
                    name: '플뢰르',
                    address: 'APM 4층 18호',
                    mobiles: [
                      {
                        id: 2186,
                        phone: '01043196770',
                      },
                      {
                        id: 1730,
                        phone: '01038470599',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '플뢰르',
                vendor_address: 'APM 4층 18',
                vendor_mobile: '',
                mobile: '01043196770',
                product_name: 'Straight Side Bending Slacks(2color)',
                product_option: '[S-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 2380,
                    name: '플뢰르',
                    address: 'APM 4층 18호',
                    mobiles: [
                      {
                        id: 2186,
                        phone: '01043196770',
                      },
                      {
                        id: 1730,
                        phone: '01038470599',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '플뢰르',
                vendor_address: 'APM 4층 18',
                vendor_mobile: '',
                mobile: '01043196770',
                product_name: 'Wool Boots Cut Slacks(2color)',
                product_option: '[M-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 2380,
                    name: '플뢰르',
                    address: 'APM 4층 18호',
                    mobiles: [
                      {
                        id: 2186,
                        phone: '01043196770',
                      },
                      {
                        id: 1730,
                        phone: '01038470599',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '에덴',
                vendor_address: 'APM 4층 31',
                vendor_mobile: '',
                mobile: '01032905274',
                product_name: 'N Track Wide Pants(3color)',
                product_option: '[FREE-블루]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 2912,
                    name: '에덴(eden)',
                    address: 'APM 4층 31호',
                    mobiles: [
                      {
                        id: 1253,
                        phone: '01032905274',
                      },
                    ],
                  },
                  {
                    id: 3012,
                    name: '에덴(eden)',
                    address: '디오트 B2층 F-16',
                    mobiles: [
                      {
                        id: 2409,
                        phone: '01045693764',
                      },
                    ],
                  },
                  {
                    id: 3097,
                    name: '에덴(ebenezer)',
                    address: '청평화 B1층 가-7',
                    mobiles: [
                      {
                        id: 2185,
                        phone: '01043191949',
                      },
                      {
                        id: 1757,
                        phone: '01038917565',
                      },
                    ],
                  },
                  {
                    id: 3199,
                    name: '에덴',
                    address: '제일평화 1층 155호',
                    mobiles: [
                      {
                        id: 886,
                        phone: '01029325244',
                      },
                    ],
                  },
                  {
                    id: 5634,
                    name: '스튜디오에덴',
                    address: '누죤 6층 619호',
                    mobiles: [
                      {
                        id: 547,
                        phone: '01025136519',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '바론',
                vendor_address: 'APM 4층 39',
                vendor_mobile: '',
                mobile: '01086546033',
                product_name: '[썸머] Cooling Dear Knit(5color)',
                product_option: '[FREE-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 1101,
                    name: '바론(baron)',
                    address: 'APM 럭스 2층 202호',
                    mobiles: [
                      {
                        id: 6559,
                        phone: '01099031590',
                      },
                    ],
                  },
                  {
                    id: 1408,
                    name: '바론',
                    address: 'APM 4층 39호',
                    mobiles: [
                      {
                        id: 5294,
                        phone: '01086546033',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '로드',
                vendor_address: 'APM 4층 46',
                vendor_mobile: '',
                mobile: '01023231992',
                product_name: 'Semi Wide Fit String Pants(3color)',
                product_option: '[FREE-아이보리]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 186,
                    name: '로드(eastroad)',
                    address: 'APM 4층 46호',
                    mobiles: [
                      {
                        id: 388,
                        phone: '01023231992',
                      },
                    ],
                  },
                  {
                    id: 3549,
                    name: '클로드',
                    address: '디오트 4층 B-10',
                    mobiles: [
                      {
                        id: 582,
                        phone: '01025545372',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '웰던',
                vendor_address: 'APM 4층 47',
                vendor_mobile: '',
                mobile: '01044351191',
                product_name: 'Brown&Black Wide Denim Pants',
                product_option: '[M-브라운]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 2939,
                    name: '웰던',
                    address: 'APM 4층 47호',
                    mobiles: [
                      {
                        id: 2275,
                        phone: '01044351191',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '제론',
                vendor_address: 'APM 4층 5',
                vendor_mobile: '',
                mobile: '01084643120',
                product_name: 'Ice Short Kara Knit(5color)',
                product_option: '[L-Black]',
                product_count: 2,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 5211,
                    name: '제론(xeron)',
                    address: 'APM 4층 5호',
                    mobiles: [
                      {
                        id: 5125,
                        phone: '01084643120',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '오디너리',
                vendor_address: 'APM 4층 53',
                vendor_mobile: '',
                mobile: '01025798242',
                product_name: 'Unbalanced Hazzi Vest(10color)',
                product_option: '[FREE-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 2613,
                    name: '오디너리(ordinary)',
                    address: 'APM 4층 53호',
                    mobiles: [
                      {
                        id: 604,
                        phone: '01025798242',
                      },
                    ],
                  },
                  {
                    id: 5587,
                    name: '오디너리',
                    address: '디오트 4층 J-13',
                    mobiles: [
                      {
                        id: 1391,
                        phone: '01034353722',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '데자뷰',
                vendor_address: 'APM 4층 8',
                vendor_mobile: '',
                mobile: '01031445379',
                product_name: 'DJV Half-Neck Span T-Shirt(2color)',
                product_option: '[FREE-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 3024,
                    name: '데자뷰',
                    address: 'APM 4층 8호',
                    mobiles: [
                      {
                        id: 1108,
                        phone: '01031445379',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ] as StoreOrderItemExcelParsing[],
        fails: [
          {
            rt_store_id: 999,
            rt_store_name: 'test',
            type: 'excel',
            orders: [
              {
                vendor_name: '가먼츠',
                vendor_address: 'APM 5층 9',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Checker Board Two-Way Zip-Up(2color)',
                product_option: '[FREE-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 211,
                    name: '가먼츠',
                    address: 'APM 5층 9호',
                    mobiles: [
                      {
                        id: 4194,
                        phone: '01068611774',
                      },
                    ],
                  },
                  {
                    id: 4477,
                    name: '레드가먼츠',
                    address: 'APM 6층 22호',
                    mobiles: [
                      {
                        id: 5428,
                        phone: '01087699195',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '가먼츠',
                vendor_address: 'APM 5층 9',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Dear Cooling Silk Shirt(4color)',
                product_option: '[FREE-Mint]',
                product_count: 2,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 211,
                    name: '가먼츠',
                    address: 'APM 5층 9호',
                    mobiles: [
                      {
                        id: 4194,
                        phone: '01068611774',
                      },
                    ],
                  },
                  {
                    id: 4477,
                    name: '레드가먼츠',
                    address: 'APM 6층 22호',
                    mobiles: [
                      {
                        id: 5428,
                        phone: '01087699195',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '가먼츠',
                vendor_address: 'APM 5층 9',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Dear Stardium Blazer(2color)',
                product_option: '[L-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 211,
                    name: '가먼츠',
                    address: 'APM 5층 9호',
                    mobiles: [
                      {
                        id: 4194,
                        phone: '01068611774',
                      },
                    ],
                  },
                  {
                    id: 4477,
                    name: '레드가먼츠',
                    address: 'APM 6층 22호',
                    mobiles: [
                      {
                        id: 5428,
                        phone: '01087699195',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '가먼츠',
                vendor_address: 'APM 5층 9',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Dear Tweed Jacket',
                product_option: '[L-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 211,
                    name: '가먼츠',
                    address: 'APM 5층 9호',
                    mobiles: [
                      {
                        id: 4194,
                        phone: '01068611774',
                      },
                    ],
                  },
                  {
                    id: 4477,
                    name: '레드가먼츠',
                    address: 'APM 6층 22호',
                    mobiles: [
                      {
                        id: 5428,
                        phone: '01087699195',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '가먼츠',
                vendor_address: 'APM 5층 9',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Dear Tweed Jacket',
                product_option: '[M-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 211,
                    name: '가먼츠',
                    address: 'APM 5층 9호',
                    mobiles: [
                      {
                        id: 4194,
                        phone: '01068611774',
                      },
                    ],
                  },
                  {
                    id: 4477,
                    name: '레드가먼츠',
                    address: 'APM 6층 22호',
                    mobiles: [
                      {
                        id: 5428,
                        phone: '01087699195',
                      },
                    ],
                  },
                ],
              },
              {
                vendor_name: '디바영',
                vendor_address: 'APM 6층 27',
                vendor_mobile: '',
                mobile: '',
                product_name: '21 SS Mesh Knit (3color)',
                product_option: '[FREE-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [],
              },
              {
                vendor_name: '디바영',
                vendor_address: 'APM 6층 27',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Dart Overfit Long coat',
                product_option: '[FREE-Black]',
                product_count: 4,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [],
              },
              {
                vendor_name: '디바영',
                vendor_address: 'APM 6층 27',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Dear Animal Knit (3color)',
                product_option: '[FREE-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [],
              },
              {
                vendor_name: '디바영',
                vendor_address: 'APM 6층 27',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Ray Stadium Jacket(2color)',
                product_option: '[FREE-Black]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [],
              },
              {
                vendor_name: '모네',
                vendor_address: 'APM 6층 6',
                vendor_mobile: '',
                mobile: '',
                product_name: 'Dear Unvalanced Cutting Shirt(2color)',
                product_option: '[FREE-White]',
                product_count: 1,
                product_price: 0,
                order_type: 'order',
                memo: '',
                ws_store_info: [
                  {
                    id: 1387,
                    name: '레모네이드',
                    address: '기타 남대문 포키아동복 1층 105호',
                    mobiles: [
                      {
                        id: 3073,
                        phone: '01052969671',
                      },
                    ],
                  },
                  {
                    id: 1398,
                    name: '모네(mone)',
                    address: 'APM 6층 6호',
                    mobiles: [
                      {
                        id: 4076,
                        phone: '01066811617',
                      },
                    ],
                  },
                  {
                    id: 1770,
                    name: '모네(monet)',
                    address: 'APM 플레이스 3층 304호',
                    mobiles: [
                      {
                        id: 1715,
                        phone: '01038307728',
                      },
                    ],
                  },
                  {
                    id: 2041,
                    name: '모네',
                    address: '디오트 B2층 N-5',
                    mobiles: [
                      {
                        id: 893,
                        phone: '01029388374',
                      },
                    ],
                  },
                  {
                    id: 6136,
                    name: '모네(mone)',
                    address: 'APM 3층 32호',
                    mobiles: [
                      {
                        id: 8216,
                        phone: '01096501363',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ] as StoreOrderItemExcelParsing[],
        parsing_status: {
          error_messages: [],
          fail_count: 0,
          success_count: 1,
        },
      },
      msg: 'test',
    });
  });
});

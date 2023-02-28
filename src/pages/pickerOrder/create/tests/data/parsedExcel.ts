import { StoreOrderItemExcelParsing } from '@apis/orderAPI';

const parsedExcelData = () => ({
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
          {
            vendor_name: '데자뷰',
            vendor_address: 'APM 4층 8',
            vendor_mobile: '',
            mobile: '01031445379',
            product_name: 'DJV Half-Neck Span T-Shirt(2color)',
            product_option: '[FREE-White]',
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
          {
            vendor_name: '미네뜨',
            vendor_address: 'APM 5층 23',
            vendor_mobile: '',
            mobile: '01085881649',
            product_name: 'Linen Tape Pants(4color)',
            product_option: '[FREE-Begie]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 6535,
                name: '미네뜨(minette)',
                address: 'APM 5층 23호',
                mobiles: [
                  {
                    id: 9711,
                    phone: '01085881649',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '리바이브',
            vendor_address: 'APM 5층 26',
            vendor_mobile: '',
            mobile: '01091860188',
            product_name: 'Dear Basic Cotton Shirt(2color)',
            product_option: '[L-White]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 252,
                name: '리바이브',
                address: 'APM 5층 26호',
                mobiles: [
                  {
                    id: 5955,
                    phone: '01091860188',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '오아시스',
            vendor_address: 'APM 5층 31',
            vendor_mobile: '',
            mobile: '01083020840',
            product_name: 'Dear Racer Jacket (3color)',
            product_option: '[FREE-Black]',
            product_count: 2,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 6454,
                name: '오아시스(oasis)',
                address: '퀸즈스퀘어 3층 193호',
                mobiles: [
                  {
                    id: 8655,
                    phone: '01096110108',
                  },
                ],
              },
              {
                id: 7564,
                name: '오아시스(oasis)',
                address: 'APM 5층 31호',
                mobiles: [
                  {
                    id: 9750,
                    phone: '01083020840',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '오아시스',
            vendor_address: 'APM 5층 31',
            vendor_mobile: '',
            mobile: '01083020840',
            product_name: 'Dear Racer Jacket (3color)',
            product_option: '[FREE-Green]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 6454,
                name: '오아시스(oasis)',
                address: '퀸즈스퀘어 3층 193호',
                mobiles: [
                  {
                    id: 8655,
                    phone: '01096110108',
                  },
                ],
              },
              {
                id: 7564,
                name: '오아시스(oasis)',
                address: 'APM 5층 31호',
                mobiles: [
                  {
                    id: 9750,
                    phone: '01083020840',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '오아시스',
            vendor_address: 'APM 5층 31',
            vendor_mobile: '',
            mobile: '01083020840',
            product_name: 'Dear Racer Jacket (3color)',
            product_option: '[FREE-Red]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 6454,
                name: '오아시스(oasis)',
                address: '퀸즈스퀘어 3층 193호',
                mobiles: [
                  {
                    id: 8655,
                    phone: '01096110108',
                  },
                ],
              },
              {
                id: 7564,
                name: '오아시스(oasis)',
                address: 'APM 5층 31호',
                mobiles: [
                  {
                    id: 9750,
                    phone: '01083020840',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '더크로스',
            vendor_address: 'APM 5층 33',
            vendor_mobile: '',
            mobile: '01051173428',
            product_name: '4007 Ash Boot-Cut Denim',
            product_option: '[L-Ash Blue]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 227,
                name: '더크로스',
                address: 'APM 5층 33호',
                mobiles: [
                  {
                    id: 10046,
                    phone: '01051173428',
                  },
                  {
                    id: 4042,
                    phone: '01066408007',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '더크로스',
            vendor_address: 'APM 5층 33',
            vendor_mobile: '',
            mobile: '01051173428',
            product_name: 'The Cross Knee Cutting Denim(3color)',
            product_option: '[M-중청]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 227,
                name: '더크로스',
                address: 'APM 5층 33호',
                mobiles: [
                  {
                    id: 10046,
                    phone: '01051173428',
                  },
                  {
                    id: 4042,
                    phone: '01066408007',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '엠지',
            vendor_address: 'APM 5층 41',
            vendor_mobile: '',
            mobile: '01097670260',
            product_name: 'Dear Laurent Diss Jean',
            product_option: '[M-중청]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 1933,
                name: '오엠지(omg)',
                address: '디오트 2층 J-28',
                mobiles: [
                  {
                    id: 4773,
                    phone: '01077315478',
                  },
                ],
              },
              {
                id: 2947,
                name: '엠지',
                address: 'APM 5층 41호',
                mobiles: [
                  {
                    id: 6449,
                    phone: '01097670260',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '엠지',
            vendor_address: 'APM 5층 41',
            vendor_mobile: '',
            mobile: '01097670260',
            product_name: 'Raw Semi-Wide Slacks(2color)',
            product_option: '[S-Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 1933,
                name: '오엠지(omg)',
                address: '디오트 2층 J-28',
                mobiles: [
                  {
                    id: 4773,
                    phone: '01077315478',
                  },
                ],
              },
              {
                id: 2947,
                name: '엠지',
                address: 'APM 5층 41호',
                mobiles: [
                  {
                    id: 6449,
                    phone: '01097670260',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '티디에이치',
            vendor_address: 'APM 6층 12',
            vendor_mobile: '01063265639',
            mobile: '01063265639',
            product_name: 'Dear Coating Jean',
            product_option: '[M-Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 202,
                name: '티디에이치(t.d.h)',
                address: 'APM 6층 12호',
                mobiles: [
                  {
                    id: 3758,
                    phone: '01063265639',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '티디에이치',
            vendor_address: 'APM 6층 12',
            vendor_mobile: '01063265639',
            mobile: '01063265639',
            product_name: 'Dear Coating Jean',
            product_option: '[S-Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 202,
                name: '티디에이치(t.d.h)',
                address: 'APM 6층 12호',
                mobiles: [
                  {
                    id: 3758,
                    phone: '01063265639',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '블루버킷',
            vendor_address: 'APM 6층 24',
            vendor_mobile: '',
            mobile: '01032302098',
            product_name: 'Wing V-neck Knit(3color)',
            product_option: '[FREE-Brown]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 1424,
                name: '블루버킷(bluebucket)',
                address: 'APM 6층 24호',
                mobiles: [
                  {
                    id: 1196,
                    phone: '01032302098',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '이븐앤오드',
            vendor_address: 'APM 6층 28',
            vendor_mobile: '',
            mobile: '01044040977',
            product_name: 'Dear Erpel Blazer(2color)',
            product_option: '[M-Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 2494,
                name: '이븐앤오드',
                address: 'APM 6층 28호',
                mobiles: [
                  {
                    id: 2246,
                    phone: '01044040977',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '이븐앤오드',
            vendor_address: 'APM 6층 28',
            vendor_mobile: '',
            mobile: '01044040977',
            product_name: 'Luce V-neck knit(2color)',
            product_option: '[Black-FREE]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 2494,
                name: '이븐앤오드',
                address: 'APM 6층 28호',
                mobiles: [
                  {
                    id: 2246,
                    phone: '01044040977',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '비컴',
            vendor_address: 'APM 7층 19',
            vendor_mobile: '',
            mobile: '01092765626',
            product_name: '[린넨] Linen Over Short Shrit(7color)',
            product_option: '[FREE-White]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 2158,
                name: '비컴',
                address: '디오트 5층 H-1',
                mobiles: [
                  {
                    id: 1894,
                    phone: '01040442482',
                  },
                ],
              },
              {
                id: 5116,
                name: '비컴(become)',
                address: 'APM 7층 19호',
                mobiles: [
                  {
                    id: 8321,
                    phone: '01092765626',
                  },
                  {
                    id: 2039,
                    phone: '01041630703',
                  },
                ],
              },
              {
                id: 5121,
                name: '비컴(become)',
                address: '청평화 3층 나-41',
                mobiles: [
                  {
                    id: 1268,
                    phone: '01033072464',
                  },
                  {
                    id: 1246,
                    phone: '01032792464',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '루틴',
            vendor_address: '남평화 3층 23',
            vendor_mobile: '',
            mobile: '01054603390',
            product_name: 'Paul Cable Half Zip-Up Knit(5color)',
            product_option: '[M-Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 6169,
                name: '루틴(routine)',
                address: 'APM 럭스 B1층 129호',
                mobiles: [
                  {
                    id: 8258,
                    phone: '01022398802',
                  },
                  {
                    id: 8257,
                    phone: '01026962076',
                  },
                ],
              },
              {
                id: 6172,
                name: '루틴(routine)',
                address: '남평화 3층 23호',
                mobiles: [
                  {
                    id: 8261,
                    phone: '01054603390',
                  },
                ],
              },
              {
                id: 6731,
                name: '루틴(routine)',
                address: 'APM 3층 7호',
                mobiles: [
                  {
                    id: 9024,
                    phone: '01030859902',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '유앤아이',
            vendor_address: '남평화 3층 46',
            vendor_mobile: '01024484015',
            mobile: '01024484015',
            product_name: 'Washing Bootscut Slit Pants(2color)',
            product_option: '[FREE-Black]',
            product_count: 2,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 4217,
                name: '유앤아이',
                address: '남평화 3층 46호',
                mobiles: [
                  {
                    id: 498,
                    phone: '01024484015',
                  },
                ],
              },
              {
                id: 4327,
                name: '유앤아이(uni)',
                address: '청평화 4층 D-25',
                mobiles: [
                  {
                    id: 6411,
                    phone: '01097328070',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '유앤아이',
            vendor_address: '남평화 3층 46',
            vendor_mobile: '01024484015',
            mobile: '01024484015',
            product_name: 'Washing Bootscut Slit Pants(2color)',
            product_option: '[FREE-Gray]',
            product_count: 8,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 4217,
                name: '유앤아이',
                address: '남평화 3층 46호',
                mobiles: [
                  {
                    id: 498,
                    phone: '01024484015',
                  },
                ],
              },
              {
                id: 4327,
                name: '유앤아이(uni)',
                address: '청평화 4층 D-25',
                mobiles: [
                  {
                    id: 6411,
                    phone: '01097328070',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '메바',
            vendor_address: '남평화 지하1층 신관 21',
            vendor_mobile: '',
            mobile: '01099880231',
            product_name: 'Crocker Chain Crossback',
            product_option: '[FREE-Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 1913,
                name: '메바',
                address: '남평화 B1층 신관-20',
                mobiles: [
                  {
                    id: 6681,
                    phone: '01099880231',
                  },
                ],
              },
              {
                id: 2260,
                name: '아메바(amoeba)',
                address: '디오트 2층 C-3',
                mobiles: [
                  {
                    id: 1076,
                    phone: '01031249366',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '솔로몬',
            vendor_address: '누존 3층 121',
            vendor_mobile: '',
            mobile: '01055882625',
            product_name: 'Dear Automatic Necktie',
            product_option: '[FREE-Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 1763,
                name: '솔로몬',
                address: '누죤 3층 121호',
                mobiles: [
                  {
                    id: 3350,
                    phone: '01055882625',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '베일',
            vendor_address: '누존 5층 114',
            vendor_mobile: '',
            mobile: '01084088321',
            product_name: 'Bless String MtoM(5color)',
            product_option: '[FREE-Green]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 60,
                name: '프리베일나인(prevail9nine)',
                address: '청평화 B1층 나-1',
                mobiles: [
                  {
                    id: 897,
                    phone: '01029428423',
                  },
                ],
              },
              {
                id: 207,
                name: '언베일링(unveiling)',
                address: 'APM 5층 53호',
                mobiles: [
                  {
                    id: 2137,
                    phone: '01042520225',
                  },
                ],
              },
              {
                id: 6632,
                name: '베일(veil)',
                address: '누죤 5층 114호',
                mobiles: [
                  {
                    id: 8894,
                    phone: '01084088321',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '넥스트',
            vendor_address: '누존 5층 207',
            vendor_mobile: '01053271355',
            mobile: '01053271355',
            product_name: 'Triangle Buckle Belt',
            product_option: '[Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 71,
                name: '넥스트',
                address: '누죤 5층 208호',
                mobiles: [
                  {
                    id: 3105,
                    phone: '01053271355',
                  },
                ],
              },
              {
                id: 7336,
                name: '땡큐넥스트(thanku,next)',
                address: '디오트 2층 G-21',
                mobiles: [
                  {
                    id: 9485,
                    phone: '01056301541',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '뉴본',
            vendor_address: '누존 6층 132',
            vendor_mobile: '',
            mobile: '01086050940',
            product_name: 'New born Two-Tone Denim Pants(2color)',
            product_option: '[S-DarkBlue]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 7417,
                name: '뉴본',
                address: '누죤 6층 525호',
                mobiles: [
                  {
                    id: 9588,
                    phone: '01086050940',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '와이브랜드',
            vendor_address: '누존 6층 204',
            vendor_mobile: '',
            mobile: '01042670234',
            product_name: 'S/S Cable Kara Knit(5color)',
            product_option: '[FREE-Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 3536,
                name: '와이브랜드',
                address: '누죤 6층 202호',
                mobiles: [
                  {
                    id: 2156,
                    phone: '01042670234',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '보이드',
            vendor_address: '누존 6층 321',
            vendor_mobile: '',
            mobile: '01029376321',
            product_name: 'Two-pocket milkys Shirt(3color)',
            product_option: '[FREE-White]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 1744,
                name: '보이드',
                address: '누죤 6층 321호',
                mobiles: [
                  {
                    id: 892,
                    phone: '01029376321',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '말렌키',
            vendor_address: '누존 6층 325',
            vendor_mobile: '01076435882',
            mobile: '01076435882',
            product_name: 'Cashmere Double Long Coat(2color)',
            product_option: '[FREE-Ivory]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 4235,
                name: '말렌키',
                address: '누죤 6층 325호',
                mobiles: [
                  {
                    id: 4708,
                    phone: '01076435882',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '말렌키',
            vendor_address: '누존 6층 325',
            vendor_mobile: '01076435882',
            mobile: '01076435882',
            product_name: 'Retro See-Through Cardigan(2color)',
            product_option: '[FREE-Ivory]',
            product_count: 2,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 4235,
                name: '말렌키',
                address: '누죤 6층 325호',
                mobiles: [
                  {
                    id: 4708,
                    phone: '01076435882',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '시옷',
            vendor_address: '누존 6층 420',
            vendor_mobile: '',
            mobile: '01064367313',
            product_name: 'Cutting Tweed Jacket',
            product_option: '[L-Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 4980,
                name: '시옷(seeot)',
                address: '누죤 6층 420호',
                mobiles: [
                  {
                    id: 3880,
                    phone: '01064367313',
                  },
                  {
                    id: 1105,
                    phone: '01031419288',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '시옷',
            vendor_address: '누존 6층 420',
            vendor_mobile: '',
            mobile: '01064367313',
            product_name: 'Cutting Tweed Jacket',
            product_option: '[M-Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 4980,
                name: '시옷(seeot)',
                address: '누죤 6층 420호',
                mobiles: [
                  {
                    id: 3880,
                    phone: '01064367313',
                  },
                  {
                    id: 1105,
                    phone: '01031419288',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '시옷',
            vendor_address: '누존 6층 420',
            vendor_mobile: '',
            mobile: '01064367313',
            product_name: 'Dear Trend Tweed Jacket',
            product_option: '[L-Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 4980,
                name: '시옷(seeot)',
                address: '누죤 6층 420호',
                mobiles: [
                  {
                    id: 3880,
                    phone: '01064367313',
                  },
                  {
                    id: 1105,
                    phone: '01031419288',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '스케치',
            vendor_address: '누존 6층 429',
            vendor_mobile: '',
            mobile: '01066988444',
            product_name: 'Sketch Mohair Cardigan(2color)',
            product_option: '[FREE-Gray]',
            product_count: 2,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 1892,
                name: '스케치인러브',
                address: '신발상가C동 1층 25호',
                mobiles: [
                  {
                    id: 802,
                    phone: '01028334335',
                  },
                ],
              },
              {
                id: 3164,
                name: '화이트스케치북',
                address: '기타 서울특별시 성북구 안암로9가길',
                mobiles: [
                  {
                    id: 4322,
                    phone: '01071578102',
                  },
                ],
              },
              {
                id: 3215,
                name: '스케치(sketch)',
                address: '누죤 6층 429호',
                mobiles: [
                  {
                    id: 4097,
                    phone: '01066988444',
                  },
                ],
              },
              {
                id: 6328,
                name: '양말스케치',
                address: '기타 경기도 시흥시 문화마을로2번길 17-1',
                mobiles: [
                  {
                    id: 8469,
                    phone: '01058504936',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '식코스',
            vendor_address: '누존 6층 501',
            vendor_mobile: '',
            mobile: '01092960465',
            product_name: 'New Daddy Check Blazer(3color)',
            product_option: '[FREE-Check]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 3193,
                name: '식코스(구식보이즈)',
                address: '누죤 6층 501호',
                mobiles: [
                  {
                    id: 6094,
                    phone: '01092960465',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '식코스',
            vendor_address: '누존 6층 501',
            vendor_mobile: '',
            mobile: '01092960465',
            product_name: 'ST Double Shirt Jacket(3color)',
            product_option: '[FREE-네이비]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 3193,
                name: '식코스(구식보이즈)',
                address: '누죤 6층 501호',
                mobiles: [
                  {
                    id: 6094,
                    phone: '01092960465',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '짱구',
            vendor_address: '누존 6층 607',
            vendor_mobile: '01091985004',
            mobile: '01091985004',
            product_name: '[250-280]Dear Sharksoll Converse High',
            product_option: '[270-White]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 2546,
                name: '짱구(y.s.h)',
                address: '누죤 6층 607호',
                mobiles: [
                  {
                    id: 5975,
                    phone: '01091985004',
                  },
                  {
                    id: 3578,
                    phone: '01059125004',
                  },
                ],
              },
              {
                id: 3039,
                name: '짱구',
                address: '남평화 1층 66호',
                mobiles: [
                  {
                    id: 3701,
                    phone: '01062782924',
                  },
                ],
              },
              {
                id: 4367,
                name: '짱구',
                address: '동평화 2층 가-30',
                mobiles: [
                  {
                    id: 952,
                    phone: '01029950207',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '위켄드',
            vendor_address: '누존 6층 613',
            vendor_mobile: '01021682323',
            mobile: '01021682323',
            product_name: 'Dear sky strip shirt',
            product_option: '[FREE-Skyblue]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 1415,
                name: '뱀파이어위켄드',
                address: 'APM 4층 15호',
                mobiles: [
                  {
                    id: 1149,
                    phone: '01031842450',
                  },
                ],
              },
              {
                id: 2065,
                name: '위켄드',
                address: '누죤 6층 613호',
                mobiles: [
                  {
                    id: 241,
                    phone: '01021682323',
                  },
                ],
              },
              {
                id: 6537,
                name: '더위켄드(theweeknd)',
                address: 'APM 럭스 1층 123호',
                mobiles: [
                  {
                    id: 8748,
                    phone: '01034482179',
                  },
                ],
              },
              {
                id: 7079,
                name: '먼데이위켄드(mondayweekend)',
                address: 'APM 플레이스 5층 525호',
                mobiles: [
                  {
                    id: 9189,
                    phone: '01088601885',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '모드',
            vendor_address: '누존 6층 614',
            vendor_mobile: '',
            mobile: '01074446614',
            product_name: 'S/S Stitch Cardigan(3color)',
            product_option: '[FREE-Green]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 48,
                name: '아라모드',
                address: '디오트 4층 I-14',
                mobiles: [
                  {
                    id: 530,
                    phone: '01024911827',
                  },
                ],
              },
              {
                id: 382,
                name: '헤르모드(hermod)',
                address: '디오트 B1층 F-3',
                mobiles: [
                  {
                    id: 1494,
                    phone: '01035888074',
                  },
                ],
              },
              {
                id: 572,
                name: '더모드9(themode9)',
                address: '디오트 3층 J-28',
                mobiles: [
                  {
                    id: 1301,
                    phone: '01033396223',
                  },
                ],
              },
              {
                id: 1469,
                name: '모드니',
                address: '디오트 2층 B-9',
                mobiles: [
                  {
                    id: 847,
                    phone: '01028932063',
                  },
                ],
              },
              {
                id: 1646,
                name: '모드',
                address: '청평화 5층 라-43',
                mobiles: [
                  {
                    id: 5956,
                    phone: '01091882738',
                  },
                ],
              },
              {
                id: 2077,
                name: '모드(mode)',
                address: '기타 남대문 쥬얼파크 1층 155호',
                mobiles: [
                  {
                    id: 4261,
                    phone: '01071209157',
                  },
                ],
              },
              {
                id: 2751,
                name: '온더모드(onthemode)',
                address: '퀸즈스퀘어 3층 3호',
                mobiles: [
                  {
                    id: 744,
                    phone: '01027672244',
                  },
                ],
              },
              {
                id: 2828,
                name: '모드',
                address: '벨포스트 2층 283호',
                mobiles: [
                  {
                    id: 4665,
                    phone: '01075808900',
                  },
                ],
              },
              {
                id: 3284,
                name: '블랙모드(blackmode)',
                address: '퀸즈스퀘어 4층 421호',
                mobiles: [
                  {
                    id: 269,
                    phone: '01022057395',
                  },
                ],
              },
              {
                id: 5829,
                name: '코드인모드(codeinmode)',
                address: '청평화 4층 C-16',
                mobiles: [
                  {
                    id: 5227,
                    phone: '01086040416',
                  },
                ],
              },
              {
                id: 6075,
                name: '라인(모드)',
                address: '신평화 3B층 27호',
                mobiles: [
                  {
                    id: 5887,
                    phone: '01091325227',
                  },
                ],
              },
              {
                id: 6255,
                name: '어울림모드',
                address: '신평화 3A층 61호',
                mobiles: [
                  {
                    id: 8377,
                    phone: '01062396575',
                  },
                ],
              },
              {
                id: 6726,
                name: '라모드(lamode)',
                address: '신발상가C동 3층 나-32',
                mobiles: [
                  {
                    id: 9022,
                    phone: '01090907045',
                  },
                ],
              },
              {
                id: 6767,
                name: '모드(mode)',
                address: '누죤 6층 614호',
                mobiles: [
                  {
                    id: 9067,
                    phone: '01074446614',
                  },
                ],
              },
              {
                id: 7464,
                name: '모드니(modney)',
                address: '디오트 4층 C-22',
                mobiles: [
                  {
                    id: 9641,
                    phone: '01057058466',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '피인오',
            vendor_address: '누존 6층 621',
            vendor_mobile: '',
            mobile: '01076656066',
            product_name: '3400 Side Cutting Slacks(3color)',
            product_option: '[L-Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 2611,
                name: '피노(구.피인오)',
                address: '누죤 6층 621호',
                mobiles: [
                  {
                    id: 4725,
                    phone: '01076656066',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '피인오',
            vendor_address: '누존 6층 621',
            vendor_mobile: '',
            mobile: '01076656066',
            product_name: 'Dear Slim Wide Slacks(11color)',
            product_option: '[S-Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 2611,
                name: '피노(구.피인오)',
                address: '누죤 6층 621호',
                mobiles: [
                  {
                    id: 4725,
                    phone: '01076656066',
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
          {
            vendor_name: '모네',
            vendor_address: 'APM 6층 6',
            vendor_mobile: '',
            mobile: '',
            product_name: 'Deon Double Jacket Set-Up 상의',
            product_option: '[블랙-L]',
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
          {
            vendor_name: '모네',
            vendor_address: 'APM 6층 6',
            vendor_mobile: '',
            mobile: '',
            product_name: 'Deon Double Jacket Set-Up 하의',
            product_option: '[블랙-S]',
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
          {
            vendor_name: '모네',
            vendor_address: 'APM 6층 6',
            vendor_mobile: '',
            mobile: '',
            product_name: 'Lake Stripe Half Shirt(2color)',
            product_option: '[FREE-Black]',
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
          {
            vendor_name: '마블',
            vendor_address: '남평화 2층 139',
            vendor_mobile: '',
            mobile: '',
            product_name: 'Line Wide Sweat Pants(2color)',
            product_option: '[L-Gray]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [
              {
                id: 458,
                name: '마블(marvel)',
                address: '디오트 4층 I-5',
                mobiles: [
                  {
                    id: 1288,
                    phone: '01033324648',
                  },
                ],
              },
              {
                id: 1638,
                name: '마블러스',
                address: '청평화 5층 가-8',
                mobiles: [
                  {
                    id: 4271,
                    phone: '01071300589',
                  },
                ],
              },
              {
                id: 7121,
                name: '마블',
                address: '남평화 3층 57호',
                mobiles: [
                  {
                    id: 9237,
                    phone: '01038092644',
                  },
                ],
              },
              {
                id: 7558,
                name: '마블',
                address: '남평화 2층 138호 138~139호',
                mobiles: [
                  {
                    id: 9739,
                    phone: '01025567025',
                  },
                ],
              },
            ],
          },
          {
            vendor_name: '웨더스토어',
            vendor_address: '누존 5층 209',
            vendor_mobile: '',
            mobile: '',
            product_name: 'Weather Short Sleeve Cardigan(4color)',
            product_option: '[FREE-Black]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [],
          },
          {
            vendor_name: '웨더스토어',
            vendor_address: '누존 5층 209',
            vendor_mobile: '',
            mobile: '',
            product_name: 'Weather Short Sleeve Cardigan(4color)',
            product_option: '[FREE-Green]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [],
          },
          {
            vendor_name: '스타일EA',
            vendor_address: '누존 5층 509',
            vendor_mobile: '',
            mobile: '',
            product_name: 'DearMine Signature Bag',
            product_option: '[FREE-White]',
            product_count: 1,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [],
          },
          {
            vendor_name: '엣코너',
            vendor_address: '누존 6층 231',
            vendor_mobile: '',
            mobile: '',
            product_name: 'Moment Waffle See-Through Knit(4color)',
            product_option: '[FREE-Sora]',
            product_count: 2,
            product_price: 0,
            order_type: 'order',
            memo: '',
            ws_store_info: [],
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

export { parsedExcelData };

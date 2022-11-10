import adjustmentAPI from '@apis/adjustmentAPI';
import clearingAPI from '@apis/clearingAPI';
import productAPI from '@apis/productAPI';
import vendorAPI from '@apis/vendorAPI';
import warehousingAPI from '@apis/warehousingAPI';
import { css } from '@emotion/react';
import useStore from '@hooks/useStore';
import { theme } from '@styles/theme';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { useQuery } from 'react-query';

const stage = {
  vendor: 16,
  product: 32,
  warehousing: 48,
  adjustment: 64,
  requestClearing: 80,
  completedClearing: 100,
};

const isToday = (date: string) => {
  if (date === '') return;
  return moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
};

function ProgressBar() {
  const { store } = useStore();
  const [gage, setGage] = useState(0);

  // 거래처 리스트 불러오기 요청
  const getVendorListQuery = useQuery(
    ['getVendorListQuery', store.selected?.id],
    () =>
      vendorAPI.get({
        rt_store_id: store.selected?.id,
        search_string: '',
        page: 1,
      }),
    {
      onSuccess: (data) => {
        if (!isToday(data?.data.vendor_list[0]?.created_time ?? '')) return;
        setGage((gage) => (gage < stage.vendor ? stage.vendor : gage));
      },
      enabled: !!store.selected?.id,
    },
  );

  // 상품 리스트 불러오기 요청
  const getProductListQuery = useQuery(
    ['getProductListQuery', store.selected?.id],
    () =>
      productAPI.getList({
        rt_store_id: store.selected?.id,
        search_string: '',
        page: 1,
      }),
    {
      onSuccess: (data) => {
        // 시간순 정렬
        data?.data.product_list.sort(
          (a, b) =>
            moment(b.created_time).valueOf() - moment(a.created_time).valueOf(),
        );
        if (!isToday(data?.data.product_list[0]?.created_time ?? '')) return;
        setGage((gage) => (gage < stage.product ? stage.product : gage));
      },
      enabled: !!store.selected?.id,
    },
  );

  // 당일 입고장 리스트 요청
  const getWarehousingSheetQuery = useQuery(
    ['getWarehousingSheetQuery', store.selected?.id],
    () =>
      warehousingAPI.getSheet({
        rt_store_id: Number(store.selected?.id),
        is_confirmed: '',
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        page: 1,
      }),
    {
      onSuccess: (data) => {
        if (!isToday(data?.sheet_list[0]?.created_time ?? '')) return;
        setGage((gage) =>
          gage < stage.warehousing ? stage.warehousing : gage,
        );
      },
      enabled: !!store.selected?.id,
    },
  );

  // 당일 매입조정 리스트 요청
  const getAdjustmentListQuery = useQuery(
    ['getAdjustmentListQuery', store.selected?.id],
    () =>
      adjustmentAPI.getList({
        is_cleared: '',
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        rt_store_id: store.selected?.id as number,
      }),
    {
      onSuccess: (data) => {
        if (!isToday(data.data.adjustment_list[0]?.created_date ?? '')) return;
        setGage((gage) => (gage < stage.adjustment ? stage.adjustment : gage));
      },
      enabled: !!store.selected?.id,
    },
  );

  // 당일 정산서 리스트 요청
  const getClearingSheetQuery = useQuery(
    ['getClearingSheetQuery', store.selected?.id],
    () =>
      clearingAPI.getSheet({
        credit_type: 'general',
        start_date: moment().format('YYYY-MM-DD'),
        end_date: moment().format('YYYY-MM-DD'),
        status: 'all',
        store_id: store.selected?.id as number,
        page_size: 1000,
      }),
    {
      onSuccess: (data) => {
        if (!isToday(data.data.sheet_list[0]?.created_time ?? '')) return;
        data.data.sheet_list[0].status === 'complete'
          ? setGage(stage.completedClearing)
          : setGage(stage.requestClearing);
      },
      enabled: !!store.selected?.id,
    },
  );

  const handleDescription = () => {
    if (gage < stage.vendor) return '자! 거래처 등록부터 시작해볼까요? 🔥';
    if (gage < stage.product) return '상품 등록은 하셨나요? 😳';
    if (gage < stage.warehousing)
      return '입고된 상품도 빠짐없이 등록해주세요! 🥸';
    if (gage < stage.adjustment)
      return '교환/반품/미송 상품이 있지는 않나요? 🧐';
    if (gage < stage.requestClearing)
      return '오늘 거래처 결제금액은 얼마일까요? 🤔';
    if (gage < stage.completedClearing)
      return '터틀체인이 이체여부를 확인하고 있어요! 💸';
    if (gage === stage.completedClearing)
      return '오늘 업무 끝! 퇴근하고 치맥은 어떄요? 🍺';
  };

  useEffect(() => {
    setGage(1);
  }, [store.selected?.id]);

  return (
    <>
      <div css={description}>{handleDescription()}</div>

      <div css={barCss.gageMask}>
        <div
          css={barCss.gageCss.content}
          style={{
            ['--width' as string]: `${gage}%`,
          }}
        >
          <div css={barCss.gageCss.pointBg}>
            <div css={barCss.gageCss.point} />
          </div>
        </div>
      </div>

      <div css={textContainer}>
        <span>거래처등록</span>
        <span>상품등록</span>
        <span>입고등록</span>
        <span>교환/반품/미송</span>
        <span>결제하기</span>
        <span>이체하기</span>
      </div>
    </>
  );
}

const description = css({
  marginTop: 60,
  padding: '11px 16px',
  backgroundColor: '#F0F3F6',
  borderRadius: 8,
  fontWeight: 500,
  fontSize: 16,
});

const barCss = {
  gageMask: css({
    marginTop: 48,
    width: 720,
    height: 12,
    backgroundColor: '#F0F3F6',
    borderRadius: 20,
  }),

  gageCss: {
    content: css({
      width: 'var(--width)',
      height: '100%',
      background: '#13BCB2',
      borderRadius: 20,
      position: 'relative',
    }),
    pointBg: css({
      height: 28,
      width: 28,
      background: 'rgba(0,179,190,0.2)',
      borderRadius: '50%',
      position: 'absolute',
      top: 0,
      right: 0,
      transform: 'translate(28%,-28%)',
    }),
    point: css({
      height: 12,
      width: 12,
      backgroundColor: '#1A8180',
      borderRadius: '50%',
      transform: 'translate(68%,65%)',
    }),
  },
};

const textContainer = css({
  marginTop: 16,
  display: 'flex',
  justifyContent: 'center',
  gap: 60,
  color: theme.grey400,
  fontSize: 13,
});

export default ProgressBar;

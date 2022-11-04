import useClearingCart from '@hooks/useClearingCart';
import balanceData from './balanceData.json';
import broneBalance from './broneBalance.json';
import broneBalance2 from './broneBalance2.json';
import { act, renderHook } from '@testing-library/react-hooks';
import { ClearingInfo } from '@apis/clearingAPI';
import { RecoilRoot } from 'recoil';

describe('clearingCart separate 함수 테스트', () => {
  // hook 세팅
  const { result } = renderHook(useClearingCart, {
    // recoil 환경 설정
    wrapper: RecoilRoot,
  });

  // 함수 실행
  act(() => {
    result.current.separate(balanceData.item_list as ClearingInfo[]);
    // 매입조정 전액 입력하기 클릭
    result.current.fillAllAdjustmentSubtract();
    // 다음 버튼 클릭
    result.current.calculateClearingAmount();
  });

  it('당일 미송 filter', () => {
    expect(result.current.cart.reserveSubtractList.length).toBe(3);
  });
  it('미송 차감 filter', () => {
    expect(result.current.cart.reserveSubtractList.length).toBe(3);
  });
  it('매입 차감 filter', () => {
    expect(result.current.cart.adjustmentSubtractList.length).toBe(1);
  });
  it('당일 결제 합계 test', () => {
    expect(result.current.clearingPaymentTotal).toBe(132000);
  });
});

describe('당일 결제 합계 test', () => {
  // hook 세팅
  const { result } = renderHook(useClearingCart, {
    // recoil 환경 설정
    wrapper: RecoilRoot,
  });

  // 함수 실행
  act(() => {
    result.current.separate(balanceData.item_list as ClearingInfo[]);
    // 매입조정 전액 입력하기 클릭
    result.current.fillAllAdjustmentSubtract();
    // 다음 버튼 클릭
    result.current.calculateClearingAmount();
    // 전액 입력하기 버튼 클릭
    result.current.fillAllClearingAmount();
  });

  it('전체 입력후 당일 결제 합계 test', () => {
    expect(result.current.clearingPaymentTotal).toBe(12140000);
  });
});

describe('브론 데이터 테스트', () => {
  const { result } = renderHook(useClearingCart, {
    // recoil 환경 설정
    wrapper: RecoilRoot,
  });

  // 함수 실행
  act(() => {
    result.current.separate(broneBalance.item_list as ClearingInfo[]);
    // 매입조정 전액 입력하기 클릭
    result.current.fillAllAdjustmentSubtract();
    // 다음 버튼 클릭
    result.current.calculateClearingAmount();
  });

  it('당일 결제 합계 test', () => {
    expect(result.current.clearingPaymentTotal).toBe(0);
  });
});

describe('브론 데이터 테스트 결제합계', () => {
  const { result } = renderHook(useClearingCart, {
    // recoil 환경 설정
    wrapper: RecoilRoot,
  });

  // 함수 실행
  act(() => {
    result.current.separate(broneBalance.item_list as ClearingInfo[]);
    // 매입조정 전액 입력하기 클릭
    result.current.fillAllAdjustmentSubtract();
    // 다음 버튼 클릭
    result.current.calculateClearingAmount();
    // 전액 입력하기 버튼 클릭
    result.current.fillAllClearingAmount();
  });

  it('당일 결제 합계 test', () => {
    expect(result.current.clearingPaymentTotal).toBe(1716000);
  });
});

describe('브론 데이터 테스트 2', () => {
  const { result } = renderHook(useClearingCart, {
    // recoil 환경 설정
    wrapper: RecoilRoot,
  });

  // 함수 실행
  act(() => {
    result.current.separate(broneBalance2.item_list as ClearingInfo[]);
    // 매입조정 전액 입력하기 클릭
    result.current.fillAllAdjustmentSubtract();
    // 다음 버튼 클릭
    result.current.calculateClearingAmount();
  });

  it('당일 결제 합계 test', () => {
    expect(result.current.clearingPaymentTotal).toBe(156000);
  });
});

describe('브론 데이터 테스트 결제합계2', () => {
  const { result } = renderHook(useClearingCart, {
    // recoil 환경 설정
    wrapper: RecoilRoot,
  });

  // 함수 실행
  act(() => {
    result.current.separate(broneBalance2.item_list as ClearingInfo[]);
    // 매입조정 전액 입력하기 클릭
    result.current.fillAllAdjustmentSubtract();
    // 다음 버튼 클릭
    result.current.calculateClearingAmount();
    // 전액 입력하기 버튼 클릭
    result.current.fillAllClearingAmount();
  });

  it('당일 결제 합계 test', () => {
    expect(result.current.clearingPaymentTotal).toBe(1716000);
  });
});
export {};

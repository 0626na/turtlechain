import useClearingCart from '@hooks/useClearingCart';
import balanceData from './balanceData.json';
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
  });

  it('당일 미송 filter', () => {
    //TODO: 추후 정밀한 테스트 코드 추가되어야함
    expect(result.current.cart.reserveSubtractList.length).toBe(3);
  });
  it('미송 차감 filter', () => {
    //TODO: 추후 정밀한 테스트 코드 추가되어야함
    expect(result.current.cart.reserveSubtractList.length).toBe(3);
  });
  it('매입 차감 filter', () => {
    //TODO: 추후 정밀한 테스트 코드 추가되어야함
    expect(result.current.cart.adjustmentSubtractList.length).toBe(1);
  });
});

export {};

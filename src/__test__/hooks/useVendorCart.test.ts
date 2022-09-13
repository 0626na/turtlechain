import { ResponseVendorInventory } from '@apis/vendorAPI';
import useVendorCart from '@hooks/useVendorCart';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import { RecoilRoot } from 'recoil';
import parseVendorData from './parseVendorData.json';

describe('vendorCart 테스트', () => {
  // hook 세팅
  const { result } = renderHook(useVendorCart, {
    // recoil 환경 설정
    wrapper: RecoilRoot,
  });

  act(() => {
    result.current.ready(parseVendorData as ResponseVendorInventory);
  });

  it('성공테스트', () => {
    expect(result.current.cart.successList.length).toBe(2);
  });
  it('펜딩테스트', () => {
    expect(result.current.cart.pendingList.length).toBe(27);
  });
});

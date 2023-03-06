import { ResponseVendorInventory } from '@apis/vendorAPI';
import { renderHook } from '@testing-library/react-hooks';
import react from 'react';
import { RecoilRoot } from 'recoil';
import { useVendorCart } from '..';
import vendorTest from './data/vendorTest.json';

jest.mock('@apis/vendorAPI');
describe('useVendor hook Test', () => {
  test('거래처 등록 test', () => {
    const { result } = renderHook(useVendorCart, { wrapper: RecoilRoot });

    result.current.ready(vendorTest as ResponseVendorInventory);

    expect(result.current.cart.successList.length).toBe(4);
  });
});

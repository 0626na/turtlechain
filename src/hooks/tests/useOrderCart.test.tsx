import { RecoilRoot } from 'recoil';
import {
  ResponseCreateOrderItemExcelParsing,
  StoreOrderItemExcelParsing,
} from '@apis/orderAPI';
import useOrderCart from '@hooks/useOrderCart';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import order__onlySuccess from './data/order__onlySuccess.json';
import order__SuccessAndFail from './data/order__SuccessAndFail.json';
import order__singleAdd from './data/order__singleAdd.json';
import '@testing-library/jest-dom/extend-expect';

describe('useOrderCart hook Test', () => {
  afterEach(() => {
    const { result } = renderHook(useOrderCart, {
      wrapper: RecoilRoot,
    });

    act(() => {
      result.current.reset();
    });
  });

  test('발주등록: 실패없이 성공만 등록되는 test', () => {
    const { result } = renderHook(useOrderCart, {
      wrapper: RecoilRoot,
    });

    act(() => {
      result.current.ready(
        order__onlySuccess as ResponseCreateOrderItemExcelParsing,
      );
    });

    expect(result.current.cart.successList[0].orders.length).toBe(67);
  });

  test('발주등록: 성공,실패 둘다 등록되는 test', () => {
    const { result } = renderHook(useOrderCart, {
      wrapper: RecoilRoot,
    });

    act(() => {
      result.current.ready(
        order__SuccessAndFail as ResponseCreateOrderItemExcelParsing,
      );
    });

    expect(result.current.cart.successList[0].orders.length).toBe(46);
    expect(result.current.cart.failList[0].orders.length).toBe(21);
  });

  test('발주수량 합계 test', () => {
    const { result } = renderHook(useOrderCart, {
      wrapper: RecoilRoot,
    });

    act(() => {
      result.current.ready(
        order__SuccessAndFail as ResponseCreateOrderItemExcelParsing,
      );
    });

    expect(result.current.countOrdersForType().total).toBe(58);
  });

  test('하나씩 추가 test', () => {
    const { result } = renderHook(useOrderCart, {
      wrapper: RecoilRoot,
    });

    act(() => {
      result.current.addSingleOrder(
        order__singleAdd.data as StoreOrderItemExcelParsing,
      );
    });

    expect(result.current.cart.successList[0].orders.length).toBe(1);
    expect(result.current.cart.successList[0].type).toBe('single');
    expect(result.current.cart.successList[0].orders[0].creation_type).toBe(
      'single',
    );
  });

  test('발주금액 합계 test', () => {
    const { result } = renderHook(useOrderCart, {
      wrapper: RecoilRoot,
    });

    act(() => {
      result.current.ready(
        order__onlySuccess as ResponseCreateOrderItemExcelParsing,
      );
    });

    expect(result.current.calculateTotalPrice()).toBe(1694000);
  });
});

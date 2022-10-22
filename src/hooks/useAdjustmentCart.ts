import { adjustmentCartState } from './../store/adjustmentCartState';
import { useRecoilState } from 'recoil';
import { WarehousingItem } from '@apis/warehousingAPI';

const useAdjustmentCart = () => {
  const [cart, setCart] = useRecoilState(adjustmentCartState);

  const warehousingItemSelect = (record: WarehousingItem) => {
    if (cart.selectedList.find((item) => item.id === record.id)) {
      setCart((cart) => ({
        ...cart,
        selectedList: cart.selectedList.filter((item) => item.id !== record.id),
      }));

      return;
    }

    setCart((cart) => ({
      ...cart,
      selectedList: [...cart.selectedList, record],
    }));
  };

  const warehousingItemSelectAll = (
    records: WarehousingItem[],
    totalCount: number,
  ) => {
    if (cart.selectedList.length === totalCount) {
      setCart((cart) => ({ ...cart, selectedList: [] }));

      return;
    }

    setCart((cart) => ({ ...cart, selectedList: [...records] }));
  };
  //AdjustmentItemList의 필드값중 변경대상을 type으로 받아 업데이트 시킨다.
  const exchangeRefundItemUpdate = (
    type: string,
    index: number, // id
    value: number | string,
  ) => {
    setCart((cart) => ({
      ...cart,
      adjustmentItemList: cart.adjustmentItemList.map((item) =>
        item.index === index ? { ...item, [type]: value } : item,
      ),
    }));
  };

  const exchangeRefundItemDelete = (index: number) => {
    setCart((cart) => ({
      ...cart,
      adjustmentItemList: cart.adjustmentItemList.filter(
        (item) => item.index !== index,
      ),
    }));
  };

  return {
    cart,
    setCart,
    warehousingItemSelect,
    warehousingItemSelectAll,
    exchangeRefundItemUpdate,
    exchangeRefundItemDelete,
  };
};

export default useAdjustmentCart;

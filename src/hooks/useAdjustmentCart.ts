import { adjustmentCartState } from './../store/adjustmentCartState';
import { useRecoilState } from 'recoil';
import { WarehousingItem } from '@apis/warehousingAPI';

const useAdjustmentCart = () => {
  const [cart, setCart] = useRecoilState(adjustmentCartState);

  const selectWarehousingItem = (record: WarehousingItem) => {
    if (
      cart.selectedWarehousingItemList.find((item) => item.id === record.id)
    ) {
      setCart((cart) => ({
        ...cart,
        selectedWarehousingItemList: cart.selectedWarehousingItemList.filter(
          (item) => item.id !== record.id,
        ),
      }));

      return;
    }

    setCart((cart) => ({
      ...cart,
      selectedWarehousingItemList: [
        ...cart.selectedWarehousingItemList,
        record,
      ],
    }));
  };

  const selectAllWarehousingItem = (
    records: WarehousingItem[],
    totalCount: number,
  ) => {
    if (cart.selectedWarehousingItemList.length === totalCount) {
      setCart((cart) => ({ ...cart, selectedWarehousingItemList: [] }));

      return;
    }

    setCart((cart) => ({ ...cart, selectedWarehousingItemList: [...records] }));
  };
  //AdjustmentItemList의 필드값중 변경대상을 type으로 받아 업데이트 시킨다.
  const updateExchangeTakebackItem = (
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

  const deleteExchangeTakebackItem = (index: number) => {
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
    selectWarehousingItem,
    selectAllWarehousingItem,
    updateExchangeTakebackItem,
    deleteExchangeTakebackItem,
  };
};

export default useAdjustmentCart;

import { t } from 'i18next';
import { message } from 'antd';
import { useRecoilState } from 'recoil';
import { storeState } from '@store/storeState';
import { StoreShow } from '@apis/retailerStoreAPI';

function useStore() {
  const [store, setStore] = useRecoilState(storeState);

  const isOpen = (store: StoreShow) => !store.is_closed;

  const fillStoreList = (storeList: StoreShow[]) => {
    setStore({
      list: storeList.filter(isOpen),
      selected: undefined,
    });
  };

  const selectDefaultStore = (storeList: StoreShow[]) => {
    if (storeList.length === 0) return;

    setStore((store) => ({
      ...store,
      selected: storeList.filter(isOpen)[0],
    }));
  };

  const selectStore = (id: number, warningMessage?: string) => {
    // 이미 선택된 쇼핑몰이 있으면 confirm 받고 false 시 return;
    if (store.selected && warningMessage && !window.confirm(warningMessage)) {
      return;
    }

    setStore((store) => ({
      ...store,
      selected: store.list.find((item) => item.id === id),
    }));
  };

  const isStoreSelected = () => {
    // 쇼핑몰 선택되어 있지 않으면 경고 message 출력후 return false
    if (!store.selected) {
      message.warn(t('message.select store'));
      return false;
    }
    // 쇼핑몰 선택되어 있으면 return true
    return true;
  };

  return {
    store,
    isStoreSelected,
    fillStoreList,
    selectDefaultStore,
    selectStore,
  };
}

export default useStore;

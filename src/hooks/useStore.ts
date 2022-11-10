import { t } from 'i18next';
import { useRecoilState } from 'recoil';
import { storeState } from '@store/storeState';
import { StoreShow } from '@apis/retailerStoreAPI';
import { message } from '@utils/message';
import { useCallback } from 'react';

const isOpen = (store: StoreShow) => !store.is_closed;
const STORE_TOKEN = 'TC_SELECTED_STORE_ID';

function useStore() {
  const [store, setStore] = useRecoilState(storeState);

  const fillStoreList = useCallback((storeList: StoreShow[]) => {
    const openedStoreList = storeList
      .filter(isOpen)
      // 한글 오름차순 정렬
      .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

    const findSelectedStore = (openedStoreList: StoreShow[]) => {
      // storeList가 비어있으면 undefined를 return
      if (openedStoreList.length === 0) {
        return undefined;
      }

      const selectedStoreId = localStorage.getItem(STORE_TOKEN);

      // localStorage에 존재하지 않으면 첫번째 return
      if (!selectedStoreId) {
        return openedStoreList[0];
      }

      // localStorage에 존재하면 찾아본다.
      // 있으면 해당 store return, 없으면 첫번째 store return
      return (
        openedStoreList.find((store) => store.id === Number(selectedStoreId)) ??
        openedStoreList[0]
      );
    };

    setStore({
      list: openedStoreList,
      selected: findSelectedStore(openedStoreList),
    });
  }, []);

  const selectStore = useCallback(
    (id: number, warningMessage?: string) => {
      // 이미 선택된 쇼핑몰이 있으면 confirm 받고 false 시 return;
      if (store.selected && warningMessage && !window.confirm(warningMessage)) {
        return;
      }

      localStorage.setItem(STORE_TOKEN, String(id));
      setStore((store) => ({
        ...store,
        selected: store.list.find((item) => item.id === id),
      }));
    },
    [store],
  );

  const isStoreSelected = useCallback(() => {
    const existSelectedStore = !!store.selected;

    // 쇼핑몰 선택되어 있으면 return true
    if (existSelectedStore) return true;

    // 쇼핑몰 선택되어 있지 않으면 경고 message 출력후 return false
    message.warn(t('message.select store'));
    return false;
  }, [store]);

  return {
    store,
    isStoreSelected,
    fillStoreList,
    selectStore,
  };
}

export default useStore;

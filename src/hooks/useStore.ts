import { t } from 'i18next';
import { useRecoilState } from 'recoil';
import { message } from 'antd';
import { storeState } from '@store/storeState';

function useStore() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [store, setStore] = useRecoilState(storeState);

  const isStoreExist = () => {
    // 쇼핑몰 선택되어 있지 않으면 경고 message 출력후 return false
    if (!store.id) {
      message.warn(t('message.select store'));
      return false;
    }
    // 쇼핑몰 선택되어 있으면 return true
    return true;
  };

  return { store, isStoreExist };
}

export default useStore;

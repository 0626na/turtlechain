import { t } from 'i18next';
import { useState, useCallback, useEffect } from 'react';
import { Select, Space, Typography } from 'antd';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { Store, storeState } from '@store/storeState';
import retailerStoreAPI from '@apis/retailerStoreAPI';

interface Props {
  warningMessage?: string;
}

function StoreSelect({ warningMessage }: Props) {
  const [store, setStore] = useRecoilState(storeState);
  const [storeList, setStoreList] = useState<Array<Store>>([]);

  // 쇼핑몰 불러오기 요청
  const getStoresQuery = useQuery(['getStoreList'], retailerStoreAPI.getList, {
    onSuccess: (data) => {
      if (data.store_list.length === 0) return;

      // storeList 채워준다.
      setStoreList(
        data.store_list
          .filter((store) => !store.is_closed)
          .map((store) => ({
            id: store.id,
            name: store.name,
            inventory_is_vat_included: store.inventory_is_vat_included,
            use_service: store.companies[0].use_service,
          })),
      );

      // 쇼핑몰이 1개일때는 해당 쇼핑몰 선택
      if (data.store_list.length === 1) {
        setStore({
          id: data.store_list[0].id,
          name: data.store_list[0].name,
          inventory_is_vat_included:
            data.store_list[0].inventory_is_vat_included,
          use_service: data.store_list[0].companies[0].use_service,
        });
      }
    },
  });

  // 쇼핑몰 선택
  const handleChange = useCallback(
    (value: number) => {
      // store.id 가 기존에 있으면 confirm 받고 false 시 return;
      if (store.id && warningMessage && !window.confirm(warningMessage)) {
        return;
      }

      // setStore 한다.
      setStore({
        id: value,
        name: storeList.find((item) => item.id === value)!.name,
        inventory_is_vat_included: storeList.find((item) => item.id === value)!
          .inventory_is_vat_included,
        use_service: storeList.find((item) => item.id === value)?.use_service!,
      });
    },
    [store, storeList, setStore, warningMessage],
  );

  useEffect(() => {
    console.log(store);
  }, [store]);

  return (
    <Space size="large">
      <Typography.Text style={{ fontSize: '16px' }}>
        {t('store.name')}
      </Typography.Text>
      <Select
        placeholder={t('description.select mall')}
        loading={getStoresQuery.isLoading}
        style={{ width: '20rem' }}
        onChange={handleChange}
        value={store.id}
      >
        {storeList.map((store) => (
          <Select.Option key={store.id} value={store.id}>
            {store.name}
          </Select.Option>
        ))}
      </Select>
    </Space>
  );
}

export default StoreSelect;

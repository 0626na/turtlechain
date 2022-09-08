import { useState, useCallback } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { Store, storeState } from '@store/storeState';
import retailerStoreAPI from '@apis/retailerStoreAPI';
import { TurtleImg } from '@components/element';
import { css } from '@emotion/react';

interface Props {
  warningMessage?: string;
}

function StoreSelector({ warningMessage }: Props) {
  const [store, setStore] = useRecoilState(storeState);
  const [storeList, setStoreList] = useState<Store[]>([]); // 폐점 쇼핑몰을 목록에서 제외시키기 위해 queryData를 바로사용하지않고 따로 상태로관리.

  // 쇼핑몰 불러오기
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStoreListQuery = useQuery(
    ['getStoreListQuery'],
    retailerStoreAPI.getList,
    {
      enabled: !store.id,
      onSuccess: (data) => {
        if (data.store_list.length === 0) return;

        setStoreList(
          data.store_list
            .filter((store) => !store.is_closed)
            .map((store) => ({
              id: store.id,
              name: store.name,
              inventory_is_vat_included: store.inventory_is_vat_included,
              version: store.companies[0].version,
            })),
        );

        // default : 첫번쨰 쇼핑몰 선택
        const defaultStore = data.store_list.find(
          (store) => store.is_closed === false,
        );

        setStore({
          id: defaultStore?.id,
          name: defaultStore?.name!,
          inventory_is_vat_included: defaultStore?.inventory_is_vat_included!,
          version: defaultStore?.companies[0].version!,
        });
      },
    },
  );

  // 쇼핑몰 선택
  const handleStoreSelect = useCallback(
    (id: number) => {
      // store.id 가 기존에 있으면 confirm 받고 false 시 return;
      if (store.id && warningMessage && !window.confirm(warningMessage)) {
        return;
      }

      setStore({
        id,
        name: storeList.find((item) => item.id === id)!.name,
        inventory_is_vat_included: storeList.find((item) => item.id === id)!
          .inventory_is_vat_included,
        version: storeList.find((item) => item.id === id)?.version!,
      });
    },
    [store, storeList, setStore, warningMessage],
  );

  return (
    <Dropdown // 이름은 DropDown지만, selector역할을 한다.
      trigger={['click']}
      overlay={
        <Menu
          css={menu}
          selectable
          onSelect={({ key }) => {
            handleStoreSelect(Number(key));
          }}
          items={storeList.map((store) => ({
            style: menuItemContainer,
            onMouseEnter: (e) => {
              e.domEvent.currentTarget.style.backgroundColor = '#EAECEF';
            },
            onMouseLeave: (e) => {
              e.domEvent.currentTarget.style.backgroundColor = '#fff';
            },
            key: store.id!,
            label: <span css={menuItemText}>{store.name}</span>,
            icon: <TurtleImg css={logo} name="Logo" />,
          }))}
        />
      }
    >
      <Button css={selectorButton}>
        <div>
          <TurtleImg css={buttonImg} name="Logo" />
        </div>
        <span css={text}>{store.name}</span>
      </Button>
    </Dropdown>
  );
}

const menu = css`
  width: 196px;
  max-height: 150px;
  overflow-y: scroll;

  padding: 8px;

  position: absolute;
  top: 0px;
  left: 28px;

  box-shadow: 0px 4px 18px rgba(34, 44, 56, 0.4);
  border-radius: 8px;
`;

const menuItemContainer = {
  color: '#5b5d63',
  fontWeight: 500,

  padding: '6px 12px',
  borderRadius: '6px',
};

const menuItemText = css`
  margin-left: 8px;
`;

const logo = css`
  border-radius: 50%;
  background: red;
  width: 28px;
  height: 28px;
  object-fit: cover;
`;

const selectorButton = css`
  color: #fff;

  width: 236px;
  height: 60px;

  display: flex;
  align-items: center;

  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);

  // antd 기본 스타일 제거
  &:focus,
  &:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const text = css`
  margin-left: 12px;
`;

const buttonImg = css`
  border-radius: 50%;
  background: yellow;
  width: 44px;
  height: 44px;
  object-fit: cover;
`;

export default StoreSelector;

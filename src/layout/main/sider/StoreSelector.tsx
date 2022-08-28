import styled from 'styled-components';

import { useState, useCallback } from 'react';
import { Button, Dropdown, Menu } from 'antd';
import { useQuery } from 'react-query';
import { useRecoilState } from 'recoil';
import { Store, storeState } from '@store/storeState';
import retailerStoreAPI from '@apis/retailerStoreAPI';
import { TurtleImg } from '@components/element';
import { SmileOutlined } from '@ant-design/icons';

/*
 * toDoList
 * 1. ui 데이터 채워넣기
 */

interface Props {
  warningMessage?: string;
}

const testData = [
  { id: 0, name: 'test1', icon: <SmileOutlined />, color: 'red' },
  { id: 1, name: 'test2', icon: <SmileOutlined />, color: 'blue' },
  { id: 2, name: 'test3', icon: <SmileOutlined />, color: 'yellow' },
];

function StoreSelect({ warningMessage }: Props) {
  const [store, setStore] = useRecoilState(storeState);
  const [storeList, setStoreList] = useState<Array<Store>>([]); // 폐점 쇼핑몰을 목록에서 제외시키기 위해 상태로관리.

  // 쇼핑몰 불러오기
  const getStoreListQuery = useQuery(
    ['getStoreList'],
    retailerStoreAPI.getList,
    {
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

        // 쇼핑몰이 1개일때는 해당 쇼핑몰 선택
        if (data.store_list.length === 1) {
          setStore({
            id: data.store_list[0].id,
            name: data.store_list[0].name,
            inventory_is_vat_included:
              data.store_list[0].inventory_is_vat_included,
            version: data.store_list[0].companies[0].version,
          });
        }
      },
    },
  );

  // 쇼핑몰 선택
  const handleStoreSelect = useCallback(
    (value: number) => {
      // store.id 가 기존에 있으면 confirm 받고 false 시 return;
      if (store.id && warningMessage && !window.confirm(warningMessage)) {
        return;
      }

      setStore({
        id: value,
        name: storeList.find((item) => item.id === value)!.name,
        inventory_is_vat_included: storeList.find((item) => item.id === value)!
          .inventory_is_vat_included,
        version: storeList.find((item) => item.id === value)?.version!,
      });
    },
    [store, storeList, setStore, warningMessage],
  );

  return (
    <Dropdown // 이름은 DropDown지만, selector역할을 한다.
      trigger={['click']}
      // loading={getStoresQuery.isLoading}
      overlay={
        <StyledMenu
          selectable
          onSelect={({ key }) => {
            // handleStoreSelect(Number(key));
          }}
          items={testData.map((store) => ({
            style: MenuItemContainerStyle,
            onMouseEnter: (e) => {
              e.domEvent.currentTarget.style.backgroundColor = '#EAECEF';
            },
            onMouseLeave: (e) => {
              e.domEvent.currentTarget.style.backgroundColor = '#fff';
            },
            key: store.id!,
            label: <MenuItemText>{store.name}</MenuItemText>,
            icon: (
              <TurtleImg
                style={{
                  borderRadius: '50%',
                  background: 'red',
                  width: 28,
                  height: 28,
                  objectFit: 'cover',
                }}
                name="Logo"
              />
            ),
          }))}
        />
      }
    >
      <SlectorButton loading={getStoreListQuery.isLoading}>
        {/* toDo -1 */}
        <div>
          <TurtleImg
            style={{
              borderRadius: '50%',
              background: 'yellow',
              width: 44,
              height: 44,
              objectFit: 'cover',
            }}
            name="Logo"
          />
        </div>

        <span style={{ marginLeft: 12 }}>쇼핑몰 이름</span>
      </SlectorButton>
    </Dropdown>
  );
}

const StyledMenu = styled(Menu)`
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

const MenuItemContainerStyle = {
  color: '#5b5d63',
  fontWeight: 500,

  padding: '6px 12px',
  borderRadius: '6px',
};

const MenuItemText = styled.span`
  margin-left: 8px;
`;

const SlectorButton = styled(Button)`
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
export default StoreSelect;

import { Button, Dropdown, Menu } from 'antd';
import { useQuery } from 'react-query';
import { ArrowRightIcon, TurtleImg } from '@components/element';
import { css } from '@emotion/react';
import retailerStoreAPI from '@apis/retailerStoreAPI';
import useStore from '@hooks/useStore';
import { t } from 'i18next';
import useUser from '@hooks/useUser';

function StoreSelector() {
  const { store, fillStoreList, selectDefaultStore, selectStore } = useStore();
  const { user } = useUser();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStoreListQuery = useQuery(
    ['getStoreListQuery'],
    retailerStoreAPI.getList,
    {
      enabled: !!user.id,
      onSuccess: (data) => {
        fillStoreList(data.store_list);
        selectDefaultStore(data.store_list);
      },
    },
  );

  return (
    <Dropdown // 이름은 DropDown지만, selector역할을 한다.
      trigger={['click']}
      overlay={
        <Menu
          css={menu}
          selectable
          onSelect={({ key }) => {
            selectStore(Number(key), t('message.warningChangeStore'));
          }}
          items={store.list.map((store) => ({
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
        <div css={selectorButtonLeft}>
          <div>
            <TurtleImg css={buttonImg} name="Logo" />
          </div>
          <span css={text}>{store.selected?.name}</span>
        </div>
        <div>
          <ArrowRightIcon value="#AAADB3" />
        </div>
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
  left: 20px;

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
  padding: 8px 12px;
  width: 216px;
  height: 60px;

  display: flex;
  align-items: center;
  justify-content: space-between;

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

const selectorButtonLeft = css`
  display: flex;
  align-items: center;
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

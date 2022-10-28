import { Button, Dropdown, Menu } from 'antd';
import { useQuery } from 'react-query';
import { ArrowRightIcon } from '@components/element';
import { css } from '@emotion/react';
import retailerStoreAPI from '@apis/retailerStoreAPI';
import useStore from '@hooks/useStore';
import { t } from 'i18next';
import useUser from '@hooks/useUser';
import { ReactComponent as StoreIcon } from '@icons/store.svg';

const color = [
  '#13BCB2',
  '#89D776',
  '#799CF5',
  '#5EE4C4',
  '#62CCEE',
  '#9F8BF0',
];

function StoreSelector() {
  const { store, fillStoreList, selectDefaultStore, selectStore } = useStore();
  const { user } = useUser();

  const getStoreListQuery = useQuery(
    ['getStoreList', 'sider'],
    retailerStoreAPI.getList,
    {
      enabled: !!user.id,
      onSuccess: (data) => {
        const sortedAscending = data.store_list.sort((a, b) =>
          a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
        ); // 한글 오름차순,
        fillStoreList(sortedAscending);
        selectDefaultStore(sortedAscending);
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
          items={store.list.map((store, idx) => ({
            style: menuItemCss.self,
            onMouseEnter: (e) => {
              e.domEvent.currentTarget.style.backgroundColor = '#EAECEF';
            },
            onMouseLeave: (e) => {
              e.domEvent.currentTarget.style.backgroundColor = '#fff';
            },
            key: store.id,
            label: <span css={menuItemCss.text}>{store.name}</span>,
            icon: (
              <div css={menuItemCss.logoContainer}>
                <div css={menuItemCss.logo}>
                  <StoreIcon style={{ fill: color[idx % color.length] }} />
                </div>
              </div>
            ),
          }))}
        />
      }
    >
      <Button css={buttonCss.self}>
        <div css={buttonCss.container}>
          <div css={buttonCss.logoContainer}>
            <div css={buttonCss.logo}>
              <StoreIcon
                css={buttonCss.icon}
                style={{
                  ['--fill-color' as string]:
                    color[
                      store.list.findIndex(
                        (item) => item.name === store.selected?.name,
                      ) % color.length
                    ],
                }}
              />
            </div>
          </div>

          <span css={buttonCss.text}>{store.selected?.name}</span>
        </div>

        <div>
          <ArrowRightIcon value="#AAADB3" />
        </div>
      </Button>
    </Dropdown>
  );
}

const menu = css({
  width: 196,
  maxHeight: 150,
  position: 'absolute',
  top: 0,
  left: 20,
  overflow: 'overlay',

  padding: 8,

  boxShadow: '0px 4px 18px rgba(34, 44, 56, 0.4)',
  borderRadius: 8,
});

const menuItemCss = {
  self: {
    color: '#5b5d63',
    fontWeight: 500,

    padding: '6px 12px',
    borderRadius: '6px',
  },

  text: css({
    display: 'inline-block',
    whiteSpace: 'nowrap',
    width: 90,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginLeft: 8,
  }),

  logoContainer: css({
    width: 28,
    height: 28,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: '50%',
    background: '#363b45',
  }),

  logo: css({
    position: 'absolute',
    top: 7,
    left: 5,
  }),
};

const buttonCss = {
  self: css({
    color: '#fff',
    padding: '8px 12px',
    width: 216,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.1)',

    // antd 기본 스타일 제거
    '&:focus,&:hover': {
      color: '#fff',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
  }),

  container: css({
    display: 'flex',
    alignItems: 'center',
  }),

  text: css({
    display: 'inline-block',
    width: 120,
    textAlign: 'left',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginLeft: 12,
  }),

  logoContainer: css({
    position: 'relative',
    borderRadius: '50%',
    background: '#fff',
    width: 44,
    height: 44,
    overflow: 'hidden',
  }),
  logo: css({
    position: 'absolute',
    top: 11,
    left: 8,
  }),
  icon: css({
    width: 34,
    height: 34,
    fill: 'var(--fill-color)',
  }),
};

export default StoreSelector;

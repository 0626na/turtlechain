import { Button } from 'antd';
import { useQuery } from 'react-query';
import { ArrowRightIcon } from '@components/element';
import { css } from '@emotion/react';
import useStore from '@hooks/useStore';

import { useNavigate } from 'react-router-dom';
import useUser from '@hooks/useUser';
import { ReactComponent as StoreIcon } from '@icons/store.svg';
import pickerAPI from '@apis/pickerAPI';
import { t } from 'i18next';

function StoreButton() {
  const navigate = useNavigate();
  const { store, fillStoreList } = useStore();
  const { user } = useUser();
  const getStoreListQuery = useQuery(['getStoreList'], pickerAPI.getList, {
    enabled: !!user,
    onSuccess: (data) => {
      fillStoreList(data.data.store_list);
    },
  });

  return (
    <Button
      css={buttonCss.self}
      onClick={() => {
        navigate('/picker/setting');
      }}
    >
      <div css={buttonCss.container}>
        <div css={buttonCss.logoContainer}>
          <div css={buttonCss.logo}>
            <StoreIcon css={buttonCss.icon} />
          </div>
        </div>

        <div css={buttonCss.textContainer}>
          <span css={buttonCss.topText}>{t('button.connectedStores')}</span>
          <span css={buttonCss.bottomText}>
            {t('store.selectButton', {
              store: store.selected?.name,
              storeCount: (getStoreListQuery.data?.data.total_count ?? 0) - 1,
            })}
          </span>
        </div>
      </div>

      <div>
        <ArrowRightIcon value="#AAADB3" />
      </div>
    </Button>
  );
}

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
    fill: '#13BCB2',
  }),

  textContainer: css({
    textAlign: 'left',
    marginLeft: 12,
  }),
  topText: css({
    fontSize: 12,
    color: '#a1a2a6',
  }),
  bottomText: css({
    width: 120,
    display: 'block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  }),
};

export default StoreButton;

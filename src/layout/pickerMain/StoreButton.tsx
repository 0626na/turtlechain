import { Button } from 'antd';
import { useQuery } from 'react-query';
import { ArrowRightIcon, TurtleImg } from '@components/element';
import { css } from '@emotion/react';
import retailerStoreAPI from '@apis/retailerStoreAPI';
import useStore from '@hooks/useStore';

import { useNavigate } from 'react-router-dom';

function StoreButton() {
  const navigate = useNavigate();
  const { store, fillStoreList, selectDefaultStore } = useStore();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getStoreListQuery = useQuery(
    ['getStoreListQuery'],
    retailerStoreAPI.getList,
    {
      enabled: !store.selected,
      onSuccess: (data) => {
        fillStoreList(data.store_list);
        selectDefaultStore(data.store_list);
      },
    },
  );

  return (
    <Button
      css={storeButton}
      onClick={() => {
        navigate('/picker/setting');
      }}
    >
      <div css={storeButtonLeft}>
        <div>
          <TurtleImg css={buttonImg} name="Logo" />
        </div>
        <div css={buttonContent}>
          <span css={contentTop}>연결된 쇼핑몰</span>
          <span css={contentBottom}>{store.selected?.name} 외 19개</span>
        </div>
      </div>
      <div>
        <ArrowRightIcon value="#AAADB3" />
      </div>
    </Button>
  );
}

const storeButton = css`
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

const storeButtonLeft = css`
  display: flex;
  align-items: center;
`;

const buttonContent = css`
  margin-left: 12px;
  text-align: left;
`;

const contentTop = css`
  display: block;
  color: #a1a2a6;
  font-size: 12px;
`;

const contentBottom = css`
  display: block;
`;

const buttonImg = css`
  border-radius: 50%;
  background: yellow;
  width: 44px;
  height: 44px;
  object-fit: cover;
`;

export default StoreButton;

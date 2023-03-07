import React, { useEffect, useMemo, useState } from 'react';
import pickerAPI from '@apis/pickerAPI';
import { StoreShow } from '@apis/retailerStoreAPI';
import {
  AddButton,
  GridIcon,
  SpecialButton,
  TurtleIcon,
  TurtleSearchInput,
  TurtleTableTitle,
  TurtleTabs,
  TurtleTag,
  TurtleText,
} from '@components/element';
import { css } from '@emotion/react';
import useModal from '@hooks/useModal';
import useUser from '@hooks/useUser';
import { PageContent } from '@layout/page';
import { phonePattern } from '@utils/pattern';
import { Col, Row, Table, Tabs } from 'antd';
import { t } from 'i18next';
import { useMutation, useQuery } from 'react-query';
import StorePickerCard from './card/StorePickerCard';
import DetailPickerModal from './modals/DetailPickerModal';
import DeleteOrderModal from '@components/combine/modal/DeleteOrderModal';
import { message } from '@utils/message';
import AddStoreForPickerModal from './modals/AddStoreForPickerModal';
import StoreTab from './tabs/StoreTab';
import UserTab from './tabs/UserTab';
import { useSearchParams } from 'react-router-dom';

function PageBody() {
  const [mode, setMode] = useState<'cardView' | 'listView'>('listView');
  const { user } = useUser();
  const [selectedRow, setSelectedRow] = useState<StoreShow>();
  const [searchQuery, setSearchQuery] = useState('');
  const [detailModalVisible, openDetailModal, closeDetailModal] = useModal();
  const [addModalVisible, openAddDetailModal, closeAddDetailModal] = useModal();
  const [removeModalVisible, openRemoveModal, closeRemoveModal] = useModal();

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    // 초기 진입시 store로 설정.
    if (!searchParams.get('tab')) setSearchParams({ tab: 'store' });
  }, [searchParams, setSearchParams]);
  /**
   * 현재 picker 계정에 등록된 쇼핑몰 리스트 불러오는 react-query
   */
  const {
    data: storeList,
    isLoading,
    refetch,
  } = useQuery(['getStoreList'], pickerAPI.getList, {
    enabled: !!user,
  });

  const removeStoreMutation = useMutation(pickerAPI.remove, {
    onSuccess: () => {
      message.success(t('message.delete store'), 3);
      refetch();
    },
  });

  const filteredList = useMemo(() => {
    return storeList?.data.store_list.filter(
      (store) =>
        store.name.includes(searchQuery) ||
        store.store_phone[0].phone.includes(searchQuery),
    );
  }, [storeList, searchQuery]);

  const changeMode = () => {
    setMode((mode) => {
      if (mode === 'cardView') return 'listView';
      return 'cardView';
    });
  };

  return (
    <TurtleTabs
      color="dark"
      activeKey={searchParams.get('tab') as string}
      onChange={(newKey) => {
        setSearchParams({ tab: newKey });
      }}
    >
      <Tabs.TabPane key="store" tab={t('description.store management')}>
        <div css={whiteContainer}>
          <StoreTab />
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane key="user" tab={t('description.manage accounts')}>
        <UserTab />
      </Tabs.TabPane>
    </TurtleTabs>
  );
}

const cardsContainer = css`
  height: 70vh;
  overflow: auto;
`;

const whiteContainer = css`
  padding: 30px 36px 0px 36px;
`;

export default PageBody;

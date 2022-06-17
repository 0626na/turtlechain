import { t } from 'i18next';
import { Popconfirm, message, Menu, Tabs } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { MainContent, MenuBar, BottomBar } from '@layout/main';
import adjustmentAPI, { AdjustmentItem } from '@apis/adjustmentAPI';
import { storeState } from '@store/storeState';
import { adjustmentCartState } from '@store/adjustmentCartState';
import { TurtleButton, TurtleDropdown } from '@components/common';
import { useStoreExist } from '@hooks/index';
import LoadWarehousingModal from './LoadWarehousingModal';
import SuccessTab from './SuccessTab';
import AddProductModal from './AddProductModal';
import { useHistory } from 'react-router-dom';

const PageBody = function () {
  const history = useHistory();
  const store = useRecoilValue(storeState);
  const isStoreExist = useStoreExist();
  const [cart, setCart] = useRecoilState(adjustmentCartState);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const [loadWarehousingModalVisible, setLoadWarehousingModalVisible] =
    useState(false);
  const index = useRef(0);

  // 매입조정 생성 요성
  const createQuery = useMutation(['createAdjustment'], adjustmentAPI.create, {
    onSuccess: () => {
      resetStates();
      message.success(t('message.success create adjustment'));
      history.push('/adjustment/list');
    },
  });

  // 상태 초기화
  const resetStates = useCallback(() => {
    setCart({ successList: [] });
  }, [setCart]);

  // 초기 상태 세팅
  useEffect(() => {
    resetStates();
  }, [store.id, resetStates]);

  // 상품 추가
  const addItem = useCallback(
    (item: AdjustmentItem) => {
      setCart((cart) => ({
        ...cart,
        successList: [{ ...item, index: index.current++ }, ...cart.successList],
      }));
      return true;
    },
    [setCart],
  );

  // 수량, 종류 선택되었는지 확인
  const validateSuccessList = useCallback(() => {
    let isValid = true;
    cart.successList.forEach((item) => {
      if (item.type === '' || item.product_count === 0) {
        isValid = false;
        return;
      }
    });
    return isValid;
  }, [cart.successList]);

  // 매입조정 등록하기 버튼 클릭
  const onClickCreate = useCallback(() => {
    if (!validateSuccessList()) {
      message.warn('매입조정 수량, 종류를 확인해주세요.');
      return;
    }
    createQuery.mutate({
      item_list: cart.successList.map((item) => ({
        rt_store_id: store.id!,
        vendor_id: item.vendor_id,
        product_id: item.product_id,
        warehousing_item_id: item.warehousing_item_id,
        count: item.product_count,
        price: item.product_price,
        type: item.type,
        is_vat_included: item.is_vat_included,
        memo: item.memo,
      })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.id, cart, validateSuccessList]);

  const menu = (
    <Menu>
      <Menu.Item
        key="1"
        onClick={() => {
          if (!isStoreExist()) return;
          setLoadWarehousingModalVisible(true);
        }}
      >
        {t('button.load warehousing')}
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          if (!isStoreExist()) return;
          setAddProductModalVisible(true);
        }}
      >
        {t('button.add reserve product')}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <MenuBar isWarning>
        <TurtleDropdown
          menu={menu} //
        >
          {t('button.add adjustment')}
        </TurtleDropdown>
      </MenuBar>

      <MainContent title={t('adjustment.preview')}>
        {/* 성공 탭 */}
        <Tabs defaultActiveKey="1" size="large" style={{ width: '100%' }}>
          <SuccessTab tab={`성공(${cart.successList.length})`} key="1" />
        </Tabs>

        {/* 입고내역 불러오기 모달*/}
        <LoadWarehousingModal
          visible={loadWarehousingModalVisible}
          closeModal={() => {
            setLoadWarehousingModalVisible(false);
          }}
          addItem={addItem}
        />

        {/* 미송상품 단건 추가 모달 */}
        <AddProductModal
          visible={addProductModalVisible}
          closeModal={() => {
            setAddProductModalVisible(false);
          }}
          addItem={addItem}
        />
      </MainContent>

      <BottomBar>
        <Popconfirm
          title={t('description.really register')}
          okText={t('yes')}
          cancelText={t('no')}
          onConfirm={onClickCreate}
        >
          <TurtleButton
            type="primary"
            disabled={cart.successList.length === 0}
            loading={createQuery.isLoading}
          >
            {t('button.create adjustment')}
          </TurtleButton>
        </Popconfirm>
      </BottomBar>
    </>
  );
};

export default PageBody;

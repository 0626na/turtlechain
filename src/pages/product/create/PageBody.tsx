import { useCallback, useEffect, useState } from 'react';
import { Menu, message, Popconfirm, Tabs } from 'antd';
import { t } from 'i18next';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { BottomBar, MainContent, MenuBar } from '@layout/page';
import productAPI, { ResponseConnectInventory } from '@apis/productAPI';
import {
  TurtleButton,
  TurtleButtonSub,
  TurtleDropdown,
  TurtleUpload,
} from '@components/common';
import { storeState } from '@store/storeState';
import { productCartState } from '@store/productCartState';
import { useStoreExist } from '@hooks/index';
import SuccessTab from './SuccessTab';
import FailTab from './FailTab';
import AddSingleProductModal from './AddProductModal';

function PageBody() {
  const navigate = useNavigate();
  const store = useRecoilValue(storeState);
  const isStoreExist = useStoreExist();
  const [cart, setCart] = useRecoilState(productCartState);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);

  // 엑셀파싱 요청
  const parseQuery = useMutation('parseProduct', productAPI.parseExcel, {
    onSuccess: (data) => {
      updateStates(data);
    },
  });

  // 재고관리 연동 요청
  const connectQuery = useMutation(
    'connectProduct',
    productAPI.connectInventory,
    {
      onSuccess: (data) => {
        updateStates(data);
      },
    },
  );

  // 상품 생성 요청
  const createQuery = useMutation(
    ['createProduct'], //
    productAPI.create,
    {
      onSuccess: (data) => {
        resetStates();
        message.success(
          `성공적으로 등록하였습니다. 성공 : ${data.data.success} 중복된 상품 : ${data.data.fail}`,
        );
        navigate('/product/list');
      },
    },
  );

  // 모든 상태 초기화
  const resetStates = useCallback(() => {
    setCart({
      fileList: [],
      successList: [],
      failList: [],
    });
    connectQuery.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCart]);

  // 파싱 or 연동 후 상태 세팅
  const updateStates = useCallback(
    (data: ResponseConnectInventory) => {
      if (data.data.error) {
        message.error(data.data.error);
        resetStates();
        return;
      }
      setCart((cart) => ({
        ...cart,
        successList: [
          ...data.data.success.map((product) => ({
            ...product,
            memo_value: product.memo,
            memo_active: !!product.memo,
          })),
          ...cart.successList,
        ],
        failList: [...data.data.fail, ...cart.failList],
      }));
      message.info(
        `이미 등록된 상품이 ${data.data.count.duplicated_count}건 있습니다.`,
      );
    },
    [resetStates, setCart],
  );

  // 쇼핑몰 변경시 모든 state 초기화
  useEffect(() => {
    resetStates();
  }, [store.id, resetStates]);

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <TurtleUpload //
          beforeUpload={(file) => {
            setCart((cart) => ({ ...cart, fileList: [file] }));
            parseQuery.mutate({
              files: file,
              rt_store_id: store.id!,
            });
          }}
          onRemove={resetStates}
          fileList={cart.fileList}
        />
      </Menu.Item>
      <Menu.Item
        key="2"
        onClick={() => {
          if (!isStoreExist()) return;
          setAddProductModalVisible(true);
        }}
      >
        {t('button.add single product')}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <MenuBar isWarning>
        <TurtleButtonSub
          type="primary"
          color="skyblue"
          onClick={() => {
            if (!isStoreExist()) return;
            connectQuery.mutate({ rt_store_id: store.id! });
          }}
          disabled={connectQuery.isSuccess}
        >
          {t('button.connect external program')}
        </TurtleButtonSub>
        <TurtleDropdown //
          menu={menu}
        >
          {t('button.add product')}
        </TurtleDropdown>
      </MenuBar>

      <MainContent
        title={t('product.preview')}
        info={t('description.fail product')}
      >
        {/* 성공 실패 탭 */}
        <Tabs defaultActiveKey="1" size="large" style={{ width: '100%' }}>
          <SuccessTab
            key="1"
            tab={`성공(${cart.successList.length})`}
            loading={connectQuery.isLoading || parseQuery.isLoading}
          />
          <FailTab
            key="2"
            tab={`실패(${cart.failList.length})`}
            loading={connectQuery.isLoading || parseQuery.isLoading}
          />
        </Tabs>

        {/* 상품 단건 추가 모달 */}
        <AddSingleProductModal
          visible={addProductModalVisible}
          closeModal={() => {
            setAddProductModalVisible(false);
          }}
        />
      </MainContent>

      <BottomBar>
        <Popconfirm
          title={t('description.really register')}
          okText={t('yes')}
          cancelText={t('no')}
          onConfirm={() => {
            createQuery.mutate(
              cart.successList.map((product) => ({
                ...product,
                rt_store_id: store.id!,
                image_url: product.image_url ?? '',
                memo: product.memo ?? '',
              })),
            );
          }}
        >
          <TurtleButton
            type="primary"
            disabled={cart.successList.length === 0}
            loading={createQuery.isLoading}
          >
            {t('button.create product')}
          </TurtleButton>
        </Popconfirm>
      </BottomBar>
    </>
  );
}

export default PageBody;

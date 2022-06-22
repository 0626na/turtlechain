import moment from 'moment';
import { t } from 'i18next';
import { useMutation } from 'react-query';
import { RcFile } from 'antd/lib/upload';
import { useCallback, useEffect, useRef, useState } from 'react';
import { message, Menu, Tabs, Popconfirm } from 'antd';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useHistory } from 'react-router-dom';
import { storeState } from '@store/storeState';
import { BottomBar, MainContent, MenuBar } from '@layout/main';
import {
  TurtleButton,
  TurtleButtonSub,
  TurtleDropdown,
  TurtleUpload,
} from '@components/common';
import { useStoreExist } from '@hooks/index';
import { warehousingCartState } from '@store/warehousingCartState';
import warehousingAPI, { ResponseConnectInventory } from '@apis/warehousingAPI';
import AddProductModal from './AddProductModal';
import SuccessTab from './SuccessTab';
import FailTab from './FailTab';

function PageBody() {
  const history = useHistory();
  const store = useRecoilValue(storeState);
  const isStoreExist = useStoreExist();
  const [cart, setCart] = useRecoilState(warehousingCartState);
  const [addProductModalVisible, setAddProductModalVisible] = useState(false);
  const index = useRef(0);

  // 엑셀파싱 요청
  const parseQuery = useMutation(
    'parseWarehousing',
    warehousingAPI.parseExcel,
    {
      onSuccess: (data) => {
        updateStates(data);
      },
    },
  );

  // 재고관리 연동 요청
  const connectQuery = useMutation(
    'connectWarehousing',
    warehousingAPI.connectInventory,
    {
      onSuccess: (data) => {
        updateStates(data);
      },
    },
  );

  // 입고장 생성 요청
  const createQuery = useMutation('createWarehousing', warehousingAPI.create, {
    onSuccess: () => {
      resetStates();
      message.success(t('message.success create warehousing'));
      history.push('/warehousing/list');
    },
  });

  // 모든 상태 초기화
  const resetStates = useCallback(() => {
    setCart({
      fileList: [],
      successList: [],
      failList: [],
      searchQuery: { type: 'vendor_name', search_string: '' },
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
          ...data.data.success.map((item) => ({
            ...item,
            is_reserved: false,
            index: index.current++,
          })),
          ...cart.successList,
        ],
        failList: [...data.data.fail, ...cart.failList],
      }));
    },
    [resetStates, setCart],
  );

  // 엑셀파일 파싱
  const parseFile = (file: RcFile) => {
    setCart((cart) => ({ ...cart, fileList: [file] }));
    const form = new FormData();
    form.append('files', file);
    form.append('rt_store_id', store.id!.toString());
    parseQuery.mutate(form);
  };

  // 쇼핑몰 변경시 모든 state 초기화
  useEffect(() => {
    resetStates();
  }, [store.id, resetStates]);

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <TurtleUpload //
          beforeUpload={parseFile}
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
        <TurtleDropdown menu={menu}>
          {t('button.add warehousing')}
        </TurtleDropdown>
      </MenuBar>

      <MainContent
        title={t('warehousing.preview')}
        info={t('description.check confirm')}
      >
        {/* 성공 실패 탭*/}
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
        <AddProductModal
          visible={addProductModalVisible}
          closeModal={() => {
            setAddProductModalVisible(false);
          }}
          index={index}
        />
      </MainContent>

      <BottomBar>
        <Popconfirm
          title={t('description.really register')}
          okText={t('yes')}
          cancelText={t('no')}
          onConfirm={() => {
            createQuery.mutate({
              sheet: {
                created_date: moment().format('YYYY-MM-DD'),
                rt_store_id: store.id!,
              },
              item: {
                rt_store_id: store.id!,
                item_list: cart.successList.map((record) => ({
                  vendor_id: record.vendor_id,
                  product_id: record.product_id,
                  count: record.count,
                  price: record.price,
                  is_reserved: record.is_reserved,
                  memo: record.memo,
                })),
              },
            });
          }}
        >
          <TurtleButton
            type="primary"
            disabled={cart.successList.length === 0}
            loading={createQuery.isLoading}
          >
            {t('button.create warehousing')}
          </TurtleButton>
        </Popconfirm>
      </BottomBar>
    </>
  );
}

export default PageBody;
